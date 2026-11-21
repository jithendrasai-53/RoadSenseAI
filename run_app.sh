#!/bin/bash
# ROAD SENSE AI — One-Click Development Startup Script

set -e

echo "=========================================================="
echo "      ROAD SENSE AI — Pavement Damage Detection Engine    "
echo "           Detect. Analyze. Prioritize. Repair.           "
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Check Python
if [ -d "$BACKEND_DIR/venv" ]; then
    PYTHON_EXEC="$BACKEND_DIR/venv/bin/python"
    UVICORN_EXEC="$BACKEND_DIR/venv/bin/uvicorn"
else
    echo "[!] Backend virtual environment not found. Creating..."
    python3.12 -m venv "$BACKEND_DIR/venv" || python3 -m venv "$BACKEND_DIR/venv"
    "$BACKEND_DIR/venv/bin/pip" install --upgrade pip
    "$BACKEND_DIR/venv/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
    PYTHON_EXEC="$BACKEND_DIR/venv/bin/python"
    UVICORN_EXEC="$BACKEND_DIR/venv/bin/uvicorn"
fi

# Ensure samples exist
if [ ! -f "$BACKEND_DIR/static/samples/sample_d40_pothole.jpg" ]; then
    echo "[*] Generating benchmark road damage sample images..."
    cd "$BACKEND_DIR" && "$PYTHON_EXEC" generate_samples.py
fi

# Check frontend node_modules
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "[*] Installing frontend dependencies..."
    cd "$FRONTEND_DIR" && npm install
fi

echo ""
echo "[*] Starting FastAPI Backend on http://127.0.0.1:8000..."
cd "$BACKEND_DIR"
"$UVICORN_EXEC" app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "[*] Starting Vite Frontend on http://localhost:5173..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

trap "echo ''; echo '[*] Shutting down Road Sense AI...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

echo ""
echo "=========================================================="
echo "  ROAD SENSE AI IS NOW RUNNING!"
echo "  Frontend URL: http://localhost:5173"
echo "  Backend API:  http://127.0.0.1:8000"
echo "  API Docs:     http://127.0.0.1:8000/docs"
echo "  Press CTRL+C to stop all services."
echo "=========================================================="

wait
