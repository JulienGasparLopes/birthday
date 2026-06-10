#!/bin/bash
# Production server — gunicorn on port 5000
# Usage: ./backend/start.sh [workers]
# Default: 4 workers (adjust to 2× CPU cores)

WORKERS=${1:-4}

uv run gunicorn \
  --bind 0.0.0.0:5001 \
  --workers "$WORKERS" \
  --worker-class sync \
  --timeout 60 \
  --access-logfile - \
  --error-logfile - \
  "backend.main:app"
