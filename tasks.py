# tasks.py
import os
import logging
from pathlib import Path

from celery import Celery
from celery.signals import after_setup_logger
from celery.utils.log import get_task_logger

# Assuming your new FileWriter is in this module
from agent.file_writer import FileWriter
from logger import start_trace

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
        get_globals_css_code, get_tailwind_config_code, get_header_code,
        get_footer_code, get_placeholder_code, get_dynamic_page_code
    )
    from agent.deployer import Deployer
    from agent.image_service import get_images_from_pexels as fetch_images
    return (
        get_site_blueprint, get_component_code, get_layout_code,
        get_globals_css_code, get_tailwind_config_code, get_header_code,
        get_footer_code, get_placeholder_code, get_dynamic_page_code,
        Deployer, fetch_images
    )

@app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def create_website_task(
    self, company: str, domain: str, industry: str, model: str = "gemini",
    force: bool = False, deploy: bool = True, email: str | None = None,
):
    start_trace("create_website_task", task_id=self.request.id, company=company, domain=domain, industry=industry)
    logger.info("🚀 Full AI website creation task started.")

    try:
        (
            get_site_blueprint, get_component_code, get_layout_code,
            get_globals_css_code, get_tailwind_config_code, get_header_code,
            get_footer_code, get_placeholder_code, get_dynamic_page_code,
            Deployer, fetch_images
        ) = _imports()

        # 1. Get Blueprint & Images
        blueprint = get_site_blueprint(company, industry)
        if blueprint is None:
            raise ValueError("Blueprint generation failed or returned an invalid structure.")

        try:
            imgs = fetch_images(industry)
            # This part may need adjustment depending on how images are handled in the new schema
            # if hasattr(blueprint, "images"):
            #     blueprint.images = imgs
        except Exception as e:
            logger.warning(
                "Image fetch failed, continuing without images.",
                extra={"error": str(e)},
            )

        # 2. Setup
        deployer = Deployer()
        file_writer = FileWriter(base_dir="/opt/agent/ai-site-agent")
        site_path = deployer.create_project_directory(domain, force)
        
        # 3. Scaffold Project
        deployer.scaffold_project(site_path)
        
        # 4. Generate and Write ALL Component Files with AI
        logger.info("✍️ Generating all site files with AI...")
        
        layout_result = file_writer.write_file(site_path / "app/layout.tsx", get_layout_code(blueprint))
        if not layout_result.success:
            raise Exception(f"Failed to write layout.tsx: {layout_result.error}")

        css_result = file_writer.write_file(site_path / "app/globals.css", get_globals_css_code(blueprint))
        if not css_result.success:
            raise Exception(f"Failed to write globals.css: {css_result.error}")

        tailwind_result = file_writer.write_file(site_path / "tailwind.config.ts", get_tailwind_config_code(blueprint))
        if not tailwind_result.success:
            raise Exception(f"Failed to write tailwind.config.ts: {tailwind_result.error}")

        header_result = file_writer.write_file(site_path / "components/Header.tsx", get_header_code(blueprint))
        if not header_result.success:
            raise Exception(f"Failed to write Header.tsx: {header_result.error}")

        footer_result = file_writer.write_file(site_path / "components/Footer.tsx", get_footer_code(blueprint))
        if not footer_result.success:
            raise Exception(f"Failed to write Footer.tsx: {footer_result.error}")

        placeholder_result = file_writer.write_file(site_path / "components/Placeholder.tsx", get_placeholder_code())
        if not placeholder_result.success:
            raise Exception(f"Failed to write Placeholder.tsx: {placeholder_result.error}")

        # CORRECTED: Updated the logic to iterate through the new, more detailed blueprint structure.
        unique_components = set()
        for page in blueprint.pages:
            for section in page.sections:
                for component in section.components:
                    # We use component_name as it's more descriptive than component_type
                    unique_components.add(component.component_name)
        
        for name in unique_components:
            code = get_component_code(name, blueprint)
            file_writer.write_file(site_path / "components" / f"{name}.tsx", code)

        # 5. Regenerate the main page.tsx with correct component imports
        logger.info("🧠 Regenerating main page file with correct component context...")
        component_dir = site_path / "components"
        try:
            actual_component_filenames = os.listdir(component_dir)
        except FileNotFoundError:
            actual_component_filenames = []
            logger.warning(f"Component directory not found at {component_dir}, cannot generate page.tsx with context.")
        
        page_tsx_code = get_dynamic_page_code(blueprint, actual_component_filenames)
        file_writer.write_file(site_path / "app" / "[...slug]" / "page.tsx", page_tsx_code)
        
        # 6. Save the blueprint.json and log file writing summary
        blueprint_path = site_path / "blueprint.json"
        file_writer.write_file(blueprint_path, blueprint.model_dump_json(by_alias=True, indent=2))
        file_writer.log_final_summary()

        # 7. Install, Build, and Deploy
        deployer.install_dependencies(site_path)
        if deploy:
            email = email or os.getenv("DEPLOY_EMAIL", "admin@example.com")
            deployer.build_and_deploy(site_path, domain, email)

        result = {"status": "ok", "site_path": str(site_path)}
        logger.info("✅ Full website creation task finished successfully.")
        return result

    except Exception as e:
        logger.exception("💥 Task failed.", extra={"error": str(e)})
        raise
