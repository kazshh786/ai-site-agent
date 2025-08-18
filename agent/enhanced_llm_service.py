import re
import json
from typing import List, Optional, Dict, Any, Tuple
from contextlib import contextmanager

from vertexai import init as vertexai_init
from vertexai.preview.generative_models import GenerativeModel, Part
from google.cloud import aiplatform_v1beta1 as aiplatform
from google.api_core import exceptions
from tenacity import retry, stop_after_attempt, wait_exponential

from .schemas import SiteBlueprint
from logger import get_logger, start_span, finish_span

log = get_logger(__name__)

# --- Configurations ---
TUNED_PROJECT_ID = "1062532524126"
TUNED_LOCATION = "us-central1"
TUNED_ENDPOINT_ID = "9038580416109346816"
TUNED_ENDPOINT_PATH = f"projects/{TUNED_PROJECT_ID}/locations/{TUNED_LOCATION}/endpoints/{TUNED_ENDPOINT_ID}"

GENERAL_PROJECT_ID = "automated-ray-463204-i2"
GENERAL_LOCATION = "us-central1"
GENERAL_MODEL_NAME = "gemini-2.5-flash"

# --- Client Initialization ---
try:
    vertexai_init(project=GENERAL_PROJECT_ID, location=GENERAL_LOCATION)
except Exception:
    pass

PREDICTION_CLIENT = aiplatform.PredictionServiceClient(
    client_options={"api_endpoint": f"{TUNED_LOCATION}-aiplatform.googleapis.com"}
)
GENERAL_MODEL = GenerativeModel(GENERAL_MODEL_NAME)


@contextmanager
def _span(operation_name: str, **tags):
    start_span(operation_name, **tags)
    try:
        yield
        finish_span(success=True)
    except Exception as e:
        finish_span(success=False, error=str(e))
        raise

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def enhanced_generate_code(prompt: str, component_name: str, task_id: str, available_components: Optional[List[str]] = None) -> str:
    """
    Simplified code generation function that directly calls the fine-tuned model.
    """
    with _span("generator_ai", component_name=component_name):
        log.info(f"🧠 Generator AI creating: {component_name}", extra={"task_id": task_id})
        request = aiplatform.GenerateContentRequest(
            model=TUNED_ENDPOINT_PATH,
            contents=[aiplatform.Content(role="user", parts=[aiplatform.Part(text=prompt)])],
            generation_config=aiplatform.GenerationConfig(response_mime_type="text/plain")
        )
        try:
            response = PREDICTION_CLIENT.generate_content(request=request)
            if not (response.candidates and response.candidates[0].content.parts):
                raise ValueError("Generator AI returned empty response")
            initial_code = response.candidates[0].content.parts[0].text
            # Extract code from markdown if needed
            extracted = re.search(r'```(?:tsx|jsx|ts|typescript)?\s*\n(.*?)\n```', initial_code, re.DOTALL)
            final_code = extracted.group(1).strip() if extracted else initial_code.strip()
            return final_code
        except Exception as e:
            log.error(f"Generator AI error for {component_name}: {e}", extra={"task_id": task_id})
            raise

MASTER_PERSONA_PROMPT = """You are a world-class digital agency in a box, embodying three expert roles:

Senior Full-Stack Developer: You have 15+ years of experience building clean, scalable, and production-ready web applications. You are a master of Next.js 15, TypeScript, and Tailwind CSS. Your code is always performant, secure, and follows the latest best practices.
Lead UX/UI Designer: You create modern, beautiful, and intuitive user interfaces that rival those of leading tech companies like Apple and Stripe. Your designs are always user-centric, responsive, and adhere strictly to WCAG 2.1 AA accessibility standards, ensuring the site is usable by everyone.
SEO Specialist: You are an expert in technical SEO. Every line of code you write considers its impact on search engine rankings. You use semantic HTML5, ensure proper meta tags and structured data, and prioritize fast load times for Core Web Vitals.

Your mission is to take a client's brief and produce a complete, professional, and accessible website that requires no technical expertise from the client to appreciate."""
