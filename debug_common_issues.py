#!/usr/bin/env python3
"""
Check for common issues that cause AttributeError
"""

import sys
import os
from pathlib import Path
import inspect

# Add project path
sys.path.insert(0, '/opt/agent/ai-site-agent')

def check_file_structure():
    """Check if files exist where expected"""
    project_root = Path('/opt/agent/ai-site-agent')

    files_to_check = [
        'agent/__init__.py',
        'agent/deployer.py',
        'tasks.py'
    ]

    print("📁 File structure check:")
    for file_path in files_to_check:
        full_path = project_root / file_path
        if full_path.exists():
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} - MISSING")

def check_syntax_errors():
    """Check for syntax errors in key files"""
    print("\n🔍 Syntax check:")

    try:
        import agent.deployer
        print("  ✅ agent.deployer - no syntax errors")
    except SyntaxError as e:
        print(f"  ❌ agent.deployer - SYNTAX ERROR: {e}")
    except Exception as e:
        print(f"  ⚠️  agent.deployer - OTHER ERROR: {e}")

def check_import_paths():
    """Check if imports work"""
    print("\n📦 Import path check:")

    try:
        from agent.deployer import Deployer
        print("  ✅ from agent.deployer import Deployer")

        # Check if it's actually a class
        if inspect.isclass(Deployer):
            print("  ✅ Deployer is a class")
        else:
            print(f"  ❌ Deployer is not a class, it's a {type(Deployer)}")

    except Exception as e:
        print(f"  ❌ Import failed: {e}")

def check_circular_imports():
    """Look for potential circular import issues"""
    print("\n🔄 Circular import check:")

    # This is a simplified check
    try:
        import agent.deployer
        import agent.file_writer
        import tasks
        print("  ✅ No obvious circular imports detected")
    except Exception as e:
        print(f"  ❌ Potential circular import: {e}")

if __name__ == "__main__":
    check_file_structure()
    check_syntax_errors()
    check_import_paths()
    check_circular_imports()

    print("\n" + "="*50)
    print("Run this script and share the output")
    print("="*50)
