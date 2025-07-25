#!/usr/bin/env node

// Cross-platform setup script for SERAT
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
const isLinux = os.platform() === 'linux';

console.log('🚀 SERAT Cross-Platform Setup Script');
console.log('=====================================');
console.log(`🖥️  Detected OS: ${os.platform()} (${os.arch()})`);
console.log('');

// Check if Docker is installed and running
function checkDocker() {
    try {
        execSync('docker --version', { stdio: 'ignore' });
        execSync('docker-compose --version', { stdio: 'ignore' });
        console.log('✅ Docker and Docker Compose are installed');
        
        // Try to connect to Docker daemon
        execSync('docker ps', { stdio: 'ignore' });
        console.log('✅ Docker daemon is running');
        return true;
    } catch (error) {
        console.log('❌ Docker is not installed or not running');
        if (isWindows) {
            console.log('💡 Please install Docker Desktop from: https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe');
        } else if (isMac) {
            console.log('💡 Please install Docker Desktop from: https://desktop.docker.com/mac/stable/Docker.dmg');
        } else {
            console.log('💡 Please install Docker from: https://docs.docker.com/engine/install/');
        }
        return false;
    }
}

// Check if Node.js is installed
function checkNode() {
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
        if (majorVersion >= 16) {
            console.log(`✅ Node.js ${nodeVersion} is installed`);
            return true;
        } else {
            console.log(`❌ Node.js ${nodeVersion} is too old. Please install Node.js 16+`);
            return false;
        }
    } catch (error) {
        console.log('❌ Node.js is not installed');
        console.log('💡 Please install Node.js 16+ from: https://nodejs.org/');
        return false;
    }
}

// Check if Java is installed
function checkJava() {
    try {
        const javaVersion = execSync('java -version 2>&1', { encoding: 'utf8' });
        if (javaVersion.includes('17') || javaVersion.includes('18') || javaVersion.includes('19') || javaVersion.includes('20') || javaVersion.includes('21')) {
            console.log('✅ Java 17+ is installed');
            return true;
        } else {
            console.log('❌ Java 17+ is required');
            console.log('💡 Please install Java 17+ from: https://openjdk.org/');
            return false;
        }
    } catch (error) {
        console.log('❌ Java is not installed');
        console.log('💡 Please install Java 17+ from: https://openjdk.org/');
        return false;
    }
}

// Main setup function
function main() {
    console.log('🔍 Checking prerequisites...\n');
    
    const dockerOk = checkDocker();
    const nodeOk = checkNode();
    const javaOk = checkJava();
    
    if (!dockerOk || !nodeOk || !javaOk) {
        console.log('\n❌ Prerequisites check failed. Please install missing requirements and run setup again.');
        process.exit(1);
    }
    
    console.log('\n✅ All prerequisites are satisfied!\n');
    
    try {
        console.log('📦 Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });
        
        console.log('🐳 Starting database services...');
        execSync('docker-compose up -d', { stdio: 'inherit' });
        
        console.log('\n🎉 Setup completed successfully!\n');
        console.log('🚀 To start the application, run:');
        console.log('   npm run dev\n');
        console.log('🌐 Application URLs:');
        console.log('   Frontend: http://localhost:3000');
        console.log('   Backend:  http://localhost:8080');
        console.log('   API Docs: http://localhost:8080/swagger-ui.html\n');
        console.log('🔐 Default login credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        
    } catch (error) {
        console.log('\n❌ Setup failed:', error.message);
        process.exit(1);
    }
}

main();
