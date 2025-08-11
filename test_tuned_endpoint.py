import json
import os
from google.cloud import aiplatform_v1beta1 as aiplatform
from google.api_core import exceptions

PROJECT_ID = "1062532524126"
LOCATION = "us-central1"
ENDPOINT_ID = "9038580416109346816"  # Use checkpoint 5 (working in curl)

def test_tuned_endpoint():
    client = aiplatform.PredictionServiceClient(
        client_options={"api_endpoint": f"{LOCATION}-aiplatform.googleapis.com"}
    )
    endpoint_path = f"projects/{PROJECT_ID}/locations/{LOCATION}/endpoints/{ENDPOINT_ID}"

    request = aiplatform.GenerateContentRequest(
        model=endpoint_path,
        contents=[
            aiplatform.Content(
                role="user",
                parts=[aiplatform.Part(text="Return: {\"ping\": \"pong\"}")]
            )
        ],
        generation_config=aiplatform.GenerationConfig(response_mime_type="application/json")
    )

    try:
        response = client.generate_content(request=request)
        print("Response from tuned endpoint:")
        print(response)
    except exceptions.GoogleAPIError as e:
        print("GoogleAPIError:", e)
    except Exception as e:
        print("Unexpected Error:", e)

if __name__ == "__main__":
    test_tuned_endpoint()
