import json
import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel
from google.api_core import exceptions

# --- Configuration for your Project ---
# This is your actual Google Cloud Project ID
PROJECT_ID = "automated-ray-463204-i2"
# This is the region where your Vertex AI resources are
LOCATION = "us-central1" # Or europe-west4, depending on which base model you want to test access to

print(f"--- Starting Simple Text Generation Test ---")
print(f"Project: {PROJECT_ID}, Location: {LOCATION}")

# Initialize Vertex AI
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    print("Vertex AI initialized successfully.")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to initialize Vertex AI. Error: {e}")
    exit(1)

# Instantiate a base Gemini model for simple text generation
# We will use 'gemini-2.5-flash' as requested.
try:
    model = GenerativeModel('gemini-2.5-flash') # Changed from 'gemini-pro' to 'gemini-2.5-flash'
    print("Base Gemini-2.5-Flash model instantiated successfully.")
except Exception as e:
    print(f"ERROR: Failed to instantiate GenerativeModel('gemini-2.5-flash'). Error: {e}")
    exit(1)

# Generate simple text content
try:
    print(f"Attempting to generate basic text...")
    
    # Simple prompt for basic text generation
    response = model.generate_content("Hello, AI! Please say something simple.")

    if response.text:
        print("\n--- Model Response ---")
        print(response.text)
        print("\n--- Test Succeeded: Basic Text Generated! ---")
    else:
        print("\n--- Test FAILED: Model did not return text response ---")
        print(f"Full response object: {response}")
        print("\n--- Test Failed ---")

except exceptions.GoogleAPIError as e:
    print(f"\n--- Model Call FAILED: Google API Error ---")
    print(f"Error Code: {e.code}")
    print(f"Error Message: {e.message}")
    print(f"Error Details: {e.details}")
    print(f"Raw Error: {e}")
    print("\n--- Test Failed ---")
except Exception as e:
    print(f"\n--- Model Call FAILED: Unexpected Error ---")
    print(f"Error: {e}")
    print("\n--- Test Failed ---")

