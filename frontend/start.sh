#!/bin/bash
# Production server — builds and starts Next.js on port 3000
# Usage: ./frontend/start.sh [port]
# Default port: 3000

PORT=${1:-3000}

cd "$(dirname "$0")"

echo "→ Building Next.js..."
npm run build

echo "→ Starting production server on port $PORT..."
npm run start -- --port "$PORT"
