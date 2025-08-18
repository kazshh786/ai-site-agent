import re
import json
import time
import logging
from typing import List, Optional, Union, Dict, Any
from contextlib import contextmanager

from vertexai import init as vertexai_init
from google.cloud import aiplatform_v1beta1 as aiplatform
from google.api_core import exceptions
from tenacity import retry, stop_after_attempt, wait_exponential

from .schemas import SiteBlueprint
from logger import get_logger, start_span, finish_span

# Import the new enhanced service and its dependencies
from .enhanced_llm_service import enhanced_generate_code, MASTER_PERSONA_PROMPT

log = get_logger(__name__)

# --- Configurations ---
# These are still needed for get_site_blueprint
TUNED_PROJECT_ID = "1062532524126"
TUNED_LOCATION = "us-central1"
TUNED_ENDPOINT_ID = "9038580416109346816"
TUNED_ENDPOINT_PATH = f"projects/{TUNED_PROJECT_ID}/locations/{TUNED_LOCATION}/endpoints/{TUNED_ENDPOINT_ID}"

# --- Client Initialization ---
# This is also needed for get_site_blueprint
GENERAL_PROJECT_ID = "automated-ray-463204-i2"
GENERAL_LOCATION = "us-central1"
try:
    vertexai_init(project=GENERAL_PROJECT_ID, location=GENERAL_LOCATION)
except Exception:
    pass
PREDICTION_CLIENT = aiplatform.PredictionServiceClient(
    client_options={"api_endpoint": f"{TUNED_LOCATION}-aiplatform.googleapis.com"}
)

@contextmanager
def _span(operation_name: str, **tags):
    """Context manager for automatic span lifecycle"""
    start_span(operation_name, **tags)
    try:
        yield
        finish_span(success=True)
    except Exception as e:
        finish_span(success=False, error=str(e))
        raise

def validate_component_imports(code: str, available_components: List[str], component_name: str, task_id: str) -> str:
    """
    This function remains as a final programmatic check after AI generation.
    """
    with _span("validate_component_imports", component_name=component_name):
        if not available_components:
            return code
        import_pattern = r"import\s+(\w+)\s+from\s+['\"]@/components/(\w+)['\"]"
        imports = re.findall(import_pattern, code)
        available_set = set(f.replace('.tsx', '') for f in available_components)
        code_lines = code.split('\n')
        new_code_lines = []
        replaced_components = set()
        for line in code_lines:
            match = re.match(import_pattern, line)
            if match:
                imported_name, file_name = match.groups()
                if file_name in available_set:
                    new_code_lines.append(line)
                else:
                    if "Placeholder" not in code:
                        # Ensure Placeholder import is added if not present
                        if not any("import Placeholder from" in l for l in new_code_lines):
                            new_code_lines.append("import Placeholder from '@/components/Placeholder';")
                    replaced_components.add(imported_name)
                    log.warning(f"🔄 Replacing missing component import in {component_name}: {file_name}",
                                extra={"component": component_name, "task_id": task_id})
            else:
                new_code_lines.append(line)
        code = '\n'.join(new_code_lines)
        for component_to_replace in replaced_components:
            code = re.sub(
                rf'<{component_to_replace}(\s+[^>]*)?\/?>',
                f'<Placeholder componentName="{component_to_replace}" />',
                code
            )
            code = re.sub(
                rf'<{component_to_replace}(\s+[^>]*)?>(.*?)<\/{component_to_replace}>',
                f'<Placeholder componentName="{component_to_replace}" />',
                code,
                flags=re.DOTALL
            )
        return code

def _generate_code(prompt: str, component_name: str, task_id: str, available_components: Optional[List[str]] = None) -> str:
    """
    Wrapper around the enhanced_generate_code function to fit the existing workflow.
    It calls the generator and then performs final programmatic validation.
    """
    final_code = enhanced_generate_code(prompt, component_name, task_id, available_components)

    # The programmatic validation for component imports is still a valuable final check.
    if available_components and "DynamicPage.tsx" in component_name:
        final_code = validate_component_imports(final_code, available_components, component_name, task_id)

    return final_code

# --- Blueprint and Component Generation Functions ---
# These functions construct the specific prompts for each file type and call the generator.

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def get_site_blueprint(company: str | None, brief: str, task_id: str) -> Optional[SiteBlueprint]:
    """
    This function is a separate concern from component generation and remains here.
    It calls the tuned model directly to get the site blueprint.
    """
    with _span("get_site_blueprint", company=company, brief=brief):
        log_extra = {"company": company, "brief": brief, "model": f"tuned-endpoint-{TUNED_ENDPOINT_ID}", "task_id": task_id}
        log.info("🧠 Requesting AI for: get_site_blueprint (tuned model)", extra=log_extra)

        company_text = f"for the company: {company}" if company else "for the company mentioned in the brief"

        schema_dict = SiteBlueprint.model_json_schema(by_alias=True)
        formatted_schema = json.dumps(schema_dict, indent=2)

        user_prompt_text = (
            f"You are a world-class website architect. Your task is to analyze the following client brief and strictly generate a complete JSON site blueprint. "
            f"You MUST fill in the fields of the provided JSON template. Do NOT add any extra fields, alter the keys, or change the nested structure.\n\n"
            f"**CRITICAL REQUIREMENT**: Every component object inside the 'components' array MUST have a 'componentName' key with a descriptive, non-empty string value. This is mandatory. For example:\n"
            f"{{ 'componentName': 'Hero Section', 'componentType': 'Hero', 'props': {{ ... }} }}\n\n"
            f"--- CLIENT BRIEF ---\n"
            f"{brief}\n"
            f"--- END BRIEF ---\n\n"
            f"Now, generate the complete JSON blueprint {company_text} that strictly adheres to this structure:\n"
            f"```json\n"
            f"{formatted_schema}\n"
            f"```\n\n"
            f"Your entire response MUST be only the raw JSON, without any explanations or markdown.\n"
        )
        request = aiplatform.GenerateContentRequest(
            model=TUNED_ENDPOINT_PATH,
            contents=[aiplatform.Content(role="user", parts=[aiplatform.Part(text=user_prompt_text)])],
            generation_config=aiplatform.GenerationConfig(response_mime_type="application/json")
        )
        try:
            response = PREDICTION_CLIENT.generate_content(request=request)
            if not (response.candidates and response.candidates[0].content.parts):
                raise ValueError("Tuned AI model returned an empty or invalid response.")
            raw_text = response.candidates[0].content.parts[0].text
            blueprint_data = json.loads(raw_text)
            log.info(f"Raw AI blueprint data: {json.dumps(blueprint_data, indent=2)}", extra=log_extra)
            validated_blueprint = SiteBlueprint.model_validate(blueprint_data)
            log.info("✅ Blueprint validated successfully from tuned model.", extra=log_extra)
            return validated_blueprint
        except json.JSONDecodeError as e:
            log.error("Invalid JSON returned by tuned model.", extra={"raw_text": raw_text[:500], "error": str(e), **log_extra})
            raise ValueError(f"Tuned model generated malformed JSON: {e}") from e
        except exceptions.GoogleAPICallError as e:
            log.error(f"Google API Error calling tuned model: {e.message}", extra={"code": e.code, **log_extra})
            raise
        except Exception as e:
            log.error(f"An unexpected error occurred with the tuned model: {e}", extra=log_extra)
            raise

def get_component_code(component_name: str, blueprint: SiteBlueprint, task_id: str) -> str:
    REACT_TYPESCRIPT_GUIDELINES = """
## CRITICAL TypeScript/React Syntax Rules - ZERO TOLERANCE FOR ERRORS:

1. **NEVER create syntax errors**:
   - Every opening bracket `{` MUST have a closing `}`
   - Every opening parenthesis `(` MUST have a closing `)`
   - Every string quote MUST be properly closed
   - Every JSX tag MUST be properly closed

2. **String Literals in JSX**:
   ```tsx
   // CORRECT - Use proper quotes:
   className="bg-blue-500"
   alt="Company logo"

   // CORRECT - Escape in JSX text:
   <p>Don&apos;t worry</p>

   // WRONG - Will break build:
   className="bg-blue-500
   <p>Don't worry</p>
   ```
"""
    prompt = f"""
    {MASTER_PERSONA_PROMPT}
{REACT_TYPESCRIPT_GUIDELINES}

Your immediate task is to create the code for a single, reusable React component.

**Component Name:** `{component_name}`
**Client & Industry:** {blueprint.client_name}
**Full Website Blueprint (for context on props and content):**
{blueprint.model_dump_json(by_alias=True, indent=2)}

**CRITICAL INSTRUCTIONS:**
- **File & Import Structure:**
  - When importing another component, YOU MUST use a flat path: `import ComponentName from '@/components/ComponentName';`
  - **DO NOT** use nested paths like `components/layout/Header`. This is a fatal error.
- Follow the TypeScript guidelines above EXACTLY
- Use Tailwind CSS for all styling. Make it modern, professional, and visually appealing.
- ONLY use these available lucide-react icons: Menu, X, ChevronDown, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Check, Star, Users, Truck, Bot, Cpu, Zap.
- Use `<Link href="...">` for internal navigation.
- Use `<Image ... />` for images, always including `width`, `height`, and `alt`.
- Add `"use client";` at the top ONLY if you use hooks like `useState`.
- Your entire output must be only the raw `.tsx` code inside a ```tsx code block.
"""
    return _generate_code(prompt, f"{component_name}.tsx", task_id)


def get_layout_code(blueprint: SiteBlueprint, task_id: str) -> str:
    font_family = "Inter"
    if blueprint.design_system and blueprint.design_system.get("styleTokens"):
        font_family = blueprint.design_system["styleTokens"].get("font_family", "Inter")
    prompt = f"""
    {MASTER_PERSONA_PROMPT}
    Generate the complete code for a root layout file (`layout.tsx`) for a Next.js 14+ App Router project.

    **CRITICAL INSTRUCTIONS:**
    1. **TypeScript:** The root layout accepts a `children` prop. It MUST be typed as `React.ReactNode`.
    2. **Structure:** Import and render the `Header` and `Footer` components.
    3. **Imports:** Use a flat `@/` alias for all component imports (e.g., `import Header from '@/components/Header';`). DO NOT use nested paths.
    4. **Font:** The font should be '{font_family}'.
    5. **Output:** Only output the raw TSX code in a single ```tsx code block.
    """
    return _generate_code(prompt, "layout.tsx", task_id)

def get_globals_css_code(blueprint: SiteBlueprint, task_id: str) -> str:
    """
    Generates the complete, static content for globals.css.
    """
    log.info("📝 Generating static globals.css", extra={"task_id": task_id})

    primary_color = "222.2 47.4% 11.2%"
    secondary_color = "210 40% 96.1%"

    if blueprint.design_system and blueprint.design_system.get("styleTokens"):
        primary_color = blueprint.design_system["styleTokens"].get("primary_color", primary_color)
        secondary_color = blueprint.design_system["styleTokens"].get("secondary_color", secondary_color)

    return f"""
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {{
  :root {{
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: {primary_color};
    --primary-foreground: 210 40% 98%;
    --secondary: {secondary_color};
    --secondary-foreground: 222.2 47.4% 11.2%;
  }}
}}

@layer base {{
  * {{
    @apply border-border;
  }}
  body {{
    @apply bg-background text-foreground;
  }}
}}
"""

def get_header_code(blueprint: SiteBlueprint, task_id: str) -> str:
    page_links = ", ".join([f"'{page.page_name}'" for page in blueprint.pages])
    client = blueprint.client_name
    prompt = f"""
    {MASTER_PERSONA_PROMPT}
    Generate a `Header.tsx` component for a Next.js project.
    - Add `"use client";` at the top for the mobile menu.
    - Display the client name: "{client}".
    - Include navigation links for these pages: {page_links}.
    - Implement a working mobile menu toggle.
    """
    return _generate_code(prompt, "Header.tsx", task_id)

def get_footer_code(blueprint: SiteBlueprint, task_id: str) -> str:
    page_links = ", ".join([f"'{page.page_name}'" for page in blueprint.pages])
    client = blueprint.client_name
    prompt = f"""
    {MASTER_PERSONA_PROMPT}
    Generate a `Footer.tsx` component.

    **CRITICAL INSTRUCTIONS:**
    1. **Function Definition:** You MUST define the component as a named function declaration to avoid linting errors. Example: `export default function Footer(props: {{}}) {{ ... }}`. Do NOT use an anonymous arrow function assigned to a variable (e.g., `const Footer = () => ...`).
    2. **TypeScript:**
        - **NEVER use the `any` type.**
        - **AVOID empty interfaces** - use `{{}}` directly for props if there are none.
    3. **Content:**
        - Show the copyright notice using the current year: "© {time.strftime('%Y')} {client}".
        - Include navigation links for these pages: {page_links}. Use the `<Link>` component.
    4. **Styling:** Use Tailwind CSS.
    5. **Output:** Only output the raw TSX code in a single ```tsx code block.
    """
    return _generate_code(prompt, "Footer.tsx", task_id)

def get_placeholder_code(task_id: str) -> str:
    prompt = f"""
    {MASTER_PERSONA_PROMPT}
    Generate a `Placeholder.tsx` component.
    - It should accept a `componentName` prop.
    - Display a message like: "The component '[componentName]' failed to load."
    """
    return _generate_code(prompt, "Placeholder.tsx", task_id)

def get_dynamic_page_code(blueprint: SiteBlueprint, component_filenames: List[str], task_id: str) -> str:
    prompt = f"""
    {MASTER_PERSONA_PROMPT}
    Create the dynamic page component `app/[...slug]/page.tsx`.
    - Find the correct page from the blueprint based on the slug.
    - Default to the '/' page if slug is empty.
    - Render a "404 Not Found" message if no page matches.
    - Map over the page's sections and components to render them.
    - Use a `switch` statement on `component.component_name` to render the correct imported component.
    - **CRITICAL IMPORT RULE:** All component imports MUST be flat. E.g., `import Header from '@/components/Header';`.
    - Available components: {str(component_filenames)}
    - If a component is not available, use the `Placeholder` component.
    """
    return _generate_code(prompt, "app/[...slug]/page.tsx", task_id, component_filenames)
