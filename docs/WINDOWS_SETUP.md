# 🪟 SERAT Windows Installation Guide

This guide helps you set up SERAT Enterprise Management System on Windows 10/11.

## 📋 Prerequisites Installation

### 1. Install Java 17+
1. Download OpenJDK 17+ from [https://openjdk.org/](https://openjdk.org/)
2. Run the installer and follow the prompts
3. Add Java to your PATH (usually done automatically)
4. Verify installation:
   ```cmd
   java -version
   ```

### 2. Install Node.js 16+
1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Choose the LTS version (recommended)
3. Run the installer and follow the prompts
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

### 3. Install Docker Desktop
1. Download Docker Desktop from [https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe](https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe)
2. Run the installer
3. Enable WSL 2 integration when prompted
4. Restart your computer if required
5. Start Docker Desktop and verify:
   ```cmd
   docker --version
   docker-compose --version
   ```

### 4. Install Git (if not already installed)
1. Download Git from [https://git-scm.com/](https://git-scm.com/)
2. Run the installer with default settings
3. Verify installation:
   ```cmd
   git --version
   ```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```cmd
REM Clone the repository
git clone https://github.com/AkXtreme/serat-system.git
cd serat-system

REM Run the Windows setup script
start-dev.bat
```

### Option 2: Manual Setup
```cmd
REM Clone the repository
git clone https://github.com/AkXtreme/serat-system.git
cd serat-system

REM Install dependencies
npm install
cd frontend
npm install
cd ..

REM Start databases
docker-compose up -d

REM Start the application
npm run dev
```

## 🔧 Windows-Specific Commands

### Using Windows Batch Scripts
```cmd
REM Clean the project
gradlew.bat clean

REM Build the backend
gradlew.bat build

REM Run tests
gradlew.bat test

REM Start backend only
gradlew.bat bootRun
```

### Using npm Scripts (Cross-platform)
```cmd
REM Start development servers
npm run dev

REM Clean project
npm run clean

REM Run tests
npm run test

REM Build for production
npm run build
```

## 🐛 Common Windows Issues

### Issue: "gradlew is not recognized"
**Solution:** Use the Windows batch file:
```cmd
gradlew.bat bootRun
```
Or use npm scripts:
```cmd
npm run backend
```

### Issue: Docker Desktop not starting
**Solutions:**
1. Enable Virtualization in BIOS
2. Enable Hyper-V in Windows Features
3. Update Windows to latest version
4. Restart Docker Desktop as Administrator

### Issue: Port conflicts
**Solution:** Check if ports are in use:
```cmd
REM Check port 3000 (Frontend)
netstat -ano | findstr :3000

REM Check port 8080 (Backend)
netstat -ano | findstr :8080

REM Check port 5432 (PostgreSQL)
netstat -ano | findstr :5432
```

### Issue: Permission errors
**Solution:** Run Command Prompt as Administrator:
1. Right-click Command Prompt
2. Select "Run as administrator"
3. Navigate to project directory
4. Run setup commands

## 📁 File Paths on Windows

Windows uses backslashes (`\`) for file paths, but the application handles this automatically. You can use forward slashes (`/`) in most commands.

## 🎯 Application URLs

After successful setup:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html

## 🔐 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 💡 Tips for Windows Users

1. **Use Windows Terminal** for better console experience
2. **Enable Developer Mode** in Windows Settings for better compatibility
3. **Use PowerShell** for advanced commands
4. **Keep Docker Desktop running** while developing
5. **Set environment variables** if needed:
   ```cmd
   set JAVA_HOME=C:\Program Files\Java\jdk-17
   set PATH=%JAVA_HOME%\bin;%PATH%
   ```

## 📞 Getting Help

If you encounter issues:
1. Check the main README.md for general troubleshooting
2. Visit the project's GitHub Issues page
3. Ensure all prerequisites are correctly installed
4. Try running commands as Administrator
