#!/bin/bash
# Install custom aaPanel build from lexca212/aaPanel.
# Usage:
#   bash pasangpanel.sh [branch] [idc_code]
# Environment overrides:
#   AAPANEL_REPO_BRANCH=dev bash pasangpanel.sh
#   AAPANEL_REPO_URL=https://github.com/your/repo.git bash pasangpanel.sh

set -e

REPO_URL="${AAPANEL_REPO_URL:-https://github.com/lexca212/aaPanel.git}"
BRANCH="${AAPANEL_REPO_BRANCH:-${1:-main}}"
IDC_CODE="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTALL_SCRIPT="${SCRIPT_DIR}/install.sh"

export AAPANEL_REPO_URL="${REPO_URL}"
export AAPANEL_REPO_BRANCH="${BRANCH}"

echo "============================================================"
echo "Installing custom aaPanel"
echo "Repository : ${AAPANEL_REPO_URL}"
echo "Branch     : ${AAPANEL_REPO_BRANCH}"
echo "============================================================"

if [ ! -f "${INSTALL_SCRIPT}" ]; then
  TMP_DIR="/tmp/aapanel-custom-installer"
  RAW_URL="https://raw.githubusercontent.com/lexca212/aaPanel/${BRANCH}/install.sh"
  mkdir -p "${TMP_DIR}"
  INSTALL_SCRIPT="${TMP_DIR}/install.sh"
  echo "install.sh was not found next to pasangpanel.sh, downloading it from:"
  echo "${RAW_URL}"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSLk "${RAW_URL}" -o "${INSTALL_SCRIPT}"
  elif command -v wget >/dev/null 2>&1; then
    wget --no-check-certificate -O "${INSTALL_SCRIPT}" "${RAW_URL}"
  else
    echo "ERROR: curl or wget is required to download install.sh" >&2
    exit 1
  fi
fi

chmod +x "${INSTALL_SCRIPT}"

if [ -n "${IDC_CODE}" ]; then
  bash "${INSTALL_SCRIPT}" "${IDC_CODE}"
else
  bash "${INSTALL_SCRIPT}"
fi
