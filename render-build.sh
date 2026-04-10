#!/usr/bin/env bash
# Build script pour le BACKEND sur Render.com
# Architecture: Frontend (Vercel) + Backend API (Render)

set -e

echo "📦 Installation des dépendances..."
npm ci

echo "🔨 Compilation du backend TypeScript avec esbuild..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --external:./vite \
  --bundle \
  --format=esm \
  --outdir=dist

echo "✅ Backend compilé dans dist/index.js"

echo "🌐 Configuration du cache Puppeteer..."
export PUPPETEER_CACHE_DIR=/opt/render/project/.cache/puppeteer

echo "🔧 Installation de Chrome via Puppeteer..."
npx puppeteer browsers install chrome

echo "✅ Chrome installé avec succès!"
echo "🚀 Build Render terminé — prêt pour le démarrage."
