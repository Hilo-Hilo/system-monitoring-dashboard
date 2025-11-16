"""Historical data endpoints (authentication required)."""
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db
from app.models.database import User, MetricSnapshot
from app.auth import get_current_active_user
from app.models.metrics import HistoricalMetricsRequest, HistoricalMetricsResponse
import json

router = APIRouter()


@router.get("/metrics", response_model=HistoricalMetricsResponse)
async def get_historical_metrics(
    start_time: datetime = Query(...),
    end_time: datetime = Query(...),
    metric_type: str = Query(None),
    limit: int = Query(1000, le=10000),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get historical metrics (requires authentication)."""
    query = db.query(MetricSnapshot).filter(
        and_(
            MetricSnapshot.timestamp >= start_time,
            MetricSnapshot.timestamp <= end_time
        )
    ).order_by(MetricSnapshot.timestamp.desc()).limit(limit)
    
    snapshots = query.all()
    
    metrics = []
    for snapshot in snapshots:
        metric_data = {
            "timestamp": snapshot.timestamp.isoformat(),
            "cpu": {
                "percent": snapshot.cpu_percent,
                "count": snapshot.cpu_count,
                "freq_current": snapshot.cpu_freq_current
            },
            "memory": {
                "total": snapshot.memory_total,
                "available": snapshot.memory_available,
                "used": snapshot.memory_used,
                "percent": snapshot.memory_percent
            },
            "disk": {
                "total": snapshot.disk_total,
                "used": snapshot.disk_used,
                "free": snapshot.disk_free,
                "percent": snapshot.disk_percent
            },
            "network": {
                "bytes_sent": snapshot.network_bytes_sent,
                "bytes_recv": snapshot.network_bytes_recv,
                "packets_sent": snapshot.network_packets_sent,
                "packets_recv": snapshot.network_packets_recv
            }
        }
        
        if snapshot.gpu_data:
            try:
                metric_data["gpu"] = json.loads(snapshot.gpu_data)
            except:
                metric_data["gpu"] = []
        
        # Filter by metric type if specified
        if metric_type:
            if metric_type in metric_data:
                metric_data = {metric_type: metric_data[metric_type], "timestamp": metric_data["timestamp"]}
            else:
                continue
        
        metrics.append(metric_data)
    
    return HistoricalMetricsResponse(metrics=metrics, count=len(metrics))


@router.get("/processes")
async def get_process_history(
    start_time: datetime = Query(...),
    end_time: datetime = Query(...),
    limit: int = Query(1000, le=10000),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get process execution history (requires authentication)."""
    from app.models.database import ProcessHistory
    
    query = db.query(ProcessHistory).filter(
        and_(
            ProcessHistory.created_at >= start_time,
            ProcessHistory.created_at <= end_time
        )
    ).order_by(ProcessHistory.created_at.desc()).limit(limit)
    
    processes = query.all()
    
    return {
        "processes": [
            {
                "id": p.id,
                "pid": p.pid,
                "name": p.name,
                "username": p.username,
                "cpu_percent": p.cpu_percent,
                "memory_percent": p.memory_percent,
                "status": p.status,
                "started_at": p.started_at.isoformat() if p.started_at else None,
                "ended_at": p.ended_at.isoformat() if p.ended_at else None,
                "created_at": p.created_at.isoformat()
            }
            for p in processes
        ],
        "count": len(processes)
    }

