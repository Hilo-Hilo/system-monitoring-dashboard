"""Process management service."""
import psutil
from typing import List, Optional
from app.models.metrics import ProcessInfo


class ProcessManager:
    """Process management service."""
    
    def get_all_processes(self) -> List[ProcessInfo]:
        """Get all running processes."""
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 
                                         'memory_percent', 'status', 'create_time']):
            try:
                pinfo = proc.info
                processes.append(ProcessInfo(
                    pid=pinfo['pid'],
                    name=pinfo['name'] or 'unknown',
                    username=pinfo['username'] or 'unknown',
                    cpu_percent=pinfo['cpu_percent'] or 0.0,
                    memory_percent=pinfo['memory_percent'] or 0.0,
                    status=pinfo['status'] or 'unknown',
                    created=pinfo['create_time']
                ))
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        
        # Sort by CPU usage descending
        processes.sort(key=lambda x: x.cpu_percent, reverse=True)
        return processes
    
    def kill_process(self, pid: int) -> bool:
        """Kill a process by PID."""
        try:
            proc = psutil.Process(pid)
            proc.terminate()
            return True
        except (psutil.NoSuchProcess, psutil.AccessDenied) as e:
            raise Exception(f"Cannot kill process {pid}: {str(e)}")
    
    def set_process_priority(self, pid: int, priority: int) -> bool:
        """Set process priority (Windows: -20 to 19, Linux: -20 to 19)."""
        try:
            proc = psutil.Process(pid)
            proc.nice(priority)
            return True
        except (psutil.NoSuchProcess, psutil.AccessDenied) as e:
            raise Exception(f"Cannot set priority for process {pid}: {str(e)}")


# Global instance
process_manager = ProcessManager()

