#!/bin/bash
export NODE_ENV=test

cd ../ai-services
source .venv/bin/activate

# Start FastAPI in background and capture PID
uvicorn main:app --port 8000 > /dev/null 2>&1 &
FASTAPI_PID=$!
cd ../backend

# Wait for port 8000
while ! nc -z localhost 8000; do
  sleep 0.5
done

# Run tests
npm run test:only

# Kill FastAPI server
kill $FASTAPI_PID
