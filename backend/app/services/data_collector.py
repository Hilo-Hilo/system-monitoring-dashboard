"""Background data collection service."""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.database import MetricSnapshot
from app.services.system_monitor import system_monitor
import json
import logging

logger = logging.getLogger(__name__)


class DataCollector:
    """Background service for collecting and storing metrics."""
    
    def collect_and_store(self):
        """Collect current metrics and store in database."""
        try:
            metrics = system_monitor.get_all_metrics()
            db = SessionLocal()
            try:
                # Prepare GPU data as JSON
                gpu_data = [gpu.dict() for gpu in metrics.gpus]
                
                snapshot = MetricSnapshot(
                    timestamp=metrics.timestamp,
                    cpu_percent=metrics.cpu.percent,
                    cpu_count=metrics.cpu.count,
                    cpu_freq_current=metrics.cpu.freq_current,
                    memory_total=metrics.memory.total,
                    memory_available=metrics.memory.available,
                    memory_percent=metrics.memory.percent,
                    memory_used=metrics.memory.used,
                    disk_total=metrics.disk.total,
                    disk_used=metrics.disk.used,
                    disk_free=metrics.disk.free,
                    disk_percent=metrics.disk.percent,
                    network_bytes_sent=metrics.network.bytes_sent,
                    network_bytes_recv=metrics.network.bytes_recv,
                    network_packets_sent=metrics.network.packets_sent,
                    network_packets_recv=metrics.network.packets_recv,
                    gpu_data=json.dumps(gpu_data)
                )
                db.add(snapshot)
                db.commit()
            finally:
                db.close()
        except Exception as e:
            logger.error(f"Error collecting metrics: {e}")
    
    def cleanup_old_data(self, retention_days: int = 30):
        """Remove metrics older than retention period."""
        try:
            db = SessionLocal()
            try:
                cutoff_date = datetime.utcnow() - timedelta(days=retention_days)
                db.query(MetricSnapshot).filter(
                    MetricSnapshot.timestamp < cutoff_date
                ).delete()
                db.commit()
            finally:
                db.close()
        except Exception as e:
            logger.error(f"Error cleaning up old data: {e}")


# Global instance
data_collector = DataCollector()

