#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="${1:?workspace folder required}"
ROOT_ENV="$WORKSPACE/.env"
DEVCONTAINER_ENV="$WORKSPACE/.devcontainer/.env"

if [[ ! -f "$ROOT_ENV" ]]; then
  echo "Missing .env at repo root. Copy .env.dist to .env and fill in values." >&2
  exit 1
fi

ln -sf "$ROOT_ENV" "$DEVCONTAINER_ENV"
