#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <git_repo_url> [branch] [idc_code]"
  echo "Example: $0 https://github.com/yourname/aaPanel.git main"
  exit 1
fi

REPO_URL="$1"
BRANCH="${2:-main}"
IDC_CODE="${3:-}"

export AAPANEL_REPO_URL="$REPO_URL"
export AAPANEL_REPO_BRANCH="$BRANCH"

echo "Installing aaPanel from custom repo: ${AAPANEL_REPO_URL}"
echo "Branch: ${AAPANEL_REPO_BRANCH}"

if [ -n "$IDC_CODE" ]; then
  bash ./install.sh "$IDC_CODE"
else
  bash ./install.sh
fi
