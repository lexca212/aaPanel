#!/bin/bash
set -e
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$BASE_DIR/security_tools_plugin"
OUT_DIR="$BASE_DIR/dist"
OUT_FILE="$OUT_DIR/security_tools_plugin.zip"

mkdir -p "$OUT_DIR"
rm -f "$OUT_FILE"
cd "$PLUGIN_DIR"
zip -qr "$OUT_FILE" info.json install.sh security_tools_main.py index.html

echo "Built: $OUT_FILE"
