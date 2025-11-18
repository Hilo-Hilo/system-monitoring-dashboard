"""Process management endpoints (authentication required)."""
from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.database import User
from app.auth import get_current_active_user
from app.services.process_manager import process_manager
from app.models.metrics import ProcessListResponse, ProcessInfo

router = APIRouter()


@router.get("/", response_model=ProcessListResponse)
def get_processes(current_user: User = Depends(get_current_active_user)):
    """Get all running processes (requires authentication)."""
    processes = process_manager.get_all_processes()
    return ProcessListResponse(processes=processes, total=len(processes))


@router.post("/{pid}/kill")
def kill_process(pid: int, current_user: User = Depends(get_current_active_user)):
    """Kill a process by PID (requires authentication)."""
    try:
        success = process_manager.kill_process(pid)
        return {"message": f"Process {pid} terminated successfully", "success": success}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{pid}/priority")
def set_priority(
    pid: int, 
    priority: int = Query(..., description="Process priority (-20 to 19)"),
    current_user: User = Depends(get_current_active_user)
):
    """Set process priority (requires authentication)."""
    if not (-20 <= priority <= 19):
        raise HTTPException(status_code=400, detail="Priority must be between -20 and 19")
    
    try:
        success = process_manager.set_process_priority(pid, priority)
        return {"message": f"Priority set for process {pid}", "success": success}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

