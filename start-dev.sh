#!/bin/bash

# SERAT Development Startup Script
echo "🚀 Starting SERAT Enterprise Management System..."
echo "📁 Project: Ethiopian Enterprise Management System"
echo "🔧 Backend: Spring Boot (Port 8080)"
echo "⚛️  Frontend: React Development Server (Port 3000)"
echo "=================================================="

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    echo "💡 Tip: brew services start postgresql (macOS)"
    exit 1
fi

# Check if Redis is running
if ! redis-cli ping >/dev/null 2>&1; then
    echo "⚠️  Redis is not running. Starting Redis..."
    redis-server --daemonize yes
fi

echo "✅ Database services are ready!"
echo "🎯 Starting both frontend and backend..."

# Run both frontend and backend
npm run dev
