#!/bin/bash
# ============================================================
# E-Vote ITERA — Install Script
# ============================================================
set -e

echo ""
echo "╔════════════════════════════════════════╗"
echo "║       E-Vote ITERA — Setup Script      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check dependencies
command -v php >/dev/null 2>&1 || { echo "❌ PHP tidak ditemukan. Install PHP 8.2+"; exit 1; }
command -v composer >/dev/null 2>&1 || { echo "❌ Composer tidak ditemukan."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js tidak ditemukan. Install Node 20+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm tidak ditemukan."; exit 1; }

echo "✅ Semua dependency tersedia"
echo ""

# Copy env
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ .env dibuat dari .env.example"
fi

# Install PHP deps
echo "📦 Installing PHP dependencies..."
composer install --no-interaction --optimize-autoloader

# Generate key
php artisan key:generate --ansi

# Install Node deps
echo "📦 Installing Node.js dependencies..."
npm install

# Install Shadcn UI components
echo "🎨 Setting up Shadcn UI..."
npx shadcn@latest init --yes --defaults 2>/dev/null || echo "(Shadcn init skipped - jalankan manual jika perlu)"

echo ""
echo "╔════════════════════════════════════════╗"
echo "║          Konfigurasi Diperlukan        ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Edit file .env dan isi:"
echo "  DB_DATABASE     = nama database MySQL"
echo "  DB_USERNAME     = username MySQL"
echo "  DB_PASSWORD     = password MySQL"
echo ""
echo "  GOOGLE_CLIENT_ID      = dari Google Cloud Console"
echo "  GOOGLE_CLIENT_SECRET  = dari Google Cloud Console"
echo ""
echo "  TURNSTILE_SITE_KEY    = dari Cloudflare Dashboard"
echo "  TURNSTILE_SECRET_KEY  = dari Cloudflare Dashboard"
echo ""
echo "Setelah mengisi .env, jalankan:"
echo "  php artisan migrate --seed"
echo "  php artisan storage:link"
echo "  composer run dev"
echo ""
echo "Login default:"
echo "  Admin  : admin@itera.ac.id   / password"
echo "  Petugas: petugas@itera.ac.id / password"
echo ""
echo "✅ Setup awal selesai!"
