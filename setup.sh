#!/bin/bash

echo "=========================================="
echo "Tailoré Catalog Service - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Check if outfits.csv exists
if [ ! -f "../outfits.csv" ]; then
    echo "⚠️  Warning: outfits.csv not found in parent directory"
    echo "   Please ensure outfits.csv is available before seeding"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Initialize database
echo "🗄️  Initializing database..."
npm run init-db

if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize database"
    exit 1
fi

echo "✓ Database initialized"
echo ""

# Seed database
echo "🌱 Seeding database with data..."
npm run seed

if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "🔐 Default credentials:"
echo "   Admin: username=admin, password=admin123"
echo "   User:  username=user, password=user123"
echo ""
echo "🚀 To start the server:"
echo "   Development: npm run dev"
echo "   Production:  npm start"
echo ""
echo "📡 Server will run on: http://localhost:3000"
echo "=========================================="
