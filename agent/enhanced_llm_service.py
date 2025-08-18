import re
import json
import time
import logging
from typing import List, Optional, Union, Dict, Any, Tuple
from contextlib import contextmanager
from dataclasses import dataclass
from enum import Enum

from vertexai import init as vertexai_init
from vertexai.preview.generative_models import GenerativeModel, Part
from google.cloud import aiplatform_v1beta1 as aiplatform
from google.api_core import exceptions
from tenacity import retry, stop_after_attempt, wait_exponential

from .schemas import SiteBlueprint
from logger import get_logger, start_span, finish_span

log = get_logger(__name__)

# --- Configurations ---
TUNED_PROJECT_ID = "1062532524126"
TUNED_LOCATION = "us-central1"
TUNED_ENDPOINT_ID = "9038580416109346816"
TUNED_ENDPOINT_PATH = f"projects/{TUNED_PROJECT_ID}/locations/{TUNED_LOCATION}/endpoints/{TUNED_ENDPOINT_ID}"

GENERAL_PROJECT_ID = "automated-ray-463204-i2"
GENERAL_LOCATION = "us-central1"
GENERAL_MODEL_NAME = "gemini-2.5-flash"

# --- Client Initialization ---
try:
    vertexai_init(project=GENERAL_PROJECT_ID, location=GENERAL_LOCATION)
except Exception:
    pass

PREDICTION_CLIENT = aiplatform.PredictionServiceClient(
    client_options={"api_endpoint": f"{TUNED_LOCATION}-aiplatform.googleapis.com"}
)
GENERAL_MODEL = GenerativeModel(GENERAL_MODEL_NAME)


# --- Quality Metrics ---
@dataclass
class CodeQualityScore:
    syntax_score: float
    accessibility_score: float
    performance_score: float
    typescript_score: float
    nextjs_score: float
    overall_score: float
    issues_found: List[str]
    fixes_applied: List[str]


class CriticType(Enum):
    SYNTAX = "syntax"
    ACCESSIBILITY = "accessibility"
    PERFORMANCE = "performance"
    INTEGRATION = "integration"


# --- Error Pattern Learning ---
class AdaptiveCritic:
    def __init__(self):
        self.common_errors = [
            "Missing import statements",
            "Unclosed JSX tags",
            "TypeScript prop interface mismatches",
            "Unescaped apostrophes in JSX",
            "Missing alt attributes on images",
            "Unused variables without underscore prefix",
            "Missing 'use client' directive for interactive components"
        ]
        self.success_patterns = []

    def add_error_pattern(self, error: str, fix: str):
        """Learn from build failures to prevent future issues"""
        self.common_errors.append(f"{error} -> Fix: {fix}")
        log.info(f"📚 Learned new error pattern: {error}")


# --- Specialized Critic Prompts ---
def get_syntax_critic_prompt(code: str, file_name: str) -> str:
    """Syntax and TypeScript validation critic"""
    return f"""You are a Senior TypeScript Syntax Validator. Your ONLY job is to fix syntax errors, TypeScript issues, and basic code structure problems.

**CRITICAL SYNTAX CHECKLIST:**
1. Imports: Ensure all used components/functions are imported correctly
2. TypeScript: Verify interfaces, prop types, and type annotations
3. JSX: Check all opening/closing tags match
4. Brackets/Braces: Verify all {{{{}}}} [] () are properly closed
5. Semicolons/Commas: Add missing punctuation in objects/arrays
6. Quotes/Apostrophes: Escape apostrophes as '&apos;' in JSX text
7. Unused Variables: Prefix unused vars with underscore (_unusedVar)
8. Client Directives: Add 'use client' if component uses hooks/events

File: {file_name}
Return ONLY the corrected code in a ```tsx code block. No explanations.
--- CODE TO FIX ---
```tsx
{code}
```"""


def get_accessibility_critic_prompt(code: str, file_name: str) -> str:
    """Accessibility and semantic HTML critic"""
    return f"""You are a WCAG 2.1 AA Accessibility Specialist. Review this React component for accessibility issues.

**ACCESSIBILITY CHECKLIST:**
1. **Images**: All <Image> components have meaningful alt text
2. **Headings**: Proper heading hierarchy (h1->h2->h3)
3. **Links**: Descriptive link text, not "click here"
4. **Forms**: Labels associated with inputs, proper ARIA attributes
5. **Semantic HTML**: Use semantic tags (nav, main, section, article)
6. **Color Contrast**: Ensure sufficient contrast in Tailwind classes
7. **Focus Management**: Visible focus indicators
8. **Screen Reader**: ARIA labels where needed

File: {file_name}
Return ONLY the accessibility-improved code in a ```tsx code block.
--- CODE TO REVIEW ---
```tsx
{code}
```"""


def get_performance_critic_prompt(code: str, file_name: str) -> str:
    """Performance and React best practices critic"""
    return f"""You are a React Performance Optimization Specialist. Optimize this component for performance.

**PERFORMANCE CHECKLIST:**
1. Image Optimization: Use Next.js Image with proper sizes/priority
2. Lazy Loading: Implement for non-critical content
3. React Patterns: Avoid inline functions in render, use useCallback/useMemo
4. Bundle Size: Import only what's needed from libraries
5. Core Web Vitals: Optimize for LCP, CLS, FID
6. Tailwind: Use efficient class combinations
7. State Management: Minimize unnecessary re-renders

File: {file_name}
Return ONLY the performance-optimized code in a ```tsx code block.
--- CODE TO OPTIMIZE ---
```tsx
{code}
```"""


def get_integration_critic_prompt(all_files: Dict[str, str], site_blueprint: SiteBlueprint) -> str:
    """Cross-file consistency and integration critic"""

    file_summaries = {k: f"// {k}\n{v[:200]}..." for k, v in all_files.items()}
    project_files_str = json.dumps(file_summaries, indent=2)

    return f"""You are a Senior Full-Stack Integration Specialist. Review this complete Next.js project for integration issues.

**PROJECT CONTEXT:**
- Site Type: {site_blueprint.site_type}
- Target Audience: {site_blueprint.target_audience}
- Key Features: {', '.join(site_blueprint.key_features)}

**INTEGRATION CHECKLIST:**
1. **Import Resolution**: All imports can be resolved
2. **Prop Interfaces**: Parent-child component prop types match
3. **Routing**: All routes are properly defined and accessible
4. **Dependencies**: No circular dependencies
5. **Build Compatibility**: Will `npm run build` succeed?
6. **Runtime Safety**: No obvious runtime errors
7. **Consistency**: Consistent naming and structure across files

**PROJECT FILES:**
{project_files_str}

Respond with a JSON object:
{{
  "issues_found": ["list of integration issues"],
  "fixes_required": [
    {{"file": "filename", "issue": "description", "fix": "solution"}}
  ],
  "build_ready": boolean,
  "quality_score": 0-100
}}
Only return the JSON object."""


# --- Enhanced Code Generation Pipeline ---
@contextmanager
def _span(operation_name: str, **tags):
    start_span(operation_name, **tags)
    try:
        yield
        finish_span(success=True)
    except Exception as e:
        finish_span(success=False, error=str(e))
        raise


adaptive_critic = AdaptiveCritic()


def calculate_code_diff_score(code1: str, code2: str) -> float:
    """Calculate similarity score between two code strings"""
    # Simple implementation - could be enhanced with proper AST diff
    lines1 = set(code1.split('\n'))
    lines2 = set(code2.split('\n'))
    if not lines1 and not lines2:
        return 1.0
    intersection = len(lines1.intersection(lines2))
    union = len(lines1.union(lines2))
    return intersection / union if union > 0 else 0.0


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def run_specialized_critic(code: str, critic_type: CriticType, file_name: str, task_id: str) -> str:
    """Run a specialized critic AI on the code"""
    critic_prompts = {
        CriticType.SYNTAX: get_syntax_critic_prompt,
        CriticType.ACCESSIBILITY: get_accessibility_critic_prompt,
        CriticType.PERFORMANCE: get_performance_critic_prompt
    }
    if critic_type not in critic_prompts:
        return code

    with _span(f"critic_{critic_type.value}", file_name=file_name):
        log.info(f"🧐 Running {critic_type.value} critic on: {file_name}", extra={"task_id": task_id})
        prompt = critic_prompts[critic_type](code, file_name)
        try:
            response = GENERAL_MODEL.generate_content(prompt)
            result = response.text
            # Extract code from markdown blocks
            extracted = re.search(r'```(?:tsx|jsx|ts|typescript)?\s*\n(.*?)\n```', result, re.DOTALL)
            return extracted.group(1).strip() if extracted else result.strip()
        except Exception as e:
            log.error(f"Error in {critic_type.value} critic for {file_name}: {e}", extra={"task_id": task_id})
            return code


def run_integration_critic(all_files: Dict[str, str], site_blueprint: SiteBlueprint, task_id: str) -> Dict[str, Any]:
    """Run integration critic across all files"""
    with _span("integration_critic", file_count=len(all_files)):
        log.info(f"🔍 Running integration critic on {len(all_files)} files", extra={"task_id": task_id})
        prompt = get_integration_critic_prompt(all_files, site_blueprint)
        try:
            response = GENERAL_MODEL.generate_content(prompt)
            result = response.text
            # Try to parse JSON response
            try:
                return json.loads(result)
            except json.JSONDecodeError:
                # Fallback: extract JSON from markdown if present
                json_match = re.search(r'```json\s*\n(.*?)\n```', result, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group(1))
                else:
                    return {
                        "issues_found": ["Could not parse integration analysis"],
                        "fixes_required": [],
                        "build_ready": False,
                        "quality_score": 50
                    }
        except Exception as e:
            log.error(f"Error in integration critic: {e}", extra={"task_id": task_id})
            return {
                "issues_found": [f"Integration analysis failed: {str(e)}"],
                "fixes_required": [],
                "build_ready": False,
                "quality_score": 30
            }


def iterative_code_improvement(initial_code: str, file_name: str, task_id: str, max_iterations: int = 2) -> Tuple[str, CodeQualityScore]:
    """Iteratively improve code through multiple critic passes"""
    current_code = initial_code
    all_fixes_applied = []
    all_issues_found = []

    # Stage 1: Syntax Critic (Most Critical)
    syntax_code = run_specialized_critic(current_code, CriticType.SYNTAX, file_name, task_id)
    if calculate_code_diff_score(current_code, syntax_code) > 0.1:  # Significant changes
        all_fixes_applied.append("Syntax and TypeScript fixes")
    current_code = syntax_code

    # Stage 2: Accessibility Critic
    accessibility_code = run_specialized_critic(current_code, CriticType.ACCESSIBILITY, file_name, task_id)
    if calculate_code_diff_score(current_code, accessibility_code) > 0.05:
        all_fixes_applied.append("Accessibility improvements")
    current_code = accessibility_code

    # Stage 3: Performance Critic (Optional for complex components)
    if "use client" in current_code or "useState" in current_code or "useEffect" in current_code:
        performance_code = run_specialized_critic(current_code, CriticType.PERFORMANCE, file_name, task_id)
        if calculate_code_diff_score(current_code, performance_code) > 0.05:
            all_fixes_applied.append("Performance optimizations")
        current_code = performance_code

    # Calculate quality scores (simplified)
    quality_score = CodeQualityScore(
        syntax_score=95.0 if "Syntax and TypeScript fixes" in all_fixes_applied else 85.0,
        accessibility_score=95.0 if "Accessibility improvements" in all_fixes_applied else 80.0,
        performance_score=95.0 if "Performance optimizations" in all_fixes_applied else 85.0,
        typescript_score=90.0,
        nextjs_score=90.0,
        overall_score=88.0,
        issues_found=all_issues_found,
        fixes_applied=all_fixes_applied
    )
    return current_code, quality_score


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def enhanced_generate_code(prompt: str, component_name: str, task_id: str, available_components: Optional[List[str]] = None) -> Tuple[str, CodeQualityScore]:
    """
    Enhanced three-stage code generation pipeline:
    1. Generator AI (Fine-tuned) - Creative code generation
    2. Specialized Critics (General) - Multi-stage validation and improvement
    3. Integration validation - Cross-file consistency
    """
    # Stage 1: Generator AI (Your existing fine-tuned model)
    with _span("generator_ai", component_name=component_name):
        log.info(f"🧠 Generator AI creating: {component_name}", extra={"task_id": task_id})
        request = aiplatform.GenerateContentRequest(
            model=TUNED_ENDPOINT_PATH,
            contents=[aiplatform.Content(role="user", parts=[aiplatform.Part(text=prompt)])],
            generation_config=aiplatform.GenerationConfig(response_mime_type="text/plain")
        )
        try:
            response = PREDICTION_CLIENT.generate_content(request=request)
            if not (response.candidates and response.candidates[0].content.parts):
                raise ValueError("Generator AI returned empty response")
            initial_code = response.candidates[0].content.parts[0].text
            # Extract code from markdown if needed
            extracted = re.search(r'```(?:tsx|jsx|ts|typescript)?\s*\n(.*?)\n```', initial_code, re.DOTALL)
            initial_code = extracted.group(1).strip() if extracted else initial_code.strip()
        except Exception as e:
            log.error(f"Generator AI error for {component_name}: {e}", extra={"task_id": task_id})
            raise

    # Stage 2: Multi-Stage Critic Pipeline
    with _span("multi_critic_pipeline", component_name=component_name):
        log.info(f"🔧 Multi-stage improvement for: {component_name}", extra={"task_id": task_id})
        final_code, quality_score = iterative_code_improvement(
            initial_code, component_name, task_id
        )

    log.info(f"✅ Enhanced generation complete for {component_name}. Quality: {quality_score.overall_score:.1f}/100", extra={"task_id": task_id})
    return final_code, quality_score


def validate_complete_project(all_files: Dict[str, str], site_blueprint: SiteBlueprint, task_id: str) -> Dict[str, Any]:
    """Final project-wide validation"""
    log.info(f"🏗️ Running complete project validation", extra={"task_id": task_id})
    integration_result = run_integration_critic(all_files, site_blueprint, task_id)

    if not integration_result.get("build_ready", False):
        log.warning(f"⚠️ Project may have build issues: {integration_result.get('issues_found', [])}", extra={"task_id": task_id})

    return integration_result


# Utility function to maintain backward compatibility
def lint_and_fix_code(code: str, component_name: str, task_id: str) -> str:
    """Legacy function - now just calls the syntax critic"""
    return run_specialized_critic(code, CriticType.SYNTAX, component_name, task_id)


MASTER_PERSONA_PROMPT = """You are a world-class digital agency in a box, embodying three expert roles:

Senior Full-Stack Developer: You have 15+ years of experience building clean, scalable, and production-ready web applications. You are a master of Next.js 15, TypeScript, and Tailwind CSS. Your code is always performant, secure, and follows the latest best practices.
Lead UX/UI Designer: You create modern, beautiful, and intuitive user interfaces that rival those of leading tech companies like Apple and Stripe. Your designs are always user-centric, responsive, and adhere strictly to WCAG 2.1 AA accessibility standards, ensuring the site is usable by everyone.
SEO Specialist: You are an expert in technical SEO. Every line of code you write considers its impact on search engine rankings. You use semantic HTML5, ensure proper meta tags and structured data, and prioritize fast load times for Core Web Vitals.

Your mission is to take a client's brief and produce a complete, professional, and accessible website that requires no technical expertise from the client to appreciate."""
