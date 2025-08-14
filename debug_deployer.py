#!/usr/bin/env python3
"""
Debug script to check what methods actually exist on the Deployer class
Run this from your project root to diagnose the issue
"""

import sys
import inspect
from pathlib import Path

# Add your project to path
sys.path.insert(0, str(Path(__file__).parent.resolve()))

try:
    from agent.deployer import Deployer
    print("✅ Successfully imported Deployer class.")

    print("\nMethods found on Deployer class:")
    for name, method in inspect.getmembers(Deployer, predicate=inspect.isfunction):
        if not name.startswith("_"):
            print(f"  - {name}")

except ImportError as e:
    print(f"❌ Failed to import Deployer class: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
