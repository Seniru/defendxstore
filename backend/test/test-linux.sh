#!/bin/bash
export NODE_ENV=test

cd ../ai-services

# free port 8000
PORT=8000
PID=$(lsof -t -i:$PORT)
if [ -n "$PID" ]; then
  echo "Killing process on port $PORT (PID $PID)"
  kill -9 $PID
fi

(
  source .venv/bin/activate
  uvicorn main:app --port 8000 2>&1
) &
FASTAPI_PID=$!

cd ../backend

# Wait for port 8000 to be ready
./src/extras/wait-for-it.sh localhost:8000


# Run tests
npm run test

# Kill FastAPI server
kill $FASTAPI_PID
