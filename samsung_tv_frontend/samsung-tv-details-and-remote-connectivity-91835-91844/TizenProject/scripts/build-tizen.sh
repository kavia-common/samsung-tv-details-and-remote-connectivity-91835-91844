#!/usr/bin/env bash
set -euo pipefail

# Copies the React build into TizenProject/wres so the Tizen wrapper can load it.
# Usage: run this from TizenProject folder: ./scripts/build-tizen.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/../samsung_tv_frontend"
BUILD_DIR="$FRONTEND_DIR/build"
WRES_DIR="$ROOT_DIR/wres"

echo "[build-tizen] ROOT_DIR: $ROOT_DIR"
echo "[build-tizen] FRONTEND_DIR: $FRONTEND_DIR"
echo "[build-tizen] BUILD_DIR: $BUILD_DIR"
echo "[build-tizen] WRES_DIR: $WRES_DIR"

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "Error: Frontend directory not found at $FRONTEND_DIR"
  exit 1
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: React build not found. Run 'npm run build' inside $FRONTEND_DIR first."
  exit 1
fi

mkdir -p "$WRES_DIR"

# Clean wres except .gitkeep
find "$WRES_DIR" -mindepth 1 -not -name ".gitkeep" -exec rm -rf {} +

# Copy build output
cp -a "$BUILD_DIR/." "$WRES_DIR/"

echo "[build-tizen] Copied React build to $WRES_DIR"
echo "[build-tizen] Ensure wres/index.html exists."
