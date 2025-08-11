# FILE 1: content_generator.py
# This file is responsible for interacting with the Google Cloud LLM API
# to generate the structured content and a CSS theme for the website.

import json
import requests

def get_site_content(company_name: str, industry: str, api_key: str) -> dict:
    """
    Generates all website text content by calling the Gemini API.
    """
    print(f"[•] Generating AI content for {company_name} ({industry})...")
    prompt = f"""
    You are a professional copywriter creating content for a website for a company named '{company_name}', which is in the '{industry}' industry.
    The tone should be professional, confident, and customer-focused.
    The output MUST be a valid JSON object. Do not include any text before or after the JSON object.
    The JSON object should have the following structure:
    {{
      "home": {{ "hero_headline": "A powerful, benefit-focused headline.", "hero_subheadline": "A supportive subheadline.", "primary_cta": "A short, action-oriented call-to-action.", "secondary_cta": "A secondary call-to-action.", "about_section_title": "About Us", "about_section_content": "A paragraph summarizing the company.", "services_section_title": "Our Services", "services_section_subtitle": "A sub-title for the services section.", "testimonials_section_title": "What Our Clients Say" }},
      "about_page": {{ "title": "About Us", "header_headline": "A captivating headline for the About page.", "intro_paragraph": "An introductory paragraph for the About page.", "mission_statement": "The company's mission statement.", "vision_statement": "The company's vision statement.", "team_section_title": "Meet Our Team", "team_members": [ {{"name": "John Doe", "title": "CEO", "bio": "A short bio."}}, {{"name": "Jane Smith", "title": "COO", "bio": "A short bio."}} ] }},
      "services_page": {{ "title": "Our Services", "header_headline": "Solutions for Your Success", "intro_paragraph": "An intro for the Services page." }},
      "pricing_page": {{ "title": "Pricing", "header_headline": "Find the Perfect Plan", "intro_paragraph": "An intro for the Pricing page.", "pricing_tiers": [ {{"name": "Basic", "price": "$99", "frequency": "/mo", "description": "For small teams.", "features": ["Feature 1", "Feature 2"], "cta_text": "Choose Plan", "featured": false}}, {{"name": "Pro", "price": "$299", "frequency": "/mo", "description": "For growing teams.", "features": ["All Basic Features", "Feature 3"], "cta_text": "Choose Plan", "featured": true}} ] }},
      "blog_page": {{ "title": "Blog", "header_headline": "Insights & News", "intro_paragraph": "An intro for the Blog page.", "posts": [ {{"title": "Post Title 1", "date": "July 14, 2025", "excerpt": "A short excerpt...", "author": "Staff Writer"}}, {{"title": "Post Title 2", "date": "July 1, 2025", "excerpt": "Another short excerpt...", "author": "Staff Writer"}} ] }},
      "contact_page": {{ "title": "Contact Us", "header_headline": "Let's Get In Touch", "intro_paragraph": "An intro for the Contact page.", "form_title": "Send a Message", "office_hours": "Mon-Fri: 9am - 5pm" }},
      "final_cta": {{ "headline": "Ready to Get Started?", "subheadline": "Contact us today.", "button_text": "Contact Sales", "button_link": "/contact" }},
      "services_list": [ {{"icon": "LocalShipping", "title": "Road Freight", "description": "Reliable road freight services."}}, {{"icon": "FlightTakeoff", "title": "Air Freight", "description": "Fast air freight solutions."}}, {{"icon": "Warehouse", "title": "Warehousing", "description": "Secure storage."}}, {{"icon": "Language", "title": "Customs", "description": "Hassle-free customs clearance."}} ],
      "why_choose_us_list": [ {{"icon": "TrackChanges", "title": "Real-Time Tracking", "description": "Monitor your shipment."}}, {{"icon": "SupportAgent", "title": "24/7 Support", "description": "Our team is here to help."}}, {{"icon": "PriceCheck", "title": "Competitive Pricing", "description": "Get the best rates."}} ],
      "stats_list": [ {{"value": "1.2M+", "label": "Deliveries"}}, {{"value": "98%", "label": "On-Time"}}, {{"value": "500+", "label": "Partners"}} ],
      "testimonials_list": [ {{"quote": "The best partner we've ever had.", "author": "Client Name", "company": "Client Company"}}, {{"quote": "Their efficiency is second to none.", "author": "Another Client", "company": "Another Company"}} ],
      "client_logos": [ {{"name": "Client A"}}, {{"name": "Client B"}}, {{"name": "Client C"}}, {{"name": "Client D"}}, {{"name": "Client E"}} ],
      "contact": {{ "address": "123 Business Avenue, City, Country", "phone": "+1 (555) 123-4567", "email": "contact@{company_name.lower().replace(' ', '')}.com" }}
    }}
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()
        full_text = response.json()['candidates'][0]['content']['parts'][0]['text']
        json_str = full_text.strip().lstrip("```json").rstrip("```")
        content = json.loads(json_str)
        print("[✔] Received and parsed content from Gemini.")
        return content
    except (requests.exceptions.RequestException, KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"[!] FAILED to call or parse Gemini content response: {e}")
    return {}

def get_ai_stylesheet(company_name: str, industry: str, api_key: str) -> str:
    """
    Generates a custom CSS stylesheet with variables using the Gemini API.
    """
    print(f"[•] Generating AI stylesheet for {company_name}...")
    prompt = f"""
    You are an expert web designer creating a unique theme for a new client.
    The company is named "{company_name}" and is in the "{industry}" industry.

    Your task is to generate a block of CSS code. The output MUST be only the raw CSS code.
    Do not include markdown fences like ```css or any other explanatory text.

    The CSS MUST include a `:root` block defining CSS variables for a unique color palette.
    Example:
    :root {{
      --primary-color: #4f46e5;
      --secondary-color: #ec4899;
      --background-color: #ffffff;
      --text-color: #111827;
      --neutral-color: #404040;
    }}

    Base the color choices on the industry. For a '{industry}' company, think about colors that convey trust, efficiency, and professionalism (e.g., blues, greys, whites).
    """
    url = f"[https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=){api_key}"
    headers = {"Content-Type": "application/json"}
    data = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()
        css_content = response.json()['candidates'][0]['content']['parts'][0]['text']
        css_content = css_content.strip().lstrip("```css").rstrip("```").strip()
        print("[✔] Received CSS stylesheet from Gemini.")
        return css_content
    except (requests.exceptions.RequestException, KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"[!] FAILED to generate or parse AI stylesheet: {e}")
        # Return a sensible default theme if AI fails
        return """
:root {
  --primary-color: #1D4ED8;
  --secondary-color: #9333EA;
  --accent-color: #F59E0B;
  --neutral-color: #404040;
  --background-color: #ffffff;
  --text-color: #111827;
}
"""
