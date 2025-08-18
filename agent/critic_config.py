"""Configuration and rules engine for the multi-stage critic system"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum
import json
import os


class SeverityLevel(Enum):
    CRITICAL = "critical"  # Will break build
    HIGH = "high"          # Major quality/accessibility issue
    MEDIUM = "medium"        # Performance or maintainability issue
    LOW = "low"            # Style or minor optimization


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


@dataclass
class CriticRule:
    rule_id: str
    name: str
    description: str
    severity: SeverityLevel
    pattern: str  # Regex pattern or simple string to match
    fix_template: str  # Template for how to fix the issue
    category: str  # syntax, accessibility, performance, etc.
    enabled: bool = True


@dataclass
class ProjectContext:
    """Context about the project being generated"""
    site_type: str
    target_audience: str
    key_features: List[str]
    accessibility_level: str = "WCAG_AA"  # WCAG_A, WCAG_AA, WCAG_AAA
    performance_budget: Dict[str, Any] = field(default_factory=dict)
    custom_rules: List[CriticRule] = field(default_factory=list)


class CriticRulesEngine:
    """Manages and applies critic rules based on context"""

    def __init__(self):
        self.rules: Dict[str, CriticRule] = {}
        self.load_default_rules()

    def load_default_rules(self):
        """Load the default set of critic rules"""
        # CRITICAL SYNTAX RULES
        syntax_rules = [
            CriticRule(
                rule_id="missing_imports",
                name="Missing Import Statements",
                description="Components or functions used without proper imports",
                severity=SeverityLevel.CRITICAL,
                pattern=r"<(\w+)(?:\s|>)",  # JSX components
                fix_template="Add: import {{ {component} }} from '{path}'",
                category="syntax"
            ),
            CriticRule(
                rule_id="unclosed_jsx",
                name="Unclosed JSX Tags",
                description="JSX tags that are not properly closed",
                severity=SeverityLevel.CRITICAL,
                pattern=r"<(\w+)(?:[^/>]?)(?<!/)>(?!.*</\1>)",
                fix_template="Ensure all JSX tags are properly closed",
                category="syntax"
            ),
            CriticRule(
                rule_id="unescaped_quotes",
                name="Unescaped Quotes in JSX",
                description="Apostrophes and quotes that need escaping in JSX",
                severity=SeverityLevel.CRITICAL,
                pattern=r">([^<]*)'([^<]*)<",
                fix_template="Replace ' with '&apos;' in JSX text content",
                category="syntax"
            ),
            CriticRule(
                rule_id="missing_client_directive",
                name="Missing 'use client'",
                description="Interactive components using hooks require 'use client'",
                severity=SeverityLevel.CRITICAL,
                pattern=r"import.*(useState|useEffect|useContext|useReducer|useRef|useCallback|useMemo)",
                fix_template="Add 'use client' to the top of the file.",
                category="syntax"
            ),
        ]
        for rule in syntax_rules:
            self.rules[rule.rule_id] = rule
