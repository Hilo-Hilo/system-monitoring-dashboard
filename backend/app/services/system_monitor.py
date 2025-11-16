"""System metrics collection service."""
import psutil
import json
from typing import List, Optional
from app.models.metrics import (
    CPUMetrics, MemoryMetrics, DiskMetrics, NetworkMetrics, GPUMetrics, SystemMetrics
)
from datetime import datetime

try:
    import pynvml
    NVIDIA_AVAILABLE = True
    pynvml.nvmlInit()
except Exception:
    NVIDIA_AVAILABLE = False


class SystemMonitor:
    """System monitoring service."""
    
    def __init__(self):
        self._network_io_prev = psutil.net_io_counters()
    
    def get_cpu_metrics(self) -> CPUMetrics:
        """Get CPU metrics."""
        cpu_percent = psutil.cpu_percent(interval=0.1)
        cpu_count = psutil.cpu_count()
        cpu_freq = psutil.cpu_freq()
        per_cpu = psutil.cpu_percent(percpu=True, interval=0.1)
        
        return CPUMetrics(
            percent=cpu_percent,
            count=cpu_count,
            freq_current=cpu_freq.current if cpu_freq else None,
            per_cpu=per_cpu
        )
    
    def get_memory_metrics(self) -> MemoryMetrics:
        """Get memory metrics."""
        mem = psutil.virtual_memory()
        return MemoryMetrics(
            total=mem.total,
            available=mem.available,
            used=mem.used,
            percent=mem.percent,
            free=mem.free
        )
    
    def get_disk_metrics(self) -> DiskMetrics:
        """Get disk metrics."""
        disk = psutil.disk_usage('/')
        return DiskMetrics(
            total=disk.total,
            used=disk.used,
            free=disk.free,
            percent=(disk.used / disk.total) * 100
        )
    
    def get_network_metrics(self) -> NetworkMetrics:
        """Get network metrics."""
        net_io = psutil.net_io_counters()
        metrics = NetworkMetrics(
            bytes_sent=net_io.bytes_sent,
            bytes_recv=net_io.bytes_recv,
            packets_sent=net_io.packets_sent,
            packets_recv=net_io.packets_recv
        )
        self._network_io_prev = net_io
        return metrics
    
    def get_gpu_metrics(self) -> List[GPUMetrics]:
        """Get NVIDIA GPU metrics."""
        if not NVIDIA_AVAILABLE:
            return []
        
        gpus = []
        try:
            device_count = pynvml.nvmlDeviceGetCount()
            for i in range(device_count):
                handle = pynvml.nvmlDeviceGetHandleByIndex(i)
                name = pynvml.nvmlDeviceGetName(handle).decode('utf-8')
                temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
                util = pynvml.nvmlDeviceGetUtilizationRates(handle)
                mem_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
                
                try:
                    power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0  # Convert to watts
                except:
                    power = None
                
                gpus.append(GPUMetrics(
                    index=i,
                    name=name,
                    temperature=temp,
                    utilization=util.gpu,
                    memory_used=mem_info.used,
                    memory_total=mem_info.total,
                    memory_percent=(mem_info.used / mem_info.total) * 100,
                    power_draw=power
                ))
        except Exception as e:
            print(f"Error getting GPU metrics: {e}")
        
        return gpus
    
    def get_all_metrics(self) -> SystemMetrics:
        """Get all system metrics."""
        return SystemMetrics(
            timestamp=datetime.now(),
            cpu=self.get_cpu_metrics(),
            memory=self.get_memory_metrics(),
            disk=self.get_disk_metrics(),
            network=self.get_network_metrics(),
            gpus=self.get_gpu_metrics()
        )


# Global instance
system_monitor = SystemMonitor()

