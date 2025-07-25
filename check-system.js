#!/usr/bin/env node

// Cross-platform system check for SERAT
const { execSync } = require('child_process');
const os = require('os');

console.log('🔍 SERAT System Compatibility Check');
console.log('====================================');

const platform = os.platform();
const arch = os.arch();
console.log(`🖥️  OS: ${platform} (${arch})`);
console.log(`📦 Node: ${process.version}`);

let score = 0;
const checks = [];

// Check Node.js version
try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
    if (majorVersion >= 16) {
        checks.push('✅ Node.js version compatible');
        score++;
    } else {
        checks.push('❌ Node.js version too old (need 16+)');
    }
} catch (error) {
    checks.push('❌ Node.js not found');
}

// Check Java
try {
    const javaOutput = execSync('java -version 2>&1', { encoding: 'utf8' });
    if (javaOutput.includes('17') || javaOutput.includes('18') || javaOutput.includes('19') || javaOutput.includes('20') || javaOutput.includes('21')) {
        checks.push('✅ Java 17+ installed');
        score++;
    } else {
        checks.push('❌ Java 17+ required');
    }
} catch (error) {
    checks.push('❌ Java not found');
}

// Check Docker
try {
    execSync('docker --version', { stdio: 'ignore' });
    checks.push('✅ Docker installed');
    score++;
    
    try {
        execSync('docker ps', { stdio: 'ignore' });
        checks.push('✅ Docker daemon running');
        score++;
    } catch (error) {
        checks.push('⚠️  Docker installed but not running');
    }
} catch (error) {
    checks.push('❌ Docker not found');
}

// Check Docker Compose
try {
    execSync('docker-compose --version', { stdio: 'ignore' });
    checks.push('✅ Docker Compose available');
    score++;
} catch (error) {
    checks.push('❌ Docker Compose not found');
}

// Check Git
try {
    execSync('git --version', { stdio: 'ignore' });
    checks.push('✅ Git installed');
    score++;
} catch (error) {
    checks.push('❌ Git not found');
}

// Display results
console.log('\n📋 Compatibility Results:');
checks.forEach(check => console.log(`   ${check}`));

console.log(`\n📊 Compatibility Score: ${score}/6`);

if (score === 6) {
    console.log('🎉 Perfect! Your system is fully compatible with SERAT.');
    console.log('🚀 You can proceed with installation using any method.');
} else if (score >= 4) {
    console.log('⚠️  Your system is mostly compatible. Install missing components.');
    console.log('💡 Run the setup script for automated installation help.');
} else {
    console.log('❌ Your system needs several components before running SERAT.');
    console.log('📚 Check the setup guides for your platform.');
}

// Platform-specific recommendations
console.log('\n💡 Next Steps:');
if (platform === 'win32') {
    console.log('   🪟 Windows: Run start-dev.bat or see docs/WINDOWS_SETUP.md');
} else if (platform === 'darwin') {
    console.log('   🍎 macOS: Run ./start-dev.sh or use Homebrew for missing packages');
} else {
    console.log('   🐧 Linux: Run ./start-dev.sh or see docs/LINUX_SETUP.md');
}

console.log('   🌍 Universal: node setup.js');
