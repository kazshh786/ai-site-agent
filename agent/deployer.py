# Complete fix for agent/deployer.py

import os
import shutil
import json
import time
import requests
from pathlib import Path
from contextlib import contextmanager

from utils.commands import run
from .deployer_logger import DeployerLogger
from logger import start_span, finish_span
from utils.metrics import metrics

# Using your deployment constants
DEPLOYER_USER = "deployer"
DEPLOYER_HOST = "91.99.170.242"
DEPLOYER_KEY_PATH = os.getenv("DEPLOYER_KEY_PATH", "/root/.ssh/id_rsa_deployer")

class Deployer:
    """
    Handles local project setup (scaffold, deps, build) and remote deployment.
    Enhanced with distributed tracing and metrics.
    """
    def __init__(self):
        pass

    @contextmanager
    def _span(self, operation_name: str, **tags):
        """Context manager for automatic span lifecycle and timing metrics"""
        start_time = time.time()
        start_span(operation_name, **tags)
        try:
            yield
            finish_span(success=True)
            metrics.timing(f"deployment.{operation_name}", time.time() - start_time, **tags)
        except Exception as e:
            finish_span(success=False, error=str(e))
            metrics.timing(f"deployment.{operation_name}", time.time() - start_time, success="false", **tags)
            raise

    def create_project_directory(self, domain: str, force: bool, task_id: str) -> Path:
        """Creates a clean directory for the new website project."""
        with self._span("create_project_directory", domain=domain, force=force):
            start_time = time.time()
            DeployerLogger.log_step_start("Create Project Directory", 1, 5)
            site_path = Path(f"/opt/agent/ai-site-agent/sites/{domain.replace('.', '_')}").resolve()

            if site_path.exists():
                if force:
                    DeployerLogger.log_warning("directory.exists_force", f"Directory {site_path} exists. --force specified, removing directory.")
                    shutil.rmtree(site_path)
                else:
                    DeployerLogger.log_error("directory.exists_no_force", f"Directory {site_path} already exists. Use --force to overwrite.")
                    raise FileExistsError(f"Directory {site_path} already exists. Use --force to overwrite.")

            site_path.mkdir(parents=True, exist_ok=True)
            DeployerLogger.log_info("directory.created", f"Created clean directory: {site_path}", extra={"path": str(site_path)})
            DeployerLogger.log_step_end("Create Project Directory", start_time, True)
            return site_path

    def scaffold_project(self, site_path: Path, task_id: str):
        """Runs create-next-app and configures the base project."""
        with self._span("scaffold_project", site_path=str(site_path)):
            start_time = time.time()
            DeployerLogger.log_step_start("Scaffold and Configure Project", 2, 5)
            DeployerLogger.log_resource_usage("before_scaffold")

            cmd = [
                "pnpx", "create-next-app@latest", ".",
                "--typescript", "--eslint", "--tailwind", "--app",
                "--no-src-dir", "--import-alias", "@/*", "--yes"
            ]

            result = run(cmd, cwd=str(site_path), task_id=task_id)
            DeployerLogger.log_command_result(result, "scaffold_next_app")
            if not result.success:
                raise Exception("Failed to scaffold Next.js project.")

            # --- Configuration Steps ---
            DeployerLogger.log_info("project.configure.start", "Configuring project for resilient builds...")

            # Modify package.json
            package_json_path = site_path / "package.json"
            if package_json_path.exists():
                with open(package_json_path, "r+") as f:
                    data = json.load(f)
                    data["scripts"]["build"] = "next lint --fix && next build"
                    f.seek(0)
                    json.dump(data, f, indent=2)
                    f.truncate()
                DeployerLogger.log_info("project.configure.package_json", "Updated package.json build script.")

            # Configure TypeScript for proper JSX handling
            tsconfig_path = site_path / "tsconfig.json"
            if tsconfig_path.exists():
                with open(tsconfig_path, "r+") as f:
                    data = json.load(f)
                    # Ensure proper JSX configuration
                    data["compilerOptions"]["jsx"] = "preserve"
                    data["compilerOptions"]["jsxImportSource"] = "react"
                    # Add React types to ensure JSX namespace is available
                    if "types" not in data["compilerOptions"]:
                        data["compilerOptions"]["types"] = []
                    if "react" not in data["compilerOptions"]["types"]:
                        data["compilerOptions"]["types"].append("react")
                    if "react-dom" not in data["compilerOptions"]["types"]:
                        data["compilerOptions"]["types"].append("react-dom")

                    f.seek(0)
                    json.dump(data, f, indent=2)
                    f.truncate()
                DeployerLogger.log_info("project.configure.tsconfig", "Updated tsconfig.json for proper JSX handling.")

            # Manage ESLint config
            default_eslint_config = site_path / "eslint.config.mjs"
            if default_eslint_config.exists():
                default_eslint_config.unlink()
                DeployerLogger.log_info("project.configure.eslint_cleanup", "Removed default eslint.config.mjs.")

            # Create .eslintrc.json with comprehensive configuration
            eslintrc_path = site_path / ".eslintrc.json"
            eslintrc_content = {
                "extends": [
                    "next/core-web-vitals"
                ],
                "parser": "@typescript-eslint/parser",
                "plugins": [
                    "@typescript-eslint"
                ],
                "parserOptions": {
                    "ecmaVersion": "latest",
                    "sourceType": "module",
                    "ecmaFeatures": {
                        "jsx": True
                    }
                },
                "rules": {
                    "@typescript-eslint/no-empty-interface": "warn",
                    "@typescript-eslint/no-unused-vars": "warn",
                    "react/no-unescaped-entities": "warn",
                    "@typescript-eslint/no-explicit-any": "warn"
                }
            }
            with open(eslintrc_path, "w") as f:
                json.dump(eslintrc_content, f, indent=2)
            DeployerLogger.log_info("project.configure.eslint_custom", "Created comprehensive .eslintrc.json with JSX parser config.")

            # Create next.config.ts with standalone output
            next_config_path = site_path / "next.config.ts"
            next_config_content = """
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

module.exports = nextConfig;
"""
            with open(next_config_path, "w") as f:
                f.write(next_config_content)
            DeployerLogger.log_info("project.configure.next_config", "Created next.config.ts with standalone output.")

            DeployerLogger.log_resource_usage("after_scaffold")
            DeployerLogger.log_step_end("Scaffold and Configure Project", start_time, True)

    def install_dependencies(self, site_path: Path, task_id: str):
        """Installs all required dependencies in a single, clean step."""
        with self._span("install_dependencies", site_path=str(site_path)):
            start_time = time.time()
            DeployerLogger.log_step_start("Install Dependencies", 3, 5)
            DeployerLogger.log_resource_usage("before_install")

            package_json_path = site_path / "package.json"
            if package_json_path.exists():
                with open(package_json_path, "r+") as f:
                    data = json.load(f)
                    data.setdefault("dependencies", {})
                    data.setdefault("devDependencies", {})

                    # Add project dependencies
                    data["dependencies"].update({
                        "@headlessui/react": "^2.2.7",
                        "lucide-react": "^0.539.0",
                        "tailwindcss-animate": "^1.0.7"
                    })

                    # Add TypeScript and ESLint dependencies
                    data["devDependencies"].update({
                        "@typescript-eslint/eslint-plugin": "^8.0.0",
                        "@typescript-eslint/parser": "^8.0.0",
                        "@types/react": "^18.3.12",
                        "@types/react-dom": "^18.3.1"
                    })

                    f.seek(0)
                    json.dump(data, f, indent=2)
                    f.truncate()
                DeployerLogger.log_info("deps.package_json_updated", "Updated package.json with all dependencies including React types.")

            # Single atomic installation
            result = run(["pnpm", "install"], cwd=str(site_path), task_id=task_id)
            DeployerLogger.log_command_result(result, "pnpm_install")
            if not result.success:
                raise Exception("Failed to install dependencies.")

            DeployerLogger.log_resource_usage("after_install")
            DeployerLogger.log_step_end("Install Dependencies", start_time, True)

    def build_and_deploy(self, site_path: Path, domain: str, email: str, task_id: str):
        """Builds the Next.js project and deploys it to the remote server."""
        with self._span("build_and_deploy", site_path=str(site_path), domain=domain, email=email):
            start_time = time.time()
            DeployerLogger.log_step_start("Build and Deploy", 4, 5)
            DeployerLogger.log_resource_usage("before_build")

            # Clean up any duplicate lockfiles
            duplicate_lockfile = site_path / "pnpm-lock.yaml"
            if duplicate_lockfile.exists():
                DeployerLogger.log_warning("build.duplicate_lockfile", f"Removing duplicate lockfile at {duplicate_lockfile}")
                duplicate_lockfile.unlink()

            # Build the project
            build_result = run(["pnpm", "run", "build"], cwd=str(site_path), task_id=task_id)
            DeployerLogger.log_command_result(build_result, "next_build")
            if not build_result.success:
                raise Exception("Failed to build Next.js project.")

            DeployerLogger.log_resource_usage("after_build")

            # Deployment steps
            remote_dir = f"/srv/apps/{domain}"
            ssh_result = run(["ssh", "-i", DEPLOYER_KEY_PATH, f"{DEPLOYER_USER}@{DEPLOYER_HOST}", "mkdir", "-p", remote_dir], task_id=task_id)
            DeployerLogger.log_command_result(ssh_result, "deploy_create_remote_dir")
            if not ssh_result.success:
                raise Exception("Failed to create remote directory.")

            rsync_cmd = ["rsync", "-avz", "-e", f"ssh -i {DEPLOYER_KEY_PATH}", "--delete", "--exclude", "node_modules", "--exclude", ".next/cache", "--exclude", ".git", f"{site_path}/", f"{DEPLOYER_USER}@{DEPLOYER_HOST}:{remote_dir}/"]
            rsync_result = run(rsync_cmd, task_id=task_id)
            DeployerLogger.log_command_result(rsync_result, "deploy_rsync")
            if not rsync_result.success:
                raise Exception("Failed to sync files with rsync.")

            provision_cmd = ["ssh", "-i", DEPLOYER_KEY_PATH, f"{DEPLOYER_USER}@{DEPLOYER_HOST}", "sudo", "/srv/sites/provision_site.py", "--domain", domain, "--root", remote_dir, "--port", "3000", "--email", email]
            provision_result = run(provision_cmd, task_id=task_id)
            DeployerLogger.log_command_result(provision_result, "deploy_provision_script")
            if not provision_result.success:
                raise Exception("Failed to run remote provisioning script.")

            DeployerLogger.log_step_end("Build and Deploy", start_time, True)
            self.verify_deployment(domain)

    def verify_deployment(self, domain: str):
        """Verifies the deployed site is accessible."""
        with self._span("verify_deployment", domain=domain):
            start_time = time.time()
            DeployerLogger.log_step_start("Verify Deployment", 5, 5)
            url = f"https://{domain}"
            try:
                response = requests.get(url, timeout=30)
                response.raise_for_status()
                DeployerLogger.log_info("verify.success", f"Deployment verification successful for {url}", extra={"status_code": response.status_code, "response_time_ms": response.elapsed.total_seconds() * 1000})
                DeployerLogger.log_step_end("Verify Deployment", start_time, True)
            except requests.exceptions.RequestException as e:
                DeployerLogger.log_error("verify.failure", f"Deployment verification failed for {url}: {e}", extra={"error": str(e)})
                DeployerLogger.log_step_end("Verify Deployment", start_time, False)
                # We don't raise an exception here, just log the failure
