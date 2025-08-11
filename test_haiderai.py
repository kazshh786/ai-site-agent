#!/usr/bin/env python3
import os
import sys
import json
import vertexai
from google.api_core import exceptions
from vertexai.preview.generative_models import GenerativeModel, GenerationConfig

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "automated-ray-463204-i2")
LOCATION = os.getenv("GCP_REGION", "us-central1")
TUNED_MODEL_RESOURCE_NAME = "projects/1062532524126/locations/us-central1/models/4140552982506766336@1"

PROMPT = (
    "Return ONLY valid JSON (no prose). JSON with keys: company_name, industry, "
    "outline. company_name='Tech Innovations Inc.', industry='software development'."
)

def safe_extract_text(resp):
    # Try the common paths
    if hasattr(resp, "text") and resp.text:
        return resp.text
    try:
        return resp.candidates[0].content.parts[0].text  # type: ignore[attr-defined]
    except Exception:
        return ""

def dump_response(resp):
    # Best-effort dump
    try:
        # Some SDKs offer .to_dict()
        print("\n--- Raw response (to_dict) ---")
        print(json.dumps(resp.to_dict(), indent=2))  # type: ignore[attr-defined]
        return
    except Exception:
        pass

    try:
        print("\n--- Raw response (repr) ---")
        print(repr(resp))
    except Exception:
        pass

def main():
    print("--- HaiderAI2 tuned model smoke test ---")
    print(f"Project: {PROJECT_ID} | Location: {LOCATION}")
    print(f"Model:   {TUNED_MODEL_RESOURCE_NAME}")

    try:
        vertexai.init(project=PROJECT_ID, location=LOCATION)
        print("Vertex AI initialized.")
    except Exception as e:
        print(f"FATAL: vertexai.init() failed: {e}")
        sys.exit(1)

    try:
        model = GenerativeModel(TUNED_MODEL_RESOURCE_NAME)
        print("GenerativeModel instantiated.")
    except Exception as e:
        print(f"FATAL: Could not instantiate GenerativeModel: {e}")
        sys.exit(1)

    gen_cfg = GenerationConfig(
        temperature=0.1,
        max_output_tokens=2048,
        response_mime_type="application/json",  # force JSON
    )

    try:
        print("\nSending request...")
        resp = model.generate_content(PROMPT, generation_config=gen_cfg)

        dump_response(resp)

        text = safe_extract_text(resp)
        print("\n--- text ---")
        print(text if text else "[EMPTY]")

        # Try to parse as JSON so we know it's clean
        if text:
            try:
                parsed = json.loads(text)
                print("\n--- Parsed JSON (pretty) ---")
                print(json.dumps(parsed, indent=2)[:2000] + "...")
                print("\nSUCCESS: Valid JSON returned.")
            except json.JSONDecodeError as je:
                print("\nWARNING: Model returned non‑JSON / malformed JSON.")
                print(f"json error: {je}")

    except exceptions.GoogleAPIError as e:
        print("\n--- GoogleAPIError ---")
        print(f"code: {getattr(e, 'code', None)}")
        print(f"message: {getattr(e, 'message', str(e))}")
        print(f"details: {getattr(e, 'details', None)}")
        sys.exit(2)
    except Exception as e:
        print("\n--- Unexpected error ---")
        print(e)
        sys.exit(3)

if __name__ == "__main__":
    main()
