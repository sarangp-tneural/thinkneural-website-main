#!/usr/bin/env bash
# Run ON THE SERVER from the project folder: ./scripts/deploy.sh
# Pulls the latest code, builds, and switches the live site to the new build atomically.
# Layout it maintains (inside the project folder by default):
#   <APP_ROOT>/releases/<timestamp>/   and   <APP_ROOT>/current -> releases/<timestamp>
# nginx serves <APP_ROOT>/current. Override with APP_ROOT=/some/path if the repo lives elsewhere.
set -euo pipefail

cd "$(dirname "$0")/.."
APP_ROOT="${APP_ROOT:-$PWD}"
KEEP="${KEEP:-5}"

[ -f .env.local ] || { echo "Missing .env.local (EmailJS keys). Copy .env.example and fill it in."; exit 1; }

echo "==> Branch: $(git rev-parse --abbrev-ref HEAD)"
git pull --ff-only

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

REL="$APP_ROOT/releases/$(date +%Y%m%d-%H%M%S)"
echo "==> Publishing to $REL"
mkdir -p "$REL"
cp -a dist/. "$REL/"
ln -sfn "$REL" "$APP_ROOT/current.new"
mv -Tf "$APP_ROOT/current.new" "$APP_ROOT/current"   # atomic switch

echo "==> Pruning old releases (keeping $KEEP)"
ls -1dt "$APP_ROOT"/releases/* | tail -n +$((KEEP + 1)) | xargs -r rm -rf

echo "==> Live: $(readlink -f "$APP_ROOT/current")"
curl -sI http://127.0.0.1/ -H 'Host: thinkneural.ai' | head -1 || true
