# tasks.py - FINAL CORRECTED VERSION

import os
import logging
from pathlib import Path

from celery import Celery
from celery.signals import after_setup_logger
from celery.utils.log import get_task_logger

# Assuming your new FileWriter is in this module
from agent.file_writer import FileWriter
from logger import start_trace, set_trace_context

logger = get_task_logger(__name__)

app = Celery(
    "ai_site_agent",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"),
)
app.conf.task_serializer = "json"
app.conf.result_serializer = "json"
app.conf.accept_content = ["json"]

@after_setup_logger.connect
def setup_log_colors(logger, **kwargs):
    # This is a placeholder for your colorlog setup
    pass

def _imports():
    """Lazy import services to avoid circular dependencies."""
    from agent.llm_service import (
        get_site_blueprint, get_component_code, get_layout_code,
        get_globals_css_code, get_header_code,
        get_footer_code, get_placeholder_code, get_dynamic_page_code
    )
    from agent.deployer import Deployer
    from agent.image_service import get_images_from_pexels as fetch_images
    return (
        get_site_blueprint, get_component_code, get_layout_code,
        get_globals_css_code, get_header_code,
        get_footer_code, get_placeholder_code, get_dynamic_page_code,
        Deployer, fetch_images
    )

@app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def create_website_task(
    self, brief: str, company: str | None = None, domain: str | None = None, model: str = "gemini",
    force: bool = False, deploy: bool = True, email: str | None = None,
):
    # 1. Set the trace context for the entire task
    trace_context = start_trace("create_website_task",
                               task_id=self.request.id,
                               company=company,
                               domain=domain,
                               brief=brief)
    set_trace_context(trace_context)

    logger.info("🚀 Full AI website creation task started.")

    try:
        # Import functions - NO importlib.reload() calls!
        (
            get_site_blueprint, get_component_code, get_layout_code,
            get_globals_css_code, get_header_code,
            get_footer_code, get_placeholder_code, get_dynamic_page_code,
            Deployer, fetch_images
        ) = _imports()

        # 2. Get Blueprint & Images - PASS task_id to ALL functions
        blueprint = get_site_blueprint(company, brief, task_id=self.request.id)
        if blueprint is None:
            raise ValueError("Blueprint generation failed or returned an invalid structure.")

        try:
            imgs = fetch_images(brief, task_id=self.request.id)
        except Exception as e:
            logger.warning("Image fetch failed, continuing without images.", extra={"error": str(e)})

        # 3. Setup Project Directory - PASS task_id
        deployer = Deployer()
        site_path = deployer.create_project_directory(domain, force, task_id=self.request.id)
        
        # 4. Scaffold and Configure Project - PASS task_id
        deployer.scaffold_project(site_path, task_id=self.request.id)
        
        # 5. Initialize FileWriter - PASS task_id
        file_writer = FileWriter(base_dir=site_path, task_id=self.request.id)
        
        # 6. Generate and Write ALL Site Files - PASS task_id to ALL functions
        logger.info("✍️ Generating all site files with AI...")
        
        # Define static tailwind.config.ts content
        tailwind_config_content = """
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
"""

        # Define files to be written with task_id passed to all generation functions
        files_to_write = {
            "app/layout.tsx": get_layout_code(blueprint, task_id=self.request.id),
            "app/globals.css": get_globals_css_code(blueprint, task_id=self.request.id),
            "tailwind.config.ts": tailwind_config_content.strip(),
            "components/Header.tsx": get_header_code(blueprint, task_id=self.request.id),
            "components/Footer.tsx": get_footer_code(blueprint, task_id=self.request.id),
            "components/Placeholder.tsx": get_placeholder_code(task_id=self.request.id)
        }
        
        # Write static files and check for errors
        for path, content in files_to_write.items():
            result = file_writer.write_file(site_path / path, content)
            if not result.success:
                raise Exception(f"Failed to write {path}: {result.error}")

        # Generate and write dynamic components - PASS task_id
        unique_components = {
            component.component_name 
            for page in blueprint.pages 
            for section in page.sections 
            for component in section.components
        }
        
        for name in unique_components:
            code = get_component_code(name, blueprint, task_id=self.request.id)
            result = file_writer.write_file(site_path / "components" / f"{name}.tsx", code)
            if not result.success:
                raise Exception(f"Failed to write component {name}.tsx: {result.error}")

        # Generate and write dynamic page - PASS task_id
        component_dir = site_path / "components"
        actual_component_filenames = os.listdir(component_dir) if component_dir.exists() else []
        page_tsx_code = get_dynamic_page_code(blueprint, actual_component_filenames, task_id=self.request.id)
        result = file_writer.write_file(site_path / "app" / "[...slug]" / "page.tsx", page_tsx_code)
        if not result.success:
            raise Exception(f"Failed to write dynamic page: {result.error}")
        
        # Save the blueprint.json and log file writing summary
        blueprint_path = site_path / "blueprint.json"
        result = file_writer.write_file(blueprint_path, blueprint.model_dump_json(by_alias=True, indent=2))
        if not result.success:
            raise Exception(f"Failed to write blueprint.json: {result.error}")
        file_writer.log_final_summary()

        # 7. Install, Build, and Deploy - PASS task_id
        deployer.install_dependencies(site_path, task_id=self.request.id)
        if deploy:
            email = email or os.getenv("DEPLOY_EMAIL", "admin@example.com")
            deployer.build_and_deploy(site_path, domain, email, task_id=self.request.id)

        result = {"status": "ok", "site_path": str(site_path)}
        logger.info("✅ Full website creation task finished successfully.")
        return result

    except Exception as e:
        logger.exception("💥 Task failed.", extra={"error": str(e)})
        raise
