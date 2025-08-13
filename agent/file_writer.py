import os
import time
from pathlib import Path
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from contextlib import contextmanager
from logger import get_logger, start_span, finish_span

log = get_logger(__name__)

@dataclass
class FileWriteResult:
    """Structured result from file write operations."""
    success: bool
    file_path: Path
    relative_path: str
    size_bytes: int
    lines_written: int
    execution_time: float
    error: Optional[str] = None
    file_type: Optional[str] = None

class FileWriteStats:
    """Track file writing statistics."""
    
    def __init__(self):
        self.files_written = 0
        self.total_bytes = 0
        self.total_lines = 0
        self.file_types: Dict[str, int] = {}
        self.directories_created: set = set()
        self.start_time = time.time()
    
    def add_file(self, result: FileWriteResult):
        """Add a file write result to statistics."""
        if result.success:
            self.files_written += 1
            self.total_bytes += result.size_bytes
            self.total_lines += result.lines_written
            
            if result.file_type:
                self.file_types[result.file_type] = self.file_types.get(result.file_type, 0) + 1
    
    def log_summary(self):
        """Log a summary of file writing operations."""
        duration = time.time() - self.start_time
        
        log.info(
            f"📁 File writing summary: {self.files_written} files, "
            f"{self.total_bytes:,} bytes, {self.total_lines:,} lines in {duration:.2f}s",
            extra={
                "files_written": self.files_written,
                "total_bytes": self.total_bytes,
                "total_lines": self.total_lines,
                "duration": duration,
                "file_types": dict(self.file_types),
                "directories_created": len(self.directories_created)
            }
        )

class FileWriter:
    """
    Handles the writing of raw code content to files for the website project.
    Enhanced with comprehensive logging, security checks, and statistics tracking.
    """
    
    def __init__(self, base_dir="."):
        self.base_dir = Path(base_dir).resolve()
        self.stats = FileWriteStats()
        
        if not self.base_dir.exists():
            log.warning(
                f"⚠️  Base directory does not exist, will be created: {self.base_dir}",
                extra={"base_dir": str(self.base_dir)}
            )
        
        log.info(
            f"📝 FileWriter initialized",
            extra={
                "base_dir": str(self.base_dir),
                "base_dir_exists": self.base_dir.exists()
            }
        )

    @contextmanager
    def _span(self, operation_name: str, **tags):
        """Context manager for automatic span lifecycle"""
        start_span(operation_name, **tags)
        try:
            yield
            finish_span(success=True)
        except Exception as e:
            finish_span(success=False, error=str(e))
            raise
    
    def _get_file_type(self, file_path: Path) -> str:
        """Determine file type from extension."""
        suffix = file_path.suffix.lower()
        type_mapping = {
            '.js': 'javascript', '.jsx': 'react', '.ts': 'typescript',
            '.tsx': 'react-typescript', '.py': 'python', '.html': 'html',
            '.css': 'css', '.scss': 'sass', '.json': 'json', '.md': 'markdown',
            '.yml': 'yaml', '.yaml': 'yaml', '.txt': 'text', '.env': 'environment',
            '': 'no-extension'
        }
        return type_mapping.get(suffix, 'other')
    
    def _validate_path_security(self, file_path: Path) -> tuple[bool, str]:
        """
        Enhanced security validation for file paths.
        """
        try:
            abs_path = file_path.resolve()
            
            # This is the primary security check. It raises a ValueError if
            # the path is outside the allowed base directory (e.g., using '..').
            abs_path.relative_to(self.base_dir)
            
            path_str = str(abs_path)
            
            # CORRECTED: The check for '..' was too broad and caused a false positive
            # on Next.js dynamic routes like '[...slug]'. The relative_to() check above
            # already prevents directory traversal. We will only check for other shell characters.
            dangerous_components = ['~', '$']
            if any(comp in path_str for comp in dangerous_components):
                return False, f"Path contains dangerous components: {path_str}"
            
            system_dirs = ['/etc', '/sys', '/proc', '/dev', '/root']
            if any(path_str.startswith(sys_dir) for sys_dir in system_dirs):
                return False, f"Attempted to write to system directory: {path_str}"
            
            return True, ""
            
        except ValueError as e:
            return False, f"Path outside project directory: {str(e)}"
        except Exception as e:
            return False, f"Path validation error: {str(e)}"
    
    def _log_file_details(self, file_path: Path, content: str, operation: str = "write"):
        """Log detailed file information."""
        file_size = len(content.encode('utf-8'))
        line_count = content.count('\n') + (1 if content and not content.endswith('\n') else 0)
        file_type = self._get_file_type(file_path)
        
        type_emojis = {
            'javascript': '🟨', 'react': '⚛️', 'typescript': '🔷',
            'react-typescript': '⚛️🔷', 'python': '🐍', 'html': '🌐',
            'css': '🎨', 'json': '📋', 'markdown': '📝', 'yaml': '⚙️',
            'environment': '🔐'
        }
        emoji = type_emojis.get(file_type, '📄')
        
        relative_path = file_path.relative_to(self.base_dir)
        
        log.info(
            f"{emoji} {operation.title()} {file_type} file: {relative_path} "
            f"({file_size:,} bytes, {line_count} lines)",
            extra={
                "operation": operation, "file_path": str(file_path),
                "relative_path": str(relative_path), "file_type": file_type,
                "size_bytes": file_size, "line_count": line_count
            }
        )
    
    def write_file(self, file_path: Path, content: str, overwrite: bool = True) -> FileWriteResult:
        """
        Enhanced file writing with comprehensive logging and error handling.
        """
        with self._span("write_file", file_path=str(file_path), overwrite=overwrite):
            start_time = time.time()
            file_type = self._get_file_type(file_path)
            
            try:
                is_valid, error_msg = self._validate_path_security(file_path)
                if not is_valid:
                    log.error(
                        f"🚨 SECURITY VIOLATION: {error_msg}",
                        extra={
                            "file_path": str(file_path), "security_error": error_msg
                        }
                    )
                    return FileWriteResult(
                        success=False, file_path=file_path, relative_path=str(file_path),
                        size_bytes=0, lines_written=0, execution_time=time.time() - start_time,
                        error=f"Security violation: {error_msg}", file_type=file_type
                    )

                abs_path = file_path.resolve()
                relative_path = abs_path.relative_to(self.base_dir)

                if abs_path.exists() and not overwrite:
                    log.warning(
                        f"⚠️  File exists, skipping: {relative_path}",
                        extra={
                            "file_path": str(abs_path), "relative_path": str(relative_path)
                        }
                    )
                    return FileWriteResult(
                        success=False, file_path=abs_path, relative_path=str(relative_path),
                        size_bytes=0, lines_written=0, execution_time=time.time() - start_time,
                        error="File exists and overwrite=False", file_type=file_type
                    )

                if not abs_path.parent.exists():
                    abs_path.parent.mkdir(parents=True, exist_ok=True)
                    self.stats.directories_created.add(str(abs_path.parent))
                    log.info(
                        f"📁 Created directory: {abs_path.parent.relative_to(self.base_dir)}",
                        extra={"directory": str(abs_path.parent)}
                    )

                abs_path.write_text(content, encoding='utf-8')

                size_bytes = len(content.encode('utf-8'))
                lines_written = content.count('\n') + (1 if content and not content.endswith('\n') else 0)
                execution_time = time.time() - start_time

                self._log_file_details(abs_path, content, "wrote")

                result = FileWriteResult(
                    success=True, file_path=abs_path, relative_path=str(relative_path),
                    size_bytes=size_bytes, lines_written=lines_written,
                    execution_time=execution_time, file_type=file_type
                )

                self.stats.add_file(result)
                return result

            except PermissionError as e:
                error_msg = f"Permission denied writing to {file_path}: {str(e)}"
                log.error(
                    f"🔒 Permission denied: {file_path}",
                    extra={"file_path": str(file_path), "error": str(e)}
                )
                raise e

            except OSError as e:
                error_msg = f"OS error writing to {file_path}: {str(e)}"
                log.error(
                    f"💾 OS error writing file: {file_path}",
                    extra={"file_path": str(file_path), "error": str(e), "error_type": "OSError"}
                )
                raise e

            except Exception as e:
                error_msg = f"Unexpected error writing to {file_path}: {str(e)}"
                log.exception(
                    f"💥 Unexpected error writing file: {file_path}",
                    extra={"file_path": str(file_path), "error": str(e), "error_type": type(e).__name__}
                )
                raise e
    
    def write_files_batch(self, files: Dict[Path, str], overwrite: bool = True) -> List[FileWriteResult]:
        """
        Write multiple files in batch with progress tracking.
        """
        with self._span("write_files_batch", file_count=len(files), overwrite=overwrite):
            log.info(
                f"📦 Starting batch file write: {len(files)} files",
                extra={"file_count": len(files)}
            )
            
            results = []
            successful = 0
            failed = 0
            
            for i, (file_path, content) in enumerate(files.items(), 1):
                log.info(
                    f"⏳ Writing file {i}/{len(files)}: {file_path.name}",
                    extra={"progress": f"{i}/{len(files)}", "file_name": file_path.name}
                )

                result = self.write_file(file_path, content, overwrite)
                results.append(result)

                if result.success:
                    successful += 1
                else:
                    failed += 1

            log.info(
                f"✅ Batch write complete: {successful} successful, {failed} failed",
                extra={"total_files": len(files), "successful": successful, "failed": failed}
            )

            return results
    
    def get_stats_summary(self) -> Dict[str, Any]:
        """Get current statistics summary."""
        duration = time.time() - self.stats.start_time
        return {
            "files_written": self.stats.files_written, "total_bytes": self.stats.total_bytes,
            "total_lines": self.stats.total_lines, "file_types": dict(self.stats.file_types),
            "directories_created": len(self.stats.directories_created), "duration": duration
        }
    
    def log_final_summary(self):
        """Log final statistics summary."""
        self.stats.log_summary()
