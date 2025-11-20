#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "[Error] Node.js is not installed. Please install Node >=18.17.0." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[Error] npm is not installed. Install it before continuing." >&2
  exit 1
fi

if [ ! -f .env.local ] && [ -f .env.example ]; then
  cp .env.example .env.local
  echo "[Info] Created .env.local from .env.example. Update it with your keys."
fi

if [ ! -d node_modules ]; then
  echo "[Info] Installing dependencies with npm install..."
else
  echo "[Info] node_modules already exists. Running npm install to ensure sync..."
fi

npm install

echo "[Done] Local setup complete. Start the dev server with: npm run dev"
echo "        App available at http://localhost:3000 after the server starts."
