import os
import multiprocessing

# Bind to 0.0.0.0 on port 8000
bind = "0.0.0.0:8000"

# Set the worker class to Uvicorn for FastAPI
worker_class = "uvicorn.workers.UvicornWorker"

# Define the number of workers.
# Since our AI worker operates concurrently using DB locks, multiple workers are technically safe.
# However, for an initial deployment (and to prevent aggressive polling), 
# we default to 1 worker per container unless overridden by an environment variable.
workers = int(os.environ.get("GUNICORN_WORKERS", 1))

# Prevent worker temp file permission issues in Docker
worker_tmp_dir = "/dev/shm"

# Keep-alive
keepalive = 5

# Timeouts
timeout = 120

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
