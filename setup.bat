@echo off
echo 🚀 Setting up MERN Memories Project...

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install
cd ..

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install
cd ..

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo 📝 Creating .env file...
    copy server\env.example server\.env
    echo ⚠️  Please update server\.env with your MongoDB connection string and JWT secret
)

echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update server\.env with your MongoDB connection string
echo 2. Run 'npm run dev' to start both client and server
echo 3. Open http://localhost:3000 in your browser
echo.
echo 🎉 Happy coding!
pause 