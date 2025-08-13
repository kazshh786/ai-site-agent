# agent/deployer.py
import os
import shutil
import json
from pathlib import Path

from utils.commands import run
from utils.logger import get_logger

log = get_logger(__name__)

# Using your deployment constants
DEPLOYER_USER = "deployer"
DEPLOYER_HOST = "91.99.170.242"
DEPLOYER_KEY_PATH = os.getenv("DEPLOYER_KEY_PATH", "/root/.ssh/id_rsa_deployer")

class Deployer:
    """
    Handles local project setup (scaffold, deps, build) and remote deployment.
    """

    def create_project_directory(self, domain: str, force: bool, task_id: str) -> Path:
        """Creates a clean directory for the new website project."""
        site_path = Path(f"/opt/agent/ai-site-agent/sites/{domain.replace('.', '_')}").resolve()

        if site_path.exists():
            if force:
                log.warning(
                    f"Directory {site_path} exists. --force specified, removing directory.",
                    extra={"task_id": task_id},
                )
                shutil.rmtree(site_path)
            else:
                raise FileExistsError(
                    f"Directory {site_path} already exists. Use --force to overwrite."
                )
        
        site_path.mkdir(parents=True, exist_ok=True)
        log.info(f"Created clean directory: {site_path}", extra={"path": str(site_path), "task_id": task_id})
        return site_path

    def scaffold_project(self, site_path: Path, task_id: str):
        """Runs create-next-app to scaffold the base project."""
        log.info("Starting project scaffolding...", extra={"path": str(site_path), "task_id": task_id})

        cmd = [
            "pnpx", "create-next-app@latest", ".",
            "--typescript", "--eslint", "--tailwind", "--app",
            "--no-src-dir", "--import-alias", "@/*", "--yes"
        ]
        
        result = run(cmd, cwd=str(site_path), task_id=task_id)
        if not result.success:
            raise Exception("Failed to scaffold Next.js project.")
        
        log.info("Next.js project scaffolded successfully.", extra={"path": str(site_path), "task_id": task_id})

        log.info("Configuring project for resilient builds...", extra={"path": str(site_path), "task_id": task_id})

        # Modify package.json to include lint --fix
        package_json_path = site_path / "package.json"
        if package_json_path.exists():
            with open(package_json_path, "r+") as f:
                data = json.load(f)
                # Ensure scripts key exists
                if "scripts" not in data:
                    data["scripts"] = {}
                data["scripts"]["build"] = "next lint --fix && next build"
                f.seek(0)
                json.dump(data, f, indent=2)
                f.truncate()
            log.info("Updated package.json build script.", extra={"path": str(package_json_path), "task_id": task_id})
        else:
            log.warning("package.json not found, skipping modification.", extra={"path": str(package_json_path), "task_id": task_id})

        # Remove default eslint config if it exists, to ensure our config is used
        default_eslint_config = site_path / "eslint.config.mjs"
        if default_eslint_config.exists():
            default_eslint_config.unlink()
            log.info("Removed default eslint.config.mjs.", extra={"path": str(default_eslint_config), "task_id": task_id})

        # Create .eslintrc.json to downgrade linting errors
        eslintrc_path = site_path / ".eslintrc.json"
        eslintrc_content = {
            "extends": "next/core-web-vitals",
            "rules": {
                "@typescript-eslint/no-empty-interface": "warn",
                "@typescript-eslint/no-unused-vars": "warn"
            }
        }
        with open(eslintrc_path, "w") as f:
            json.dump(eslintrc_content, f, indent=2)
        log.info("Created .eslintrc.json with custom rules.", extra={"path": str(eslintrc_path), "task_id": task_id})

        # --- DIAGNOSTIC STEP ---
        log.info("--- DIAGNOSTIC: Listing files after configuration ---", extra={"path": str(site_path), "task_id": task_id})
        run(["ls", "-R"], cwd=str(site_path), task_id=task_id)
        log.info("--- END DIAGNOSTIC ---", extra={"path": str(site_path), "task_id": task_id})


    def install_dependencies(self, site_path: Path, task_id: str):
        """Installs additional required dependencies."""
        log.info("Installing additional dependencies...", extra={"path": str(site_path), "task_id": task_id})
        cmd = ["pnpm", "add", "@headlessui/react", "lucide-react", "tailwindcss-animate"]
        
        result = run(cmd, cwd=str(site_path), task_id=task_id)
        if not result.success:
            raise Exception("Failed to install additional dependencies.")
        log.info("All dependencies installed.", extra={"path": str(site_path), "task_id": task_id})

    def build_and_deploy(self, site_path: Path, domain: str, email: str, task_id: str):
        """Builds the Next.js project and deploys it to the remote server."""
        log.info("Starting build and deploy...", extra={"task_id": task_id, "domain": domain})

        # --- NEW STEP: Clean up duplicate lockfiles before building ---
        duplicate_lockfile = site_path / "pnpm-lock.yaml"
        if duplicate_lockfile.exists():
            log.warning(f"Removing duplicate lockfile at {duplicate_lockfile}", extra={"task_id": task_id})
            duplicate_lockfile.unlink()
        
        # 1) Build project
        build_result = run(["pnpm", "run", "build"], cwd=str(site_path), task_id=task_id)
        if not build_result.success:
            raise Exception("Failed to build Next.js project.")
        log.info("Project build successful.", extra={"task_id": task_id})

        # 2) Create remote directory
        remote_dir = f"/srv/apps/{domain}"
        ssh_result = run(
            ["ssh", "-i", DEPLOYER_KEY_PATH, f"{DEPLOYER_USER}@{DEPLOYER_HOST}", "mkdir", "-p", remote_dir],
            task_id=task_id
        )
        if not ssh_result.success:
            raise Exception("Failed to create remote directory.")

        # 3) rsync project files to remote server
        rsync_cmd = [
            "rsync", "-avz",
            "-e", f"ssh -i {DEPLOYER_KEY_PATH}",
            "--delete",
            "--exclude", "node_modules",
            "--exclude", ".next/cache",
            "--exclude", ".git",
            f"{site_path}/", f"{DEPLOYER_USER}@{DEPLOYER_HOST}:{remote_dir}/"
        ]
        rsync_result = run(rsync_cmd, task_id=task_id)
        if not rsync_result.success:
            raise Exception("Failed to sync files with rsync.")
        log.info("File sync to remote server successful.", extra={"task_id": task_id})

        # 4) Run remote provisioning script
        provision_cmd = [
            "ssh", "-i", DEPLOYER_KEY_PATH, f"{DEPLOYER_USER}@{DEPLOYER_HOST}",
            "sudo", "/srv/sites/provision_site.py",
            "--domain", domain,
            "--root", remote_dir,
            "--port", "3000",
            "--email", email
        ]
        provision_result = run(provision_cmd, task_id=task_id)
        if not provision_result.success:
            raise Exception("Failed to run remote provisioning script.")

        log.info(f"Deployment to https://{domain} complete!", extra={"domain": domain, "task_id": task_id})
