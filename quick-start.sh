#!/bin/bash

echo "🎵 Welcome to SightReadPro Setup! 🎵"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $(node -v) is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check the error above."
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Check if iOS setup is needed (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS detected. Setting up iOS dependencies..."
    
    if [ -d "ios" ]; then
        cd ios
        echo "📱 Installing iOS pods..."
        pod install
        cd ..
        echo "✅ iOS setup complete!"
    else
        echo "⚠️  iOS directory not found. Skipping iOS setup."
    fi
else
    echo "🐧 Non-macOS system detected. Skipping iOS setup."
fi

echo ""
echo "🎉 Setup complete! Here's what to do next:"
echo ""
echo "1. 🔥 Set up Firebase:"
echo "   - Follow the FIREBASE_SETUP.md guide"
echo "   - Update src/config/firebase.ts with your credentials"
echo ""
echo "2. 🚀 Run the app:"
echo "   - Start Metro: npm start"
echo "   - Android: npm run android"
echo "   - iOS: npm run ios (macOS only)"
echo ""
echo "3. 📚 Read the README.md for more details"
echo ""
echo "Happy coding! 🎼✨"


