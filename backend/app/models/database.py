"""SQLAlchemy database models."""
from sqlalchemy import Column, Integer, Float, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    """User model for authentication."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MetricSnapshot(Base):
    """Historical metric snapshots."""
    __tablename__ = "metric_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # CPU Metrics
    cpu_percent = Column(Float)
    cpu_count = Column(Integer)
    cpu_freq_current = Column(Float)
    
    # Memory Metrics
    memory_total = Column(Float)
    memory_available = Column(Float)
    memory_percent = Column(Float)
    memory_used = Column(Float)
    
    # Disk Metrics
    disk_total = Column(Float)
    disk_used = Column(Float)
    disk_free = Column(Float)
    disk_percent = Column(Float)
    
    # Network Metrics
    network_bytes_sent = Column(Float)
    network_bytes_recv = Column(Float)
    network_packets_sent = Column(Float)
    network_packets_recv = Column(Float)
    
    # GPU Metrics (JSON string for multiple GPUs)
    gpu_data = Column(Text)  # JSON string


class ProcessHistory(Base):
    """Process execution history."""
    __tablename__ = "process_history"
    
    id = Column(Integer, primary_key=True, index=True)
    pid = Column(Integer, index=True)
    name = Column(String, index=True)
    username = Column(String)
    cpu_percent = Column(Float)
    memory_percent = Column(Float)
    status = Column(String)
    started_at = Column(DateTime(timezone=True))
    ended_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

