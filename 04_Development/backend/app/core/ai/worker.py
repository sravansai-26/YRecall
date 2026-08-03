import asyncio
import logging
import traceback
from datetime import datetime
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.ai.queue import fetch_and_lock_next_job, mark_job_completed, mark_job_failed
from app.modules.captures.tasks import process_ai_enrichment_job

logger = logging.getLogger(__name__)

class AIQueueWorker:
    def __init__(self, poll_interval: float = 2.0):
        self.poll_interval = poll_interval
        self.is_running = False
        self._task = None

    async def start(self):
        """Starts the background worker loop."""
        if self.is_running:
            return
            
        self.is_running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info(f"AI Queue Worker started (polling every {self.poll_interval}s)")

    async def stop(self):
        """Stops the background worker loop."""
        self.is_running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("AI Queue Worker stopped.")

    async def _run_loop(self):
        """Continuous polling loop."""
        while self.is_running:
            try:
                # Run the blocking DB call in a thread to not block the asyncio event loop
                job_processed = await asyncio.to_thread(self._process_next_job)
                
                # If we processed a job, check immediately for another one.
                # Otherwise, sleep to avoid thrashing the DB.
                if not job_processed:
                    await asyncio.sleep(self.poll_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in AI Queue Worker loop: {e}")
                logger.error(traceback.format_exc())
                await asyncio.sleep(self.poll_interval)

    def _process_next_job(self) -> bool:
        """
        Fetches the next job and processes it. 
        Returns True if a job was found and processed, False otherwise.
        """
        db: Session = SessionLocal()
        try:
            job = fetch_and_lock_next_job(db)
            if not job:
                return False
                
            start_time = datetime.now()
            logger.info(f"Worker picked up Job {job.id} (Type: {job.job_type}, Capture: {job.capture_id})")
            
            try:
                # Dispatch based on job type
                if job.job_type == "enrichment":
                    provider, model = process_ai_enrichment_job(db, job)
                else:
                    raise ValueError(f"Unknown job type: {job.job_type}")
                
                duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
                mark_job_completed(db, job, provider=provider, model=model, duration_ms=duration_ms)
                
            except Exception as e:
                error_msg = str(e)
                trace = traceback.format_exc()
                logger.error(f"Job {job.id} failed: {error_msg}\n{trace}")
                
                duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
                # Simple check for rate limits (can be improved based on specific exceptions)
                is_rate_limit = "429" in error_msg or "rate limit" in error_msg.lower()
                mark_job_failed(db, job, error_message=trace, is_rate_limit=is_rate_limit, duration_ms=duration_ms)
                
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch/lock job: {e}")
            return False
        finally:
            db.close()

# Singleton instance to be used in FastAPI lifespan
ai_worker = AIQueueWorker()
