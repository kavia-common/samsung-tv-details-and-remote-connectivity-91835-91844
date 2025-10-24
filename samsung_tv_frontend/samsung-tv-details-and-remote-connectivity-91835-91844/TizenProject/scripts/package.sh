#!/usr/bin/env bash
set -euo pipefail

# Packages the Tizen Web App into a .wgt using Tizen CLI, if installed and configured.
# Requires a configured certificate profile (e.g., 'tizen certificate -a MyCert ...' and 'tizen security-profiles add ...')

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
PROJECT_NAME="MyTV"
WGT_NAME="${PROJECT_NAME}-$(date +%Y%m%d%H%M%S).wgt"

echo "[package] ROOT_DIR: $ROOT_DIR"
echo "[package] DIST_DIR: $DIST_DIR"

if ! command -v tizen >/dev/null 2>&1; then
  echo "Error: 'tizen' CLI not found in PATH. Install Tizen Studio CLI tools and add to PATH."
  exit 1
fi

mkdir -p "$DIST_DIR"

pushd "$ROOT_DIR" >/dev/null

# Build web project (web is packaged from current folder content)
# If you have a specific profile, you can pass: --profile <profilename>
set +e
tizen package -t wgt -s default || TIZEN_RC=$?
set -e

# Find generated wgt (Tizen outputs to current folder)
LATEST_WGT=$(ls -1t *.wgt 2>/dev/null | head -n1 || true)
if [ -z "${LATEST_WGT:-}" ]; then
  echo "Error: No .wgt produced. Check Tizen CLI output above."
  exit 1
fi

mv "$LATEST_WGT" "$DIST_DIR/$WGT_NAME"
echo "[package] Packaged: $DIST_DIR/$WGT_NAME"

popd >/dev/null
