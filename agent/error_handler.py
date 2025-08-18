import re
import logging
from pathlib import Path
from typing import Optional, Dict, Any

from agent.llm_service import enhanced_generate_code # We'll need this to call the generator

log = logging.getLogger(__name__)

def parse_build_error(stderr: str) -> Optional[Dict[str, Any]]:
    """
    Parses the stderr from a failed pnpm run build command to find the first critical error.
    """
    # Regex to capture file path, line, column, and the error message.
    # It looks for a line starting with a path, followed by a line with line/col numbers and the error.
    # Example:
    # ⚠  ./components/Footer.tsx
    # ⚠  48:23  Error: Component definition is missing display name  react/display-name
    error_pattern = re.compile(
        r"\u26a0\ufe0f\s+(?P<file_path>\.\/.*\.tsx?)\n"  # Match the file path line
        r"\u26a0\ufe0f\s+(?P<line>\d+):(?P<column>\d+)\s+Error:\s(?P<error_message>.*)",  # Match the error line
        re.MULTILINE
    )

    match = error_pattern.search(stderr)

    if match:
        error_details = match.groupdict()
        log.info(f"Parsed build error: {error_details}")
        return error_details

    log.warning("Could not parse build error from stderr.")
    return None


def get_syntax_critic_prompt(code: str, file_name: str) -> str:
    """
    Creates a prompt for the syntax critic.
    This is used for targeted error correction.
    """
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
---
**FULL FILE CONTENT TO FIX:**
```tsx
{code}
```
"""

def get_targeted_fix_prompt(file_content: str, error_details: Dict[str, Any]) -> str:
    """
    Creates a highly specific prompt to fix a single error in a file, with a strong focus on syntax.
    """
    # Get the base syntax critic prompt.
    base_prompt = get_syntax_critic_prompt(file_content, error_details['file_path'])

    # Add the specific error context to it.
    error_context_prompt = f"""
    An attempt to build the project failed with the following specific error.
    You must fix this error.

    **ERROR TO FIX:**
    - **File:** {error_details['file_path']}
    - **Line:** {error_details['line']}
    - **Column:** {error_details['column']}
    - **Error Message:** {error_details['error_message']}

    {base_prompt}
    """
    return error_context_prompt

def attempt_targeted_fix(project_path: Path, error_details: Dict[str, Any], task_id: str) -> bool:
    """
    Attempts to fix a single build error by invoking the generator AI.
    """
    file_path_str = error_details['file_path'].lstrip('./')
    absolute_file_path = project_path / file_path_str

    if not absolute_file_path.exists():
        log.error(f"File to fix does not exist: {absolute_file_path}")
        return False

    try:
        original_content = absolute_file_path.read_text()

        prompt = get_targeted_fix_prompt(original_content, error_details)

        # Call the generator to get the fix
        # Note: We are using the same generator, but with a very different, targeted prompt.
        fixed_content = enhanced_generate_code(
            prompt=prompt,
            component_name=f"fix-for-{file_path_str}",
            task_id=task_id
        )

        if fixed_content and fixed_content != original_content:
            log.info(f"Applying targeted fix to {absolute_file_path}")
            absolute_file_path.write_text(fixed_content)
            return True
        else:
            log.warning("Targeted fix did not produce any changes.")
            return False

    except Exception as e:
        log.error(f"An error occurred during the targeted fix attempt: {e}", exc_info=True)
        return False
