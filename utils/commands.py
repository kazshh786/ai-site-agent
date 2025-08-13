# utils/commands.py
import subprocess
import shlex
import logging
import time
import threading
from pathlib import Path
from typing import Iterable, Tuple, Optional, Union, List, Dict, Set
from queue import Queue, Empty
from dataclasses import dataclass
from logger import get_logger

log = get_logger(__name__)

@dataclass
class CommandResult:
    """Structured result from command execution."""
    success: bool
    return_code: int
    stdout: str
    stderr: str
    combined_output: str
    execution_time: float
    command: str

class ProgressTracker:
    """Track and log progress indicators."""

    def __init__(self):
        self.patterns = {
            'npm_install': {
                'indicators': ['Installing dependencies:', 'Progress:', 'Done in'],
                'success_markers': ['Done in', 'Success!'],
                'error_markers': ['ERR!', 'ERROR', 'FAILED']
            },
            'build': {
                'indicators': ['Building', 'Compiled', 'Generated'],
                'success_markers': ['Compiled successfully', 'Build completed'],
                'error_markers': ['Build failed', 'ERROR', 'FAILED']
            },
            'deployment': {
                'indicators': ['Deploying', 'Uploading', 'Syncing'],
                'success_markers': ['Deployment complete', 'Successfully deployed'],
                'error_markers': ['Deployment failed', 'ERROR', 'FAILED']
            }
        }

    def detect_command_type(self, command: str) -> str:
        """Detect command type for contextual logging."""
        if any(x in command.lower() for x in ['pnpm', 'npm', 'yarn', 'install']):
            return 'npm_install'
        elif any(x in command.lower() for x in ['build', 'compile']):
            return 'build'
        elif any(x in command.lower() for x in ['deploy', 'rsync', 'ssh']):
            return 'deployment'
        return 'generic'

    def analyze_line(self, line: str, command_type: str) -> Dict[str, any]:
        """Analyze a log line for progress indicators."""
        result = {
            'is_progress': False,
            'is_success': False,
            'is_error': False,
            'log_level': logging.INFO,
            'category': 'output'
        }

        if command_type in self.patterns:
            patterns = self.patterns[command_type]

            if any(pattern in line for pattern in patterns['success_markers']):
                result.update({
                    'is_success': True,
                    'log_level': logging.INFO,
                    'category': 'success'
                })
            elif any(pattern in line for pattern in patterns['error_markers']):
                result.update({
                    'is_error': True,
                    'log_level': logging.ERROR,
                    'category': 'error'
                })
            elif any(pattern in line for pattern in patterns['indicators']):
                result.update({
                    'is_progress': True,
                    'log_level': logging.INFO,
                    'category': 'progress'
                })
        
        return result

def run(
    command: Union[str, Iterable[str]],
    cwd: Optional[Path] = None,
    env: Optional[Dict[str, str]] = None,
    timeout: Optional[int] = None,
    log_progress: bool = True,
    suppress_output: bool = False,
    success_indicators: Optional[List[str]] = None,
    error_indicators: Optional[List[str]] = None,
) -> CommandResult:
    """
    Execute a shell command with enhanced logging and progress tracking.

    Args:
        command: The command to run as a string or list of arguments.
        cwd: The working directory for the command.
        env: A dictionary of environment variables.
        timeout: The timeout in seconds for the command.
        log_progress: Whether to log progress indicators.
        suppress_output: Whether to suppress verbose output logging.
        success_indicators: Custom patterns that indicate success.
        error_indicators: Custom patterns that indicate errors.

    Returns:
        CommandResult object with detailed execution information.
    """
    start_time = time.time()

    if isinstance(command, (list, tuple)):
        cmd_list = list(command)
        cmd_str = " ".join(shlex.quote(p) for p in cmd_list)
    else:
        cmd_str = command
        cmd_list = shlex.split(command)

    # Initialize progress tracker
    progress_tracker = ProgressTracker()
    command_type = progress_tracker.detect_command_type(cmd_str)

    # Enhanced command start logging
    log.info(
        f"🚀 Starting command execution",
        extra={
            "command": cmd_str,
            "command_type": command_type,
            "cwd": str(cwd) if cwd else None,
            "timeout": timeout
        },
    )

    try:
        process = subprocess.Popen(
            cmd_list,
            cwd=str(cwd) if cwd else None,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            env=env,
        )

        stdout_lines: List[str] = []
        stderr_lines: List[str] = []

        # Enhanced real-time logging with progress tracking
        def log_output_stream(stream, stream_name: str, lines_list: List[str]):
            """Enhanced stream logging with progress analysis."""
            for line in stream:
                clean_line = line.rstrip("\n")
                if not clean_line.strip():
                    continue
                
                lines_list.append(clean_line)

                # Skip logging if suppressed and not important
                if suppress_output:
                    analysis = progress_tracker.analyze_line(clean_line, command_type)
                    if not (analysis['is_progress'] or analysis['is_success'] or analysis['is_error']):
                        continue
                
                # Analyze line for better categorization
                analysis = progress_tracker.analyze_line(clean_line, command_type)

                # Add emoji indicators for better visual scanning
                prefix = ""
                if analysis['is_success']:
                    prefix = "✅ "
                elif analysis['is_error']:
                    prefix = "❌ "
                elif analysis['is_progress']:
                    prefix = "⏳ "
                elif stream_name == "stderr":
                    prefix = "⚠️  "

                log.log(
                    analysis['log_level'],
                    f"{prefix}{clean_line}",
                    extra={
                        "source": stream_name,
                        "command_type": command_type,
                        "category": analysis['category']
                    }
                )

        # Process streams concurrently
        assert process.stdout is not None
        assert process.stderr is not None

        stdout_thread = threading.Thread(
            target=log_output_stream,
            args=(process.stdout, "stdout", stdout_lines)
        )
        stderr_thread = threading.Thread(
            target=log_output_stream,
            args=(process.stderr, "stderr", stderr_lines)
        )

        stdout_thread.start()
        stderr_thread.start()

        # Wait for process completion
        return_code = process.wait(timeout=timeout)

        # Wait for logging threads to complete
        stdout_thread.join()
        stderr_thread.join()

        execution_time = time.time() - start_time
        is_success = return_code == 0

        # Enhanced completion logging
        status_emoji = "✅" if is_success else "❌"
        log.log(
            logging.INFO if is_success else logging.ERROR,
            f"{status_emoji} Command completed in {execution_time:.2f}s",
            extra={
                "command": cmd_str,
                "return_code": return_code,
                "execution_time": execution_time,
                "success": is_success,
                "command_type": command_type,
                "stdout_lines": len(stdout_lines),
                "stderr_lines": len(stderr_lines)
            },
        )

        # Log summary for failed commands
        if not is_success:
            log.error(
                f"💥 Command failed: {cmd_str}",
                extra={
                    "return_code": return_code,
                    "execution_time": execution_time,
                    "last_stdout": stdout_lines[-3:] if stdout_lines else [],
                    "last_stderr": stderr_lines[-3:] if stderr_lines else []
                }
            )

        return CommandResult(
            success=is_success,
            return_code=return_code,
            stdout="\n".join(stdout_lines),
            stderr="\n".join(stderr_lines),
            combined_output="\n".join(stdout_lines + stderr_lines),
            execution_time=execution_time,
            command=cmd_str
        )

    except subprocess.TimeoutExpired:
        if 'process' in locals() and process:
            process.kill()
        execution_time = time.time() - start_time
        log.error(
            f"⏰ Command timed out after {timeout}s",
            extra={
                "command": cmd_str,
                "timeout": timeout,
                "execution_time": execution_time,
            },
        )
        return CommandResult(
            success=False,
            return_code=-1,
            stdout="",
            stderr=f"Command timed out after {timeout}s",
            combined_output="",
            execution_time=execution_time,
            command=cmd_str
        )
    except Exception as e:
        execution_time = time.time() - start_time
        log.exception(
            f"💥 Command execution failed: {str(e)}",
            extra={
                "command": cmd_str,
                "execution_time": execution_time,
                "error": str(e)
            },
        )
        return CommandResult(
            success=False,
            return_code=-1,
            stdout="",
            stderr=str(e),
            combined_output="",
            execution_time=execution_time,
            command=cmd_str
        )

# Convenience functions for common operations
def run_npm_command(
    command: Union[str, List[str]],
    cwd: Optional[Path] = None,
    **kwargs) -> CommandResult:
    """Run npm/pnpm commands with optimized logging."""
    return run(
        command,
        cwd=cwd,
        suppress_output=True,  # Suppress verbose npm output
        **kwargs
    )

def run_build_command(
    command: Union[str, List[str]],
    cwd: Optional[Path] = None,
    **kwargs) -> CommandResult:
    """Run build commands with detailed progress tracking."""
    return run(
        command,
        cwd=cwd,
        log_progress=True,
        **kwargs
    )

def run_deployment_command(
    command: Union[str, List[str]],
    cwd: Optional[Path] = None,
    **kwargs) -> CommandResult:
    """Run deployment commands with enhanced error reporting."""
    return run(
        command,
        cwd=cwd,
        log_progress=True,
        **kwargs
    )
