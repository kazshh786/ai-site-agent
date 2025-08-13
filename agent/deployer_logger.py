# agent/deployer_logger.py
import time
import os
import psutil
from pathlib import Path
from typing import Dict, Any, Optional

# Assuming CommandResult is defined in utils.commands and has the necessary attributes
from utils.commands import CommandResult, run
from logger import get_logger

log = get_logger("agent.deployer")

class DeployerLogger:
    """
    Provides structured, detailed logging for the deployment process.
    """
    @staticmethod
    def _log(level: str, event: str, message: str, extra: Optional[Dict[str, Any]] = None):
        """Helper for logging with consistent structured data."""
        status_map = {"info": "in_progress", "warning": "warning", "error": "failed", "debug": "debug"}
        log_extra = {"event": event, "status": status_map.get(level, "unknown"), **(extra or {})}
        # Use the root logger 'agent.deployer' to log
        getattr(log, level)(message, extra=log_extra)

    @staticmethod
    def log_step_start(step_name: str, step_num: int, total_steps: int):
        DeployerLogger._log("info", f"{step_name}.start", f"Step {step_num}/{total_steps}: Starting {step_name}...", extra={"operation": step_name, "step": step_num, "total_steps": total_steps, "status": "started"})

    @staticmethod
    def log_step_end(step_name: str, start_time: float, success: bool, extra: Optional[Dict[str, Any]] = None):
        duration_ms = (time.time() - start_time) * 1000
        log_level = "info" if success else "error"
        status = "succeeded" if success else "failed"
        DeployerLogger._log(log_level, f"{step_name}.end", f"Step {step_name} {status} in {duration_ms:.2f}ms.", extra={"operation": step_name, "duration_ms": duration_ms, "status": status, **(extra or {})})

    @staticmethod
    def log_command_result(result: CommandResult, operation_name: str):
        log_extra = {
            "operation": operation_name,
            "command": " ".join(result.command),
            "duration_ms": result.duration * 1000,
            "exit_code": result.return_code,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
        if result.success:
            DeployerLogger._log("info", f"{operation_name}.success", f"Command `{log_extra['command']}` finished successfully.", extra=log_extra)
        else:
            log_extra["possible_causes"] = [
                "Missing dependencies",
                "Incorrect permissions",
                "Invalid command arguments",
                "Network connectivity issues",
                "Resource constraints (memory, disk space)"
            ]
            DeployerLogger._log("error", f"{operation_name}.failure", f"Command `{log_extra['command']}` failed.", extra=log_extra)

    @staticmethod
    def log_resource_usage(stage: str):
        process = psutil.Process(os.getpid())
        mem_info = process.memory_info()
        DeployerLogger._log("info", "resource_usage", f"Resource usage at stage '{stage}'.", extra={"stage": stage, "cpu_percent": psutil.cpu_percent(), "memory_mb": mem_info.rss / (1024 * 1024)})

    @staticmethod
    def log_file_operation(operation: str, file_path: Path, success: bool, size_bytes: Optional[int] = None, error: Optional[str] = None):
        """Logs a file operation."""
        log_level = "info" if success else "error"
        status = "✅" if success else "💥"
        log_extra = {"operation": operation, "file_path": str(file_path), "success": success}
        if size_bytes is not None:
            log_extra["size_bytes"] = size_bytes
        if error:
            log_extra["error"] = error
        DeployerLogger._log(log_level, f"file.{operation}", f"{status} {operation.capitalize()} file: {file_path}", extra=log_extra)

    @staticmethod
    def log_final_summary(success: bool, total_duration: float, domain: str):
        total_duration_ms = total_duration * 1000
        status = "succeeded" if success else "failed"
        log_level = "info" if success else "error"
        DeployerLogger._log(log_level, "deployment.end", f"Deployment for {domain} {status} in {total_duration_ms:.2f}ms.", extra={"operation": "deployment", "total_duration_ms": total_duration_ms, "status": status, "domain": domain})

    @staticmethod
    def log_info(event: str, message: str, extra: Optional[Dict[str, Any]] = None):
        DeployerLogger._log("info", event, message, extra)

    @staticmethod
    def log_warning(event: str, message: str, extra: Optional[Dict[str, Any]] = None):
        DeployerLogger._log("warning", event, message, extra)

    @staticmethod
    def log_error(event: str, message: str, extra: Optional[Dict[str, Any]] = None):
        DeployerLogger._log("error", event, message, extra)
