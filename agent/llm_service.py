# agent/llm_service.py - Corrected with fix for validation pipeline
import re
import json
import time
import logging
from typing import List, Optional, Union
from contextlib import contextmanager

from vertexai import init as vertexai_init
from vertexai.preview.generative_models import GenerativeModel, Part
from google.cloud import aiplatform_v1beta1 as aiplatform
from google.api_core import exceptions
from tenacity import retry, stop_after_attempt, wait_exponential

from .schemas import SiteBlueprint
from logger import get_logger, start_span, finish_span

log = get_logger(__name__)

# --- Configurations (Unchanged) ---
TUNED_PROJECT_ID = "1062532524126"
TUNED_LOCATION = "us-central1"
TUNED_ENDPOINT_ID = "9038580416109346816"
TUNED_ENDPOINT_PATH = f"projects/{TUNED_PROJECT_ID}/locations/{TUNED_LOCATION}/endpoints/{TUNED_ENDPOINT_ID}"
GENERAL_PROJECT_ID = "automated-ray-463204-i2"
GENERAL_LOCATION = "us-central1"
GENERAL_MODEL_NAME = "gemini-2.5-flash" 

# --- Client Initialization (Unchanged) ---
try:
    vertexai_init(project=GENERAL_PROJECT_ID, location=GENERAL_LOCATION)
except Exception:
    pass
PREDICTION_CLIENT = aiplatform.PredictionServiceClient(
    client_options={"api_endpoint": f"{TUNED_LOCATION}-aiplatform.googleapis.com"}
)

@contextmanager
def _span(operation_name: str, **tags):
    """Context manager for automatic span lifecycle"""
    start_span(operation_name, **tags)
    try:
        yield
        finish_span(success=True)
    except Exception as e:
        finish_span(success=False, error=str(e))
        raise

# --- Code Validation and Fixing Functions (Unchanged) ---
def validate_component_imports(code: str, available_components: List[str], component_name: str, task_id: str) -> str:
    with _span("validate_component_imports", component_name=component_name):
        if not available_components:
            return code
        import_pattern = r"import\s+(\w+)\s+from\s+['\"]@/components/(\w+)['\"]"
        imports = re.findall(import_pattern, code)
        available_set = set(f.replace('.tsx', '') for f in available_components)
        code_lines = code.split('\n')
        new_code_lines = []
        replaced_components = set()
        for line in code_lines:
            match = re.match(import_pattern, line)
            if match:
                imported_name, file_name = match.groups()
                if file_name in available_set:
                    new_code_lines.append(line)
                else:
                    if "Placeholder" not in code:
                        new_code_lines.append("import Placeholder from '@/components/Placeholder';")
                    replaced_components.add(imported_name)
                    log.warning(f"🔄 Replacing missing component import in {component_name}: {file_name}",
                                extra={"component": component_name, "task_id": task_id})
            else:
                new_code_lines.append(line)
        code = '\n'.join(new_code_lines)
        for component_to_replace in replaced_components:
            code = re.sub(
                rf'<{component_to_replace}(\s+[^>]*)?\/?>',
                f'<Placeholder componentName="{component_to_replace}" />',
                code
            )
            code = re.sub(
                rf'<{component_to_replace}(\s+[^>]*)?>(.*?)<\/{component_to_replace}>',
                f'<Placeholder componentName="{component_to_replace}" />',
                code,
                flags=re.DOTALL
            )
        return code

def lint_and_fix_code(code: str, component_name: str, task_id: str) -> str:
    with _span("lint_and_fix_code", component_name=component_name):
        fixes_applied = []
        if 'import Link from' not in code and re.search(r'<a\s+href=["\'](/[^"\']*)["\']', code):
            code = "import Link from 'next/link';\n" + code
            fixes_applied.append("Added Link import")
        code = re.sub(r'<a\s+href=(["\']/[^"\']*["\'])([^>]*)>(.*?)</a>', r'<Link href=\1\2>\3</Link>', code, flags=re.DOTALL)
        if 'Link' in code:
            fixes_applied.append("Fixed internal <a> tags")
        if 'import Image from' not in code and '<img' in code:
            code = "import Image from 'next/image';\n" + code
            fixes_applied.append("Added Image import")
        def replace_img_with_image(match):
            attrs_str = match.group(1)
            attrs = dict(re.findall(r'(\w+)=["\']([^"\']*)["\']', attrs_str))
            if 'width' not in attrs: attrs['width'] = '500'
            if 'height' not in attrs: attrs['height'] = '300'
            if 'alt' not in attrs: attrs['alt'] = 'image'
            final_attrs = []
            for k, v in attrs.items():
                if v.isdigit():
                    final_attrs.append(f'{k}={{int({v})}}')
                else:
                    final_attrs.append(f'{k}="{v}"')
            return f'<Image {" ".join(final_attrs)} />'
        code = re.sub(r'<img([^>]+)/?>', replace_img_with_image, code)
        if 'Image' in code:
            fixes_applied.append("Fixed <img> tags")
        if re.search(r'use(State|Effect|Ref|Callback|Memo|Context)', code) and not code.strip().startswith('"use client"'):
            code = '"use client";\n' + code
            fixes_applied.append("Added 'use client' directive")
        if fixes_applied:
            log.info(f"🔧 Applied code fixes to {component_name}: {', '.join(fixes_applied)}",
                     extra={"component": component_name, "fixes": fixes_applied, "task_id": task_id})
        return code

# --- THIS IS THE MODIFIED FUNCTION ---
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _generate_code(prompt: str, component_name: str, task_id: str, available_components: Optional[List[str]] = None) -> str:
    """
    Generates code using the fine-tuned model and applies a validation pipeline.
    """
    with _span("_generate_code", component_name=component_name):
        log_extra = {"request_type": f"generate_code:{component_name}", "model": f"tuned-endpoint-{TUNED_ENDPOINT_ID}", "task_id": task_id}
        log.info(f"🧠 Requesting AI for: {log_extra['request_type']} (tuned model)", extra=log_extra)

        request = aiplatform.GenerateContentRequest(
            model=TUNED_ENDPOINT_PATH,
            contents=[aiplatform.Content(role="user", parts=[aiplatform.Part(text=prompt)])],
            # Request plain text for code generation
            generation_config=aiplatform.GenerationConfig(response_mime_type="text/plain")
        )

        try:
            response = PREDICTION_CLIENT.generate_content(request=request)

            if not (response.candidates and response.candidates[0].content.parts):
                raise ValueError("Tuned AI model returned an empty or invalid response for code generation.")

            raw_code = response.candidates[0].content.parts[0].text

            # The rest of the validation pipeline remains the same
            extracted_code = re.search(r'```(?:tsx|jsx|css|ts|typescript)?\s*\n(.*?)\n```', raw_code, re.DOTALL)
            code_to_process = extracted_code.group(1).strip() if extracted_code else raw_code.strip()

            if available_components and component_name == "DynamicPage.tsx":
                code_to_process = validate_component_imports(code_to_process, available_components, component_name, task_id)

            final_code = lint_and_fix_code(code_to_process, component_name, task_id)

            return final_code

        except exceptions.GoogleAPICallError as e:
            log.error(f"Google API Error calling tuned model for code generation: {e.message}", extra={"code": e.code, **log_extra})
            raise
        except Exception as e:
            log.error(f"An unexpected error occurred with the tuned model during code generation: {e}", extra=log_extra)
            raise

# --- Blueprint and Component Generation Functions (Unchanged) ---
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def get_site_blueprint(company: str | None, brief: str, task_id: str) -> Optional[SiteBlueprint]:
    with _span("get_site_blueprint", company=company, brief=brief):
        log_extra = {"company": company, "brief": brief, "model": f"tuned-endpoint-{TUNED_ENDPOINT_ID}", "task_id": task_id}
        log.info("🧠 Requesting AI for: get_site_blueprint (tuned model)", extra=log_extra)

        company_text = f"for the company: {company}" if company else "for the company mentioned in the brief"
        user_prompt_text = (
            f"You are an expert website architect. Your task is to analyze the following detailed client brief "
            f"and generate a complete JSON site blueprint that strictly follows the provided schema. "
            f"The company name might be specified in the brief. If it is, you must use it. "
            f"Ensure you create all the pages, services, and specific features mentioned.\n\n"
            f"--- CLIENT BRIEF ---\n"
            f"{brief}\n"
            f"--- END BRIEF ---\n\n"
            f"Now, generate the complete JSON blueprint {company_text}."
        )
        request = aiplatform.GenerateContentRequest(
            model=TUNED_ENDPOINT_PATH,
            contents=[aiplatform.Content(role="user", parts=[aiplatform.Part(text=user_prompt_text)])],
            generation_config=aiplatform.GenerationConfig(response_mime_type="application/json")
        )
        try:
            response = PREDICTION_CLIENT.generate_content(request=request)
            if not (response.candidates and response.candidates[0].content.parts):
                raise ValueError("Tuned AI model returned an empty or invalid response.")
            raw_text = response.candidates[0].content.parts[0].text
            blueprint_data = json.loads(raw_text)
            log.info(f"Raw AI blueprint data: {json.dumps(blueprint_data, indent=2)}", extra=log_extra)
            validated_blueprint = SiteBlueprint.model_validate(blueprint_data)
            log.info("✅ Blueprint validated successfully from tuned model.", extra=log_extra)
            return validated_blueprint
        except json.JSONDecodeError as e:
            log.error("Invalid JSON returned by tuned model.", extra={"raw_text": raw_text[:500], "error": str(e), **log_extra})
            raise ValueError(f"Tuned model generated malformed JSON: {e}") from e
        except exceptions.GoogleAPICallError as e:
            log.error(f"Google API Error calling tuned model: {e.message}", extra={"code": e.code, **log_extra})
            raise
        except Exception as e:
            log.error(f"An unexpected error occurred with the tuned model: {e}", extra=log_extra)
            raise

def get_component_code(component_name: str, blueprint: SiteBlueprint, task_id: str) -> str:
    REACT_TYPESCRIPT_GUIDELINES = """
## Critical TypeScript/React Guidelines - MUST FOLLOW EXACTLY:

1. **Import Statements**:
   ```typescript
   // For React 18+ with Next.js, NO NEED to import React explicitly
   // ONLY import React if using React.FC or React.ComponentType
   import { useState, useEffect } from 'react'; // Import hooks directly
   ```

2. **Component Definition - Use ONE of these patterns**:

   **Option A - Implicit Typing (PREFERRED):**
   ```typescript
   interface ComponentProps {
     title?: string;
     className?: string;
   }

   const ComponentName = ({ title, className = '' }: ComponentProps) => {
     return <div className={className}>{title}</div>;
   };
   ```

   **Option B - Explicit React.FC (if needed):**
   ```typescript
   import React from 'react';

   interface ComponentProps {
     title?: string;
   }

   const ComponentName: React.FC<ComponentProps> = ({ title }) => {
     return <div>{title}</div>;
   };
   ```

3. **NEVER use JSX.Element as return type**:
   ❌ Bad: `const MyComponent = (): JSX.Element => {`
   ✅ Good: `const MyComponent = () => {` (implicit)
   ✅ Good: `const MyComponent: React.FC = () => {` (explicit)

4. **Interface Definitions - Always meaningful**:
   ❌ Bad: `interface HeaderProps {}`
   ✅ Good: `interface HeaderProps { title?: string; showNav?: boolean; }`

5. **Props Usage - Avoid unused variables**:
   ❌ Bad: `const Footer = (props: FooterProps) => { // props never used`
   ✅ Good: `const Footer = ({ links, copyright }: FooterProps) => {`
   ✅ Good: `const Footer = (_props: FooterProps) => {` // If truly unused, prefix with _

6. **String Escaping in JSX**:
   ❌ Bad: `<p>"Don't worry"</p>`
   ✅ Good: `<p>&quot;Don&apos;t worry&quot;</p>`
   ✅ Good: `<p>{'Don\\'t worry'}</p>` (JS string)

7. **Hooks Usage**:
   ```typescript
   'use client'; // Add this directive at the top if using hooks

   import { useState, useEffect } from 'react';

   const Component = () => {
     const [isOpen, setIsOpen] = useState<boolean>(false);
     // ... rest of component
   };
   ```

8. **Component Structure Template**:
   ```typescript
   // No React import needed for React 18+
   import { useState } from 'react'; // Only if using hooks
   import Link from 'next/link';

   interface ComponentProps {
     title?: string;
     className?: string;
   }

   const ComponentName = ({ title = 'Default Title', className = '' }: ComponentProps) => {
     // Component logic here

     return (
       <div className={className}>
         {title && <h2>{title}</h2>}
         <Link href="/about">About</Link>
       </div>
     );
   };

   export default ComponentName;
   ```

9. **TypeScript Best Practices**:
   - Never use `any` type - use `unknown` or specific types
   - Use optional chaining: `data?.property`
   - Provide default values in destructuring: `{ title = 'Default' }`
   - Type all function parameters and return values when not obvious

10. **Next.js Specific**:
    - Use `Link` from 'next/link' for internal navigation
    - Use `Image` from 'next/image' for images with width/height
    - Add 'use client' directive only when using browser-specific features
"""
    prompt = f"""
    {REACT_TYPESCRIPT_GUIDELINES}

    You are a senior React/Next.js developer specializing in Tailwind CSS.
    Your task is to create the code for a single, reusable React component.

    **Component Name:** `{component_name}`
    **Client & Industry:** {blueprint.client_name}
    **Full Website Blueprint (for context on props and content):**
    {blueprint.model_dump_json(by_alias=True, indent=2)}

    **CRITICAL INSTRUCTIONS:**
    - Follow the TypeScript guidelines above EXACTLY
    - Never use JSX.Element return types
    - Define meaningful interfaces (not empty ones)
    - Use all props or destructure selectively
    - Escape quotes properly in JSX
    - Make the component production-ready
    - Use Tailwind CSS for all styling. Make it modern, professional, and visually appealing.
    - ONLY use these available lucide-react icons: Menu, X, ChevronDown, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Check, Star, Users, Truck, Bot, Cpu, Zap.
    - Use `<Link href="...">` for internal navigation.
    - Use `<Image ... />` for images, always including `width`, `height`, and `alt`.
    - Add `"use client";` at the top ONLY if you use hooks like `useState`.
    - Your entire output must be only the raw `.tsx` code inside a ```tsx code block.
    """
    return _generate_code(prompt, f"{component_name}.tsx", task_id)

def get_layout_code(blueprint: SiteBlueprint, task_id: str) -> str:
    font_family = "Inter"
    if blueprint.design_system and blueprint.design_system.get("styleTokens"):
        font_family = blueprint.design_system["styleTokens"].get("font_family", "Inter")
    prompt = f"""
    Generate the complete code for a root layout file (`layout.tsx`) for a Next.js 14+ App Router project.

    **CRITICAL INSTRUCTIONS:**
    1.  **TypeScript:**
        - **NEVER use the `any` type.**
        - The root layout accepts a `children` prop. It MUST be typed as `React.ReactNode`.
        - The function signature must be `export default function RootLayout({{ children }}: {{ children: React.ReactNode }}) {{ ... }}`.
    2.  **Structure:**
        - Import and render the `Header` and `Footer` components.
        - The `Header` must be right after the `<body>` tag.
        - The `Footer` must be at the end, before the closing `</body>` tag.
    3.  **Imports:**
        - Use the `@/` alias for all component imports (e.g., `import Header from '@/components/Header';`).
        - Import the global stylesheet using the correct relative path: `import './globals.css';`
    4.  **Font:** The font should be '{font_family}'.
    5.  **Output:** Only output the raw TSX code in a single ```tsx code block.
    """
    return _generate_code(prompt, "layout.tsx", task_id)

def get_globals_css_code(blueprint: SiteBlueprint, task_id: str) -> str:
    """
    Generates the content for globals.css, ensuring essential CSS variables are always included,
    while still using the unique primary and secondary colors from the AI blueprint.
    """
    # Set default fallback colors
    primary_color = "222.2 47.4% 11.2%"
    secondary_color = "210 40% 96.1%"

    # Check the blueprint for AI-generated colors and use them if they exist
    if blueprint.design_system and blueprint.design_system.get("styleTokens"):
        primary_color = blueprint.design_system["styleTokens"].get("primary_color", primary_color)
        secondary_color = blueprint.design_system["styleTokens"].get("secondary_color", secondary_color)

    # Use an f-string to insert the unique, AI-driven colors into the CSS template
    DEFAULT_CSS_VARIABLES = f"""
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {{
  :root {{
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: {primary_color};
    --primary-foreground: 210 40% 98%;

    --secondary: {secondary_color};
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }}

  .dark {{
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }}
}}

@layer base {{
  * {{
    @apply border-border;
  }}
  body {{
    @apply bg-background text-foreground;
  }}
}}
"""

    prompt = (
        "Generate additional CSS styles for the 'globals.css' file. "
        "The provided blueprint contains the color palette and typography. "
        "The CSS should include modern design principles, be responsive, and visually appealing. "
        "DO NOT include the '@tailwind' directives or the ':root' and '.dark' selectors for base variables, as they are already defined. "
        "You can add styles for h1, h2, buttons, or other global elements."
    )

    ai_generated_css = _generate_code(
        prompt,
        "globals.css",
        task_id
    )

    # Corrected return statement
    return f"{DEFAULT_CSS_VARIABLES}\n\n{ai_generated_css}"

def get_tailwind_config_code(blueprint: SiteBlueprint, task_id: str) -> str:
    prompt = """
    Generate a complete `tailwind.config.ts` for a Next.js 14+ App Router project.

    **CRITICAL INSTRUCTIONS:**
    1.  **TypeScript:**
        - **NEVER use the `any` type.**
        - You MUST import the `Config` type from tailwindcss: `import type { Config } from "tailwindcss";`
        - You MUST define the config object with this type: `const config: Config = { ... }`
    2.  **Configuration:**
        - You MUST extend the Tailwind theme to use CSS variables for colors.
        - The `colors` object in the theme should look EXACTLY like this, using HSL variables:
          ```typescript
          colors: {
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            primary: {
              DEFAULT: 'hsl(var(--primary))',
              foreground: 'hsl(var(--primary-foreground))',
            },
            secondary: {
              DEFAULT: 'hsl(var(--secondary))',
              foreground: 'hsl(var(--secondary-foreground))',
            },
            destructive: {
              DEFAULT: 'hsl(var(--destructive))',
              foreground: 'hsl(var(--destructive-foreground))',
            },
            muted: {
              DEFAULT: 'hsl(var(--muted))',
              foreground: 'hsl(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'hsl(var(--accent))',
              foreground: 'hsl(var(--accent-foreground))',
            },
            popover: {
              DEFAULT: 'hsl(var(--popover))',
              foreground: 'hsl(var(--popover-foreground))',
            },
            card: {
              DEFAULT: 'hsl(var(--card))',
              foreground: 'hsl(var(--card-foreground))',
            },
          }
          ```
        - Configure the `content` array for the `app` and `components` directories.
        - Include the `tailwindcss-animate` plugin.
    3.  **Output:** Only output raw TypeScript code in a single ```ts code block.

    The generated `next.config.ts` should look like this:
    ```typescript
    import type { Config } from "tailwindcss";

    const config: Config = {
      // ... other config
    };
    export default config;
    ```
    And the `next.config.js` should look like this:
    ```javascript
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      output: 'standalone',
    };

    module.exports = nextConfig;
    ```
    """
    return _generate_code(prompt, "tailwind.config.ts", task_id)

def get_header_code(blueprint: SiteBlueprint, task_id: str) -> str:
    page_links = ", ".join([f"'{page.name}'" for page in blueprint.pages])
    client = blueprint.client_name
    prompt = f"""
    Generate a `Header.tsx` component for a Next.js project.

    **CRITICAL INSTRUCTIONS:**
    1.  **TypeScript:**
        - **NEVER use the `any` type.**
        - **AVOID empty interfaces** - use `{{}}` directly or add meaningful properties
        - If you need to define props, add at least one optional property like: `interface HeaderProps {{ className?: string; }}`
        - Ensure all variables (like for mobile menu state) and functions are fully typed.
    2.  **Functionality:**
        - Add `"use client";` at the top because it will use `useState` for the mobile menu.
        - Display the client name: "{client}".
        - Include navigation links for these pages: {page_links}. Use the `<Link>` component.
        - Implement a working mobile menu toggle with a hamburger icon.
    3.  **Styling:** Use Tailwind CSS and `lucide-react` for icons.
    4.  **Output:** Only output the raw TSX code in a single ```tsx code block.
    """
    return _generate_code(prompt, "Header.tsx", task_id)

def get_footer_code(blueprint: SiteBlueprint, task_id: str) -> str:
    page_links = ", ".join([f"'{page.name}'" for page in blueprint.pages])
    client = blueprint.client_name
    prompt = f"""
    Generate a `Footer.tsx` component for a Next.js project.
    
    **CRITICAL INSTRUCTIONS:**
    1.  **TypeScript:**
        - **NEVER use the `any` type.**
        - **AVOID empty interfaces** - use `{{}}` directly or add meaningful properties
        - If you need to define props, add at least one optional property like: `interface FooterProps {{ className?: string; }}`
        - Ensure all variables and functions are fully typed.
    2.  **Content:**
        - Show the copyright notice using the current year: "© {time.strftime('%Y')} {client}".
        - Include navigation links for these pages: {page_links}. Use the `<Link>` component.
    3.  **Styling:** Use Tailwind CSS.
    4.  **Output:** Only output the raw TSX code in a single ```tsx code block.
    """
    return _generate_code(prompt, "Footer.tsx", task_id)

def get_placeholder_code(task_id: str) -> str:
    prompt = """
    Generate a `Placeholder.tsx` React component.

    **CRITICAL REQUIREMENTS:**
    1.  **TypeScript:**
        - **NEVER use the `any` type.**
        - Define a strict props interface: `interface PlaceholderProps {{ componentName: string; }}`
        - The component signature must be `export default function Placeholder({{ componentName }}: PlaceholderProps) {{ ... }}`.
    2.  **Styling:** Use Tailwind CSS with a distinct warning theme (e.g., yellow/orange background, border, and text).
    3.  **Message:** Display a friendly message indicating that the component with `componentName` failed to load.
    4.  **Output:** Output only the complete `.tsx` code in a ```tsx code block.
    """
    return _generate_code(prompt, "Placeholder.tsx", task_id)

def get_dynamic_page_code(blueprint: SiteBlueprint, component_filenames: List[str], task_id: str) -> str:
    prompt = f"""
    You are an expert Next.js developer. Create the dynamic page component `app/[...slug]/page.tsx`.

    **TypeScript Type Definitions (for context):**
    You MUST use these interfaces to correctly type variables derived from the blueprint.
    ```tsx
    interface Component {{
      component_name: string;
      props: Record<string, unknown>;
    }}

    interface Section {{
      section_name: string;
      heading: string | null;
      components: Component[];
    }}

    // THIS MUST EXACTLY MATCH THE PYTHON SCHEMA
    interface Page {{
      id: string;
      name: string; // Use 'name' for the page title
      path: string; // Use 'path' for the URL slug
      sections: Section[];
    }}
    ```

    **CRITICAL NEXT.JS 15 REQUIREMENTS:**
    1.  Use this EXACT function signature:
        ```tsx
        interface PageProps {{
          params: Promise<{{ slug?: string[] }}>;
        }}

        export default async function DynamicPage({{ params }}: PageProps) {{
          const resolvedParams = await params;
          const slug = resolvedParams.slug;
          // ... rest of component
        }}
        ```
    2.  **TypeScript Requirements:**
        - **Use the type definitions provided above.** When you find a page, section, or component, type it correctly (e.g., `const page: Page | undefined = ...`, `const section: Section = ...`).
        - **Never use the `any` type** for variables, function parameters, or return types. Use `unknown` if a type is truly dynamic.
        - Remove unused variables or prefix with underscore.
    3.  **Character Escaping (JSX TEXT ONLY):**
        - ONLY escape characters inside JSX text content (between tags).
        - Use &apos; for apostrophes in JSX text: <p>Don&apos;t worry</p>
        - Use &quot; for quotes in JSX text: <p>He said &quot;hello&quot;</p>
        - NEVER escape characters in imports, strings, or JavaScript code.
    4.  **Component Imports:**
        - Available components: {str(component_filenames)}
        - Import using: `import ComponentName from '@/components/ComponentName';`
        - If a component is NOT in the available list, you MUST use the `Placeholder` component. For example: `import Placeholder from '@/components/Placeholder';` and render it like `<Placeholder componentName="MissingComponentName" />`.
    5.  **CRITICAL PLACEHOLDER RENDERING:**
        - When rendering Placeholder components, NEVER spread component.props that might contain a conflicting componentName property.
        - Use this exact pattern: `<Placeholder key={{componentIndex}} componentName={{component.component_name}} />`
        - Do NOT use: `<Placeholder componentName={{component.component_name}} {{...component.props}} />`
    6.  **Syntactic Correctness:** You MUST ensure the generated .tsx code is syntactically perfect. Pay close attention to details like closing tags, correct placement of semicolons, and proper object and interface definitions. The code must be ready for compilation without any syntax errors.
    7.  **Logic:**
        - Find the correct page object from the blueprint based on the slug.
        - If the slug is empty or undefined, default to the page where `page_path` is '/'.
        - If no matching page is found, render a "404 Not Found" message.
        - Map over the page's sections and components to render them. Use a `switch` statement on `component.component_name` to render the correct imported component.

    **Site Blueprint (for context):**
    {blueprint.model_dump_json(by_alias=True, indent=2)}

    Output only the complete `.tsx` code in a ```tsx code block. Do not add any explanation.
    """
    return _generate_code(prompt, "DynamicPage.tsx", task_id, component_filenames)
