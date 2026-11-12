#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="/tmp/requestobot-dev"
mkdir -p "$LOG_DIR"

echo "Starting requestobot-server (logs: $LOG_DIR/server.log)..."
npx nx serve requestobot-server >"$LOG_DIR/server.log" 2>&1 &
SERVER_PID=$!

echo "Starting requestobot-client (logs: $LOG_DIR/client.log)..."
npx nx serve requestobot-client >"$LOG_DIR/client.log" 2>&1 &
CLIENT_PID=$!

cleanup() {
  echo "Stopping dev servers..."
  kill "$SERVER_PID" "$CLIENT_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

echo "Dev servers running."
echo "  API:    http://localhost:4000 (Swagger: /api)"
echo "  Client: http://localhost:4200"
echo "Press Ctrl+C to stop."

wait
