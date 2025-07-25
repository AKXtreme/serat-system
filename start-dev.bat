@echo off
REM SERAT Development Startup Script for Windows
echo 🚀 Starting SERAT Enterprise Management System...
echo 📁 Project: Ethiopian Enterprise Management System
echo 🔧 Backend: Spring Boot (Port 8080)
echo ⚛️ Frontend: React Development Server (Port 3000)
echo ==================================================

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    echo 💡 Tip: Start Docker Desktop from the Windows Start menu
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo 💡 Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install Java 17+ first.
    echo 💡 Download from: https://openjdk.org/
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!
echo 🐳 Starting database services...

REM Start database services
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start database services
    pause
    exit /b 1
)

echo ✅ Database services are ready!
echo 📦 Installing dependencies...

REM Install dependencies
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

cd frontend
call npm install
cd ..

echo 🎯 Starting both frontend and backend...

REM Run both frontend and backend
npm run dev
