#!/usr/bin/env bash
# AZCoherence one-click install. Counted download via this project's Worker.
# Usage: curl -fsSL https://azcoherence-download-tracker.vibelock.workers.dev/install.sh | bash
set -euo pipefail

HOST="${AZCOHERENCE_HOME_HOST:-https://azcoherence-download-tracker.vibelock.workers.dev}"
ASSET="${AZCOHERENCE_HOME_ASSET:-azcoherence-0.1.0.tar.gz}"
WORKDIR="${AZCOHERENCE_HOME:-$HOME/azcoherence}"

mkdir -p "$WORKDIR"
cd "$WORKDIR"

echo "Downloading counted tarball from ${HOST}/download (User-Agent Mozilla/5.0)…"
curl -fsSL -A 'Mozilla/5.0' "${HOST}/download?asset=${ASSET}" -o "${ASSET}"

tar -xzf "${ASSET}"
DIR="$(find . -maxdepth 1 -type d -name 'azcoherence-*' | head -n 1)"
if [ -n "${DIR}" ]; then
  cd "${DIR}"
fi

python3 -m venv .venv
# shellcheck disable=SC1091
. .venv/bin/activate
python -m pip install -U pip
python -m pip install -e .

echo
echo "Installed AZCoherence."
echo "Author: Aziel Eliab."
echo
echo "1. azcoherence ui"
echo "2. Open http://127.0.0.1:8871/"
echo "3. Choose Review."
