import logging
import json
import traceback
from uuid import UUID
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text, func, and_, or_

from app.core.database import SessionLocal
from app.modules.ai.models import AIJob

logger = logging.getLogger(__name__)

class JobStatus:
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    RETRYING = "RETRYING"
    WAITING_RATE_LIMIT = "WAITING_RATE_LIMIT"
    FAILED = "FAILED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

def enqueue_job(db: Session, capture_id: UUID, job_type: str, max_attempts: int = 3) -> AIJob:
    """
    Enqueues a new AI job for processing.
    """
    job = AIJob(
        capture_id=capture_id,
        job_type=job_type,
        status=JobStatus.QUEUED,
        max_attempts=max_attempts
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    logger.info(f"Enqueued AI Job {job.id} of type {job_type} for capture {capture_id}")
    return job

def fetch_and_lock_next_job(db: Session) -> Optional[AIJob]:
    """
    Fetches the next available job using SELECT ... FOR UPDATE SKIP LOCKED.
    This guarantees that concurrent workers will not grab the same job.
    """
    now = datetime.now(timezone.utc)
    
    # We look for QUEUED jobs, or RETRYING/WAITING_RATE_LIMIT jobs where next_retry_at is in the past
    sql = text("""
        SELECT id FROM ai_jobs 
        WHERE status = 'QUEUED' 
           OR (status IN ('RETRYING', 'WAITING_RATE_LIMIT') AND next_retry_at <= :now)
        ORDER BY created_at ASC 
        FOR UPDATE SKIP LOCKED 
        LIMIT 1
    """)
    
    result = db.execute(sql, {"now": now}).fetchone()
    
    if not result:
        return None
        
    job_id = result[0]
    
    job = db.query(AIJob).filter(AIJob.id == job_id).first()
    if job:
        job.status = JobStatus.RUNNING
        job.attempt_count += 1
        db.commit()
        db.refresh(job)
        return job
        
    return None

def mark_job_completed(db: Session, job: AIJob, provider: str = None, model: str = None, duration_ms: int = None):
    """
    Marks a job as successfully completed.
    """
    job.status = JobStatus.COMPLETED
    if provider:
        job.provider_used = provider
    if model:
        job.model_used = model
    if duration_ms is not None:
        job.execution_duration_ms = duration_ms
        
    db.commit()
    logger.info(f"Job {job.id} COMPLETED.")

def mark_job_failed(db: Session, job: AIJob, error_message: str, is_rate_limit: bool = False, duration_ms: int = None):
    """
    Marks a job as failed and schedules a retry if attempts remain.
    If it's a rate limit, uses a specific state and backoff.
    """
    if duration_ms is not None:
        job.execution_duration_ms = duration_ms
        
    job.error_detail = error_message
    
    if job.attempt_count >= job.max_attempts:
        job.status = JobStatus.FAILED
        logger.error(f"Job {job.id} FAILED permanently after {job.attempt_count} attempts. Error: {error_message}")
    else:
        # Calculate exponential backoff
        if is_rate_limit:
            job.status = JobStatus.WAITING_RATE_LIMIT
            # Backoff for rate limit: 60s, then 120s, etc.
            backoff_seconds = 60 * job.attempt_count
        else:
            job.status = JobStatus.RETRYING
            # Standard exponential backoff: 2^attempt * 5 seconds (10s, 20s, 40s...)
            backoff_seconds = (2 ** job.attempt_count) * 5
            
        job.next_retry_at = datetime.now(timezone.utc) + timedelta(seconds=backoff_seconds)
        logger.warning(f"Job {job.id} failed (attempt {job.attempt_count}/{job.max_attempts}). Retrying in {backoff_seconds}s. Error: {error_message}")
        
    db.commit()
