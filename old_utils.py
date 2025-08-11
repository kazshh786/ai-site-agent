import sys
import subprocess
from logger import log

def run(cmd, cwd=None):
    """Runs a command and streams its output in real-time."""
    cmd_str = ' '.join(cmd)
    log.info(f"Running command", extra={'command': cmd_str, 'cwd': str(cwd)})
    sys.stdout.flush()
    try:
        process = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1, universal_newlines=True)
        for line in iter(process.stdout.readline, ''):
            log.debug(line.strip(), extra={'source': 'subprocess'})
            sys.stdout.flush()
        process.stdout.close()
        return_code = process.wait()
        if return_code != 0:
            log.error(f"Command failed with exit code {return_code}", extra={'command': cmd_str})
            return False
        return True
    except Exception as e:
        log.error(f"An error occurred while running command", extra={'command': cmd_str, 'error': str(e)})
        return False
