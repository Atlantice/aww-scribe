#!/bin/bash

# AwwScribe Hackathon Setup Script
# Run with: bash setup.sh

set -e

echo "🎙️  AwwScribe Voice Integration Setup"
echo "===================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm add @google-cloud/vertexai

echo ""
echo "📝 Setting up environment file..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo "⚠️  Please edit .env.local with your API keys:"
    echo "   - NEXT_PUBLIC_ELEVENLABS_API_KEY"
    echo "   - GOOGLE_CLOUD_PROJECT_ID"
    echo "   - GOOGLE_APPLICATION_CREDENTIALS path"
else
    echo "ℹ️  .env.local already exists, skipping..."
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Set up Google Cloud service account (see DEPLOYMENT_CHECKLIST.md)"
echo "3. Get ElevenLabs API key from https://elevenlabs.io"
echo "4. Run 'pnpm dev' to start the development server"
echo ""
echo "📚 See VOICE_INTEGRATION_GUIDE.md for architecture details"
echo "📚 See DEPLOYMENT_CHECKLIST.md for complete setup instructions"
echo ""
