import os
import sys
import subprocess
import argparse
import time
from pathlib import Path

# Third-party library for the debugger's AI call
try:
    import google.generativeai as genai
except ImportError:
    print("[!] 'google-generativeai' library not found.")
    print("Please install it by running: pip install google-generativeai")
    sys.exit(1)

# ===== CONFIGURATION =====
# The script you want to debug
TARGET_SCRIPT = "main.py"

# Your Google API Key (for the *debugger* to use)
# It's recommended to set this as an environment variable
DEBUGGER_GCP_API_KEY = os.environ.get("GCP_API_KEY")

# The string that indicates the target script has finished successfully
SUCCESS_MARKER = "[🎉] Deployment to"

# The maximum number of times the debugger will try to fix the script
MAX_ATTEMPTS = 10
# ==========================


def get_ai_fix(script_code: str, error_log: str) -> str | None:
    """
    Asks the Gemini AI to analyze the script and error log to provide a fix.
    This version uses a more detailed, error-specific prompt.

    Args:
        script_code: The full source code of the script that failed.
        error_log: The captured stdout/stderr from the failed run.

    Returns:
        The corrected script code as a string, or None if a fix couldn't be generated.
    """
    if not DEBUGGER_GCP_API_KEY:
        print("[!] ERROR: DEBUGGER_GCP_API_KEY is not set. Cannot call AI for a fix.")
        return None

    print("\n[🧠] Asking AI to analyze the error and suggest a fix...")
    try:
        genai.configure(api_key=DEBUGGER_GCP_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Limit the error log to the last 50 lines to keep the prompt concise
        log_lines = error_log.strip().split('\n')
        concise_log = '\n'.join(log_lines[-50:])
        
        print(f"--- Sending following error snippet to AI ---\n{concise_log}\n-------------------------------------------")

        prompt = f"""
You are an expert Python software engineer and a master debugger. Your task is to fix a critical syntax error in a Python script.

The script failed with a SyntaxError: unterminated triple-quoted string literal. This means a multi-line string that started with triple quotes was not correctly closed.

Analyze the provided Python script and the error log. Pay very close attention to the line numbers mentioned in the error. Your goal is to provide a fully corrected version of the script that is syntactically valid and ready to run.

COMMON CAUSES FOR THIS ERROR:
* A multi-line string is missing its closing triple quotes.
* The string content itself contains a triple-quote sequence, which needs to be escaped (e.g., by breaking it up like '""' + '"' or using '\"\"\"').
* An unclosed parenthesis or bracket before the string, causing the parser to get confused.

IMPORTANT INSTRUCTIONS:
1.  Your response MUST contain ONLY the full, corrected Python script.
2.  Do NOT include any explanations, comments, or markdown formatting like ```python.
3.  Scrutinize every multi-line string in the file to ensure it is properly terminated.

The script you are debugging is a comprehensive Python program designed to fully automate the creation and deployment of a modern, multi-page website. Its goal is to take a company name, domain, and industry as input and produce a live, functional website without manual intervention.

The agents workflow is as follows:

Project Scaffolding: It begins by creating a new Next.js (a React framework) project using pnpm, which sets up the fundamental file structure.

AI Content Generation: It makes two calls to the Google Gemini API:

The first call requests detailed website content (headlines, paragraphs, FAQ items, etc.) for six pages, structured as a JSON object.

The second call requests a custom color theme (CSS variables) based on the companys industry.

Image Integration: It calls the Pexels API to fetch a gallery of real, high-quality images related to the specified industry.

File Assembly: The agent then writes all the necessary files. It injects the AI-generated content and Pexels image URLs into pre-defined React component templates (.tsx files) for each page. It also writes the custom CSS theme into the global stylesheet.

Build and Deploy: Finally, it runs the Next.js build process to compile the application into an optimized production version. It then uses rsync and ssh to transfer the files to the remote server and runs a provisioning script to make the website live.

You can view the full script in the Canvas under the ID ai_site_agent_fix_03.

Definition of a Successful Run
A successful run is when the agent completes the entire workflow from start to finish without any script errors (i.e., an exit code of 0).

The definitive sign of success is the final line in the output log:
[🎉] Deployment to https://{{domain}} complete!

When you see this message, it means the debugger can stop. The agent has successfully generated all content, assembled the website files, built the application, and deployed it to the live domain provided.

Environment and Dependencies
The agent operates in a specific environment with several key components:

Programming Language: The core agent script is written in Python 3.

Python Libraries: It uses the standard subprocess, pathlib, and json libraries, along with the requests library for making API calls.

Project Dependencies: The website it generates relies on a Node.js environment and uses pnpm as its package manager. Key libraries it installs for the website include:

next

react

tailwindcss

@mui/icons-material

@heroicons/react

System Tools: The agents execution environment requires access to the following command-line tools: pnpx, pnpm, rsync, and ssh.

--- SCRIPT CODE WITH SYNTAX ERROR ---
{script_code}
--- SCRIPT CODE END ---

--- ERROR LOG ---
{concise_log}
--- ERROR LOG END ---

Now, provide the complete, syntactically correct Python script:
"""

        response = model.generate_content(prompt)
        
        # Clean up the response to ensure it's just code
        if response.parts:
            fixed_code = response.text
            # Aggressive cleaning to remove markdown fences
            fixed_code = fixed_code.strip().lstrip("```python").lstrip("```").rstrip("```")
            print("[✔] AI provided a potential fix.")
            return fixed_code.strip()
        else:
            print("[!] AI did not provide a valid response part.")
            return None

    except Exception as e:
        print(f"[!] An error occurred while contacting the AI for a fix: {e}")
        return None


def main(company: str, domain: str, industry: str):
    """
    The main autodebugger loop.
    """
    if not Path(TARGET_SCRIPT).exists():
        print(f"[!] Error: Target script '{TARGET_SCRIPT}' not found in this directory.")
        return

    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"\n{'='*20} ATTEMPT {attempt}/{MAX_ATTEMPTS} {'='*20}")
        print(f"[▶] Running {TARGET_SCRIPT} for '{company}'...")

        # Construct the command to run the target script
        command = [
            sys.executable,
            TARGET_SCRIPT,
            '--company', company,
            '--domain', domain,
            '--industry', industry
        ]

        # Execute the script and capture output
        process = subprocess.run(command, capture_output=True, text=True, encoding='utf-8')
        
        # Combine stdout and stderr for a complete log
        full_log = process.stdout + process.stderr
        
        # Write the log for this attempt to a file for review
        log_filename = f"autodebugger_log_attempt_{attempt}.txt"
        with open(log_filename, "w", encoding='utf-8') as f:
            f.write(full_log)
        print(f"[i] Full log saved to '{log_filename}'")
        
        # Print the live output to the console for visibility
        print("--- Script Output ---")
        print(full_log.strip())
        print("--- End Script Output ---")

        # Check for the success marker in the output
        if SUCCESS_MARKER in process.stdout and process.returncode == 0:
            print(f"\n[🏆] SUCCESS! The script completed successfully on attempt {attempt}.")
            break
        
        # If it failed, and we haven't reached the max attempts, try to fix it
        print(f"\n[!] Script failed with exit code {process.returncode}.")
        if attempt < MAX_ATTEMPTS:
            original_code = Path(TARGET_SCRIPT).read_text(encoding='utf-8')
            
            # Get the fix from the AI
            new_code = get_ai_fix(original_code, full_log)

            if new_code and new_code.strip(): # Ensure the new code is not empty
                # Create a backup of the old script
                backup_path = f"{TARGET_SCRIPT}.bak_{int(time.time())}"
                Path(TARGET_SCRIPT).rename(backup_path)
                print(f"[i] Backed up original script to '{backup_path}'")
                
                # Write the new, fixed code to the target script file
                Path(TARGET_SCRIPT).write_text(new_code, encoding='utf-8')
                print(f"[✔] Applied AI-generated patch to {TARGET_SCRIPT}. Retrying...")
                time.sleep(2) # Short delay before retrying
            else:
                print("[!] Could not get a valid fix from the AI. Retrying with the same code...")
                time.sleep(5) # Longer delay if AI fails
    else:
        print(f"\n[❌] FAILED to debug the script after {MAX_ATTEMPTS} attempts.")


if __name__ == '__main__':
    # Set up argument parsing to match the target script
    parser = argparse.ArgumentParser(description='Autodebugger for the AI Website Generator.')
    parser.add_argument('--company', required=True, help='The name of the company.')
    parser.add_argument('--domain', required=True, help='The domain name for the site.')
    parser.add_argument('--industry', required=True, help='The industry of the company.')
    
    args = parser.parse_args()
    
    if not DEBUGGER_GCP_API_KEY:
        print("[!] Critical Error: GCP_API_KEY environment variable is not set.")
        print("    The autodebugger needs this to request fixes.")
        print("    You can set it by running: export GCP_API_KEY='your_key_here'")
        sys.exit(1)

    main(company=args.company, domain=args.domain, industry=args.industry)
