#!/bin/bash

# SERAT Development Startup Script for Unix (Linux/macOS)
echo "🚀 Starting SERAT Enterprise Management System..."
echo "📁 Project: Ethiopian Enterprise Management System"
echo "🔧 Backend: Spring Boot (Port 8080)"
echo "⚛️  Frontend: React Development Server (Port 3000)"
echo "=================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is running
if ! docker version >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "💡 Tip: Start Docker Desktop from Applications or run 'open -a Docker'"
    else
        echo "💡 Tip: Start Docker service: sudo systemctl start docker"
    fi
    exit 1
fi

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "💡 Download from: https://nodejs.org/"
    exit 1
fi

# Check if Java is installed
if ! command_exists java; then
    echo "❌ Java is not installed. Please install Java 17+ first."
    echo "💡 Download from: https://openjdk.org/"
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo "🐳 Starting database services..."

# Start database services with Docker Compose
if ! docker-compose up -d; then
    echo "❌ Failed to start database services"
    exit 1
fi

# Wait a moment for services to start
echo "⏳ Waiting for database services to initialize..."
sleep 5

echo "✅ Database services are ready!"
echo "📦 Installing dependencies..."

# Install dependencies
if ! npm install; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

# Install frontend dependencies
if ! (cd frontend && npm install); then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "🎯 Starting both frontend and backend..."

# Run both frontend and backend
npm run dev
