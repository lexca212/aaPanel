#!/bin/bash
# aaPanel third-party plugin installer
ACTION="$1"
PLUGIN_PATH="/www/server/panel/plugin/security_tools"

case "$ACTION" in
  install)
    mkdir -p "$PLUGIN_PATH"
    chmod -R 700 "$PLUGIN_PATH"
    echo "security_tools installed"
    ;;
  uninstall)
    rm -rf "$PLUGIN_PATH"
    echo "security_tools removed"
    ;;
  *)
    echo "usage: $0 {install|uninstall}"
    exit 1
    ;;
esac
