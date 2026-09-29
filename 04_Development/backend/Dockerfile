# Use official Python lightweight image
FROM python:3.11-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

# Install build dependencies for psycopg2 and other native extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv

# Install dependencies
COPY requirements.txt .
# Install standard dependencies plus gunicorn
RUN pip install --no-cache-dir -r requirements.txt gunicorn uvicorn[standard]

# ==========================================
# Final Runtime Stage
# ==========================================
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

# Install runtime dependencies for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Set work directory
WORKDIR /app

# Create a non-root user and switch to it
RUN groupadd -r appuser && useradd -r -m -g appuser appuser \
    && chown -R appuser:appuser /app
USER appuser

# Copy application code (make sure .dockerignore excludes secrets)
COPY --chown=appuser:appuser . .

# Expose the port Azure Container Apps will use
EXPOSE 8000

# Start the application using gunicorn
CMD ["gunicorn", "-c", "gunicorn_conf.py", "app.main:app"]
