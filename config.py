# in config.py
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# --- API Configuration ---
GCP_API_KEY = os.getenv("GCP_API_KEY") # Still needed for the old method if you want to keep it
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")

# --- SSH & Deployment Configuration ---
SITES_SERVER_IP = os.getenv("SITES_SERVER_IP")
SITES_SERVER_USER = os.getenv("SITES_SERVER_USER")
SITES_SERVER_SSH_KEY_PATH = os.getenv("SITES_SERVER_SSH_KEY_PATH")

# --- NEW: Google Cloud Vertex AI Config ---
GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID")
GCP_LOCATION = os.getenv("GCP_LOCATION")
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")


def validate_config():
    """Validates that all critical environment variables are loaded."""
    # Add the new variables to the validation check
    if not all([OPENAI_API_KEY, PEXELS_API_KEY, SITES_SERVER_IP, SITES_SERVER_USER, SITES_SERVER_SSH_KEY_PATH, GCP_PROJECT_ID, GCP_LOCATION, GOOGLE_APPLICATION_CREDENTIALS]):
        print("🔥 Error: One or more critical environment variables are missing.")
        print("Please check your .env file and ensure all variables are set.")
        sys.exit(1)
    print("[✔] Configuration loaded and validated.")
