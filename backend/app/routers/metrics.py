"""Real-time metrics endpoints (public)."""
from fastapi import APIRouter
from app.services.system_monitor import system_monitor
from app.models.metrics import SystemMetrics, SystemInfo

router = APIRouter()


@router.get("/system", response_model=SystemInfo)
def get_system_info():
    """Get general system information."""
    return system_monitor.get_system_info()


@router.get("/current", response_model=SystemMetrics)
def get_current_metrics():
    """Get current system metrics (public endpoint)."""
    return system_monitor.get_all_metrics()


@router.get("/cpu")
def get_cpu_metrics():
    """Get CPU metrics only."""
    return system_monitor.get_cpu_metrics()


@router.get("/memory")
def get_memory_metrics():
    """Get memory metrics only."""
    return system_monitor.get_memory_metrics()


@router.get("/disk")
def get_disk_metrics():
    """Get disk metrics only."""
    return system_monitor.get_disk_metrics()


@router.get("/network")
def get_network_metrics():
    """Get network metrics with live rates calculated directly from system."""
    return system_monitor.get_network_metrics()


@router.get("/network/pernic")
def get_network_metrics_pernic():
    """Get per-interface network metrics with rates."""
    return system_monitor.get_network_metrics_pernic()


@router.get("/gpu")
def get_gpu_metrics():
    """Get GPU metrics only."""
    return system_monitor.get_gpu_metrics()

