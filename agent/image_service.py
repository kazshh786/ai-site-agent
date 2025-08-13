import os
import requests
from typing import List, Dict, Any
from logger import get_logger, start_span, finish_span
from tenacity import retry, stop_after_attempt, wait_exponential

log = get_logger(__name__)

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")
PEXELS_API_URL = "https://api.pexels.com/v1/search"

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def get_images_from_pexels(query: str) -> List[Dict[str, str]]:
    """
    Fetches relevant, high-quality images from the Pexels API, with retries.
    Returns a list of dictionaries, each representing an image with a role and its source URL.
    This format aligns with Pydantic expecting a list of dictionaries for images.
    """
    start_span("get_images_from_pexels", query=query)
    try:
        log.info(f"Searching for images on Pexels", extra={'query': query})
        if not PEXELS_API_KEY:
            log.warning("PEXELS_API_KEY not set. Cannot fetch images.")
            finish_span(success=False, reason="PEXELS_API_KEY not set")
            return []

        url = PEXELS_API_URL
        headers = {"Authorization": PEXELS_API_KEY}
        params = {"query": query, "per_page": 20, "orientation": "landscape"}
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        data = response.json()
        photos = data.get("photos", [])

        if photos and len(photos) >= 10:
            log.info(f"Found {len(photos)} images on Pexels.")
            
            # --- KEY CHANGE HERE: Format output as a list of dictionaries ---
            # Each dictionary represents an image with a 'role' and 'src' URL.
            # This directly addresses the Pydantic warning of expecting a list.
            image_list = [
                {"role": "hero", "src": photos[0]['src']['large2x']},
                {"role": "about_header", "src": photos[1]['src']['large2x']},
                {"role": "services_header", "src": photos[2]['src']['large2x']},
                {"role": "pricing_header", "src": photos[3]['src']['large2x']},
                {"role": "blog_header", "src": photos[4]['src']['large2x']},
                {"role": "contact_header", "src": photos[5]['src']['large2x']},
                {"role": "cta_background", "src": photos[6]['src']['large2x']},
                {"role": "about_inline", "src": photos[7]['src']['large2x']},
                {"role": "services_inline", "src": photos[8]['src']['large2x']},
            ]
            finish_span(success=True, image_count=len(image_list))
            return image_list
        else:
            log.warning("Not enough images found on Pexels. Will use placeholders.")
            finish_span(success=True, image_count=0, reason="Not enough images found")
            return []
    except requests.exceptions.RequestException as e:
        log.warning(f"Failed to get images from Pexels. Retrying... Error: {e}")
        finish_span(success=False, error=str(e))
        raise e # Re-raise to allow tenacity to retry
    except Exception as e:
        log.error(f"An unexpected error occurred during image fetch: {e}")
        finish_span(success=False, error=str(e))
        return []

# Alias to maintain backward compatibility if 'fetch_images' is called directly elsewhere
# This alias will now correctly return a List[Dict[str, str]] as well.
def fetch_images(query: str) -> List[Dict[str, str]]:
    return get_images_from_pexels(query)
