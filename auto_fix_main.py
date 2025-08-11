#!/usr/bin/env python3
"""
auto_fix_main.py

A self-healing wrapper that runs main.py, captures errors, and uses OpenAI to generate and apply patches until main.py executes without errors.
Includes:
- Conversation with GPT for diffs
- Full-function rewrites for write_theme when unterminated string detected (sanitizes markdown fences)
- Automatic cleaning of markdown fences from main.py
- Stub fallback after max attempts

Prerequisites:
- openai python package installed in venv (pip install openai)
- OPENAI_API_KEY set in .env
- Unix `patch` command available
"""
import os
import sys
import subprocess
import re
import tempfile
from pathlib import Path
import openai
from dotenv import load_dotenv

# Load .env into environment
env_file = Path(__file__).parent / '.env'
if env_file.exists():
    load_dotenv(env_file)
# Ensure API key is loaded
openai.api_key = os.getenv('OPENAI_API_KEY')
if not openai.api_key:
    sys.exit('[!] OPENAI_API_KEY not set')

MAIN_FILE = Path(__file__).parent / 'main.py'
MAX_ATTEMPTS = 5
attempt = 0


def run_main():
    proc = subprocess.run(['python3', str(MAIN_FILE)], capture_output=True, text=True)
    return proc.returncode, proc.stdout, proc.stderr


def extract_context(stderr, before=5, after=5):
    m = re.search(r'File ".*main\.py", line (\d+)', stderr)
    if not m:
        return None, None
    line_no = int(m.group(1))
    lines = MAIN_FILE.read_text().splitlines()
    start = max(line_no - before - 1, 0)
    end = min(line_no + after, len(lines))
    snippet = '\n'.join(f"{i+1}: {lines[i]}" for i in range(start, end))
    return line_no, snippet


def apply_diff(diff_text):
    with tempfile.NamedTemporaryFile('w+', delete=False) as tf:
        tf.write(diff_text)
        diff_file = tf.name
    proc = subprocess.run(['patch', '-p0', '-i', diff_file], capture_output=True, text=True)
    if proc.returncode != 0:
        print(proc.stdout)
        print(proc.stderr)
        return False
    return True


def insert_stub(func):
    stub = f"\n# Auto-stub for {func}\ndef {func}(*args, **kwargs):\n    pass\n"
    content = MAIN_FILE.read_text()
    MAIN_FILE.write_text(stub + content)
    print(f'[•] Stub inserted for {func}')


def strip_fences(code: str) -> str:
    # Remove ``` fences and leading/trailing blank lines
    code = re.sub(r"^```(?:[a-z]*)?\s*", '', code, flags=re.MULTILINE)
    code = re.sub(r"\s*```\s*$", '', code)
    return code.strip()


def auto_clean_fences():
    # Remove any markdown fences left in main.py
    lines = MAIN_FILE.read_text().splitlines()
    new_lines = [ln for ln in lines if not ln.strip().startswith('```')]
    MAIN_FILE.write_text("\n".join(new_lines))
    print('[•] Cleaned markdown fences from main.py')


def ask_gpt_diff(error, snippet):
    prompt = f"""
Your Python script main.py is failing with the following error:

```
{error}
```

Here is the snippet around the error:
```
{snippet}
```
Provide a unified diff in diff -u format that fixes the issue. Only output the diff.
"""
    resp = openai.chat.completions.create(
        model='gpt-4o',
        messages=[
            {'role': 'system', 'content': 'You are a Python expert that outputs valid unified diffs.'},
            {'role': 'user', 'content': prompt}
        ],
        temperature=0.0,
    )
    diff = resp.choices[0].message.content.strip()
    return strip_fences(diff)


def ask_gpt_full_rewrite():
    text = MAIN_FILE.read_text()
    match = re.search(r'(def write_theme\(p\):[\s\S]*?)(?=\ndef )', text)
    func_block = match.group(1) if match else text
    prompt = f"""
Rewrite the entire `write_theme` function in main.py so that the string literals are properly triple-quoted and syntactically valid. Return only the corrected function block without markdown fences.

Original function:
```
{func_block}
```
"""
    resp = openai.chat.completions.create(
        model='gpt-4o',
        messages=[
            {'role':'system','content':'You are a Python expert who outputs correct function definitions.'},
            {'role':'user','content':prompt}
        ],
        temperature=0.2,
    )
    block = resp.choices[0].message.content
    return strip_fences(block)


def replace_write_theme(new_block):
    content = MAIN_FILE.read_text()
    content = re.sub(r'def write_theme\(p\):[\s\S]*?(?=\ndef )', new_block, content, count=1)
    MAIN_FILE.write_text(content)
    print('[•] Replaced write_theme with GPT-rewritten version')


def main():
    global attempt
    while True:
        # Clean any stray fences first
        if any('```' in ln for ln in MAIN_FILE.read_text().splitlines()):
            auto_clean_fences()
            continue

        code, _, err = run_main()
        if code == 0:
            print('[✓] main.py executed successfully.')
            break
        print(err)
        attempt += 1
        if 'unterminated string literal' in err.lower():
            print('[•] Unterminated string error detected, requesting full rewrite of write_theme')
            new_func = ask_gpt_full_rewrite()
            replace_write_theme(new_func)
            continue
        line_no, snippet = extract_context(err)
        if not snippet:
            print('[!] Could not parse traceback; aborting.')
            sys.exit(1)
        if attempt >= MAX_ATTEMPTS:
            print('[!] Max attempts reached, inserting stub for write_theme')
            insert_stub('write_theme')
            continue
        print(f'[•] Attempt {attempt}: requesting patch diff from OpenAI...')
        diff = ask_gpt_diff(err, snippet)
        print('[•] Applying diff:')
        print(diff)
        if not apply_diff(diff):
            print('[!] Diff failed to apply, retrying...')
            continue
        print('[•] Diff applied, retrying...')

if __name__ == '__main__':
    main()
