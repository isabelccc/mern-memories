#!/bin/bash

echo "🚀 Setting up MERN Memories Project..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file..."
    cp server/env.example server/.env
    echo "⚠️  Please update server/.env with your MongoDB connection string and JWT secret"
fi

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your MongoDB connection string"
echo "2. Run 'npm run dev' to start both client and server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🎉 Happy coding!" 