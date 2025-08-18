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


def get_targeted_fix_prompt(file_content: str, error_details: Dict[str, Any]) -> str:
    """
    Creates a highly specific prompt to fix a single error in a file.
    """
    return f"""
    You are an expert TypeScript and React developer tasked with fixing a build error.
    A file has failed to build due to a specific error. Your ONLY job is to fix this single error.

    **CRITICAL INSTRUCTIONS:**
    1.  You must correct ONLY the specific error identified.
    2.  Do NOT make any other changes, refactorings, or improvements to the code.
    3.  Preserve the original code structure and logic as much as possible.
    4.  Your output must be the complete, corrected content of the file.

    ---
    **ERROR DETAILS:**
    - **File:** {error_details['file_path']}
    - **Line:** {error_details['line']}
    - **Column:** {error_details['column']}
    - **Error Message:** {error_details['error_message']}
    ---
    **FULL FILE CONTENT TO FIX:**
    ```tsx
    {file_content}
    ```
    ---
    Now, provide the complete and corrected file content in a single ```tsx code block.
    """

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
