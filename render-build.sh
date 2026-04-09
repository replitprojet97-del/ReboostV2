#!/usr/bin/env bash
# Build script pour le BACKEND sur Render.com
# Architecture: Frontend (Vercel) + Backend (Render)
# Ce script installe uniquement Chrome/Chromium pour la génération PDF

set -e

echo "🌐 Configuration du cache Puppeteer..."
export PUPPETEER_CACHE_DIR=/opt/render/project/.cache/puppeteer

echo "🔧 Installation de Chrome via Puppeteer..."
npx puppeteer browsers install chrome

echo "✅ Chrome installé avec succès!"
echo "📦 Le backend sera compilé avec esbuild (pas de Vite nécessaire)"
