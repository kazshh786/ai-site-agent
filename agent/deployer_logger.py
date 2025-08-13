# agent/deployer_logger.py
import time
import os
import psutil
from pathlib import Path
from typing import Dict, Any, Optional

# Assuming CommandResult is defined in utils.commands and has the necessary attributes
from utils.commands import CommandResult, run
from utils.logger import get_logger

log = get_logger("agent.deployer")

class DeployerLogger:
    """
    Provides structured, detailed logging for the deployment process.
    """
    def __init__(self, task_id: str, domain: str):
        self.task_id = task_id
        self.domain = domain
        self.start_time = time.time()

    def _log(self, level: str, event: str, message: str, extra: Optional[Dict[str, Any]] = None):
        """Helper for logging with consistent structured data."""
        log_extra = {"task_id": self.task_id, "domain": self.domain, "event": event, **(extra or {})}
        # Use the root logger 'agent.deployer' to log
        getattr(log, level)(message, extra=log_extra)

    def log_step_start(self, step_name: str, step_num: int, total_steps: int):
        self._log("info", f"{step_name}.start", f"🚀 Step {step_num}/{total_steps}: Starting {step_name}...", extra={"step": step_num, "total_steps": total_steps})

    def log_step_end(self, step_name: str, start_time: float, success: bool, extra: Optional[Dict[str, Any]] = None):
        duration = time.time() - start_time
        status = "✅" if success else "💥"
        outcome = "succeeded" if success else "failed"
        log_level = "info" if success else "error"
        self._log(log_level, f"{step_name}.end", f"{status} Step {step_name} {outcome} in {duration:.2f}s.", extra={"duration": duration, "success": success, **(extra or {})})

    def log_command_result(self, result: CommandResult, operation_name: str):
        log_extra = {
            "command": " ".join(result.command),
            "duration": result.duration,
            "exit_code": result.return_code,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
        if result.success:
            self._log("info", f"{operation_name}.success", f"Command `{log_extra['command']}` finished successfully.", extra=log_extra)
        else:
            self._log("error", f"{operation_name}.failure", f"Command `{log_extra['command']}` failed.", extra=log_extra)

    def log_resource_usage(self, stage: str):
        process = psutil.Process(os.getpid())
        mem_info = process.memory_info()
        self._log("info", "resource_usage", f"Resource usage at stage '{stage}'.", extra={"stage": stage, "cpu_percent": psutil.cpu_percent(), "memory_mb": mem_info.rss / (1024 * 1024)})

    def log_final_summary(self, success: bool):
        total_duration = time.time() - self.start_time
        if success:
            self._log("info", "deployment.success", f"✅ Deployment for {self.domain} completed successfully in {total_duration:.2f}s.", extra={"total_duration": total_duration})
        else:
            self._log("error", "deployment.failure", f"💥 Deployment for {self.domain} failed after {total_duration:.2f}s.", extra={"total_duration": total_duration})

    def log_info(self, event: str, message: str, extra: Optional[Dict[str, Any]] = None):
        self._log("info", event, message, extra)

    def log_warning(self, event: str, message: str, extra: Optional[Dict[str, Any]] = None):
        self._log("warning", event, message, extra)

    def log_error(self, event: str, message: str, extra: Optional[Dict[str, Any]] = None):
        self._log("error", event, message, extra)
