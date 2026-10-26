#!/usr/bin/env bash
set -euo pipefail

# Install macOS-native dependencies for running requestobot-desktop on the host
# while server/client run in the dev container.

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This script is for macOS host Electron setup only." >&2
  exit 1
fi

echo "Installing host dependencies (darwin)..."
npm install

ELECTRON_DIR="$ROOT/node_modules/electron"
PLATFORM_PATH="Electron.app/Contents/MacOS/Electron"
BINARY="$ELECTRON_DIR/dist/$PLATFORM_PATH"

repair_electron_metadata() {
  if [[ -f "$BINARY" && ! -f "$ELECTRON_DIR/path.txt" ]]; then
    echo "Repairing incomplete Electron install (binary present, path.txt missing)..."
    printf '%s\n' "$PLATFORM_PATH" >"$ELECTRON_DIR/path.txt"
    node -p "require('$ELECTRON_DIR/package.json').version" | sed 's/^/v/' >"$ELECTRON_DIR/dist/version"
  fi
}

repair_electron_metadata

if [[ ! -f "$ELECTRON_DIR/path.txt" ]]; then
  echo "Running Electron postinstall..."
  node "$ELECTRON_DIR/install.js"
  repair_electron_metadata
fi

if [[ ! -f "$BINARY" ]]; then
  echo "Electron binary still missing after install. Try:" >&2
  echo "  rm -rf node_modules/electron && npm install electron --foreground-scripts" >&2
  exit 1
fi

if ! node -e "require('electron')" >/dev/null 2>&1; then
  echo "Electron failed to load. Try:" >&2
  echo "  rm -rf node_modules/electron && npm install electron --foreground-scripts" >&2
  exit 1
fi

echo "Host Electron ready: $(node -e "console.log(require('electron'))")"
echo "Start with: npx nx serve requestobot-desktop"
