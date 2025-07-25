# 🐧 SERAT Linux Installation Guide

This guide helps you set up SERAT Enterprise Management System on Linux distributions.

## 📋 Prerequisites Installation

### Ubuntu/Debian-based Systems

#### 1. Update Package Lists
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Java 17+
```bash
# Install OpenJDK 17
sudo apt install openjdk-17-jdk -y

# Verify installation
java -version

# Set JAVA_HOME (optional)
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

#### 3. Install Node.js 16+
```bash
# Method 1: Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Method 2: Using apt (may be older version)
sudo apt install nodejs npm -y

# Verify installation
node --version
npm --version
```

#### 4. Install Docker
```bash
# Install Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce -y

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

#### 5. Install Git
```bash
sudo apt install git -y
git --version
```

### CentOS/RHEL/Fedora Systems

#### 1. Install Java 17+
```bash
# CentOS/RHEL
sudo yum install java-17-openjdk-devel -y

# Fedora
sudo dnf install java-17-openjdk-devel -y

# Verify installation
java -version
```

#### 2. Install Node.js 16+
```bash
# CentOS/RHEL - Enable NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y

# Fedora
sudo dnf install nodejs npm -y

# Verify installation
node --version
npm --version
```

#### 3. Install Docker
```bash
# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io -y

# Fedora
sudo dnf install docker-ce docker-ce-cli containerd.io -y

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### 4. Install Git
```bash
# CentOS/RHEL
sudo yum install git -y

# Fedora
sudo dnf install git -y
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/AkXtreme/serat-system.git
cd serat-system

# Make script executable and run
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Cross-platform Setup
```bash
# Clone the repository
git clone https://github.com/AkXtreme/serat-system.git
cd serat-system

# Run cross-platform setup
node setup.js
```

### Option 3: Manual Setup
```bash
# Clone the repository
git clone https://github.com/AkXtreme/serat-system.git
cd serat-system

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Start databases
docker-compose up -d

# Start the application
npm run dev
```

## 🔧 Linux-Specific Commands

### Using Gradle Wrapper
```bash
# Make gradlew executable
chmod +x gradlew

# Clean the project
./gradlew clean

# Build the backend
./gradlew build

# Run tests
./gradlew test

# Start backend only
./gradlew bootRun
```

### Using npm Scripts (Cross-platform)
```bash
# Start development servers
npm run dev

# Clean project
npm run clean

# Run tests
npm run test

# Build for production
npm run build
```

## 🐛 Common Linux Issues

### Issue: Permission denied for gradlew
**Solution:**
```bash
chmod +x gradlew
```

### Issue: Docker permission denied
**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo (not recommended for development)
sudo docker-compose up -d
```

### Issue: Port already in use
**Solution:**
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8080
sudo netstat -tulpn | grep :5432

# Kill process if needed
sudo kill -9 <process_id>
```

### Issue: Node.js/npm not found after installation
**Solution:**
```bash
# Reload your shell configuration
source ~/.bashrc

# Or create symbolic links
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

### Issue: Docker service not running
**Solution:**
```bash
# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Check Docker status
sudo systemctl status docker
```

## 🔥 Firewall Configuration

If you're having connectivity issues, you may need to configure your firewall:

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 3000   # Frontend
sudo ufw allow 8080   # Backend
sudo ufw allow 5432   # PostgreSQL
sudo ufw allow 6379   # Redis

# CentOS/RHEL/Fedora (firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --permanent --add-port=6379/tcp
sudo firewall-cmd --reload
```

## 🎯 Application URLs

After successful setup:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html

## 🔐 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 💡 Tips for Linux Users

1. **Use package managers** when possible for cleaner installations
2. **Keep system updated** for security and compatibility
3. **Use virtual environments** for Node.js projects (optional)
4. **Monitor system resources** with htop or similar tools
5. **Use tmux or screen** for persistent terminal sessions
6. **Set up aliases** for common commands:
   ```bash
   echo 'alias serat-start="cd /path/to/serat-system && npm run dev"' >> ~/.bashrc
   ```

## 🐳 Docker Best Practices on Linux

1. **Limit Docker resources** if needed:
   ```bash
   # Add to /etc/docker/daemon.json
   {
     "default-ulimits": {
       "memlock": {"hard": -1, "soft": -1}
     }
   }
   ```

2. **Clean up Docker resources** periodically:
   ```bash
   # Remove unused containers, networks, images
   docker system prune -a
   ```

3. **Monitor Docker resources**:
   ```bash
   docker stats
   docker system df
   ```

## 📞 Getting Help

If you encounter issues:
1. Check system logs: `journalctl -xe`
2. Check Docker logs: `docker-compose logs`
3. Verify all services are running: `systemctl status docker`
4. Check the main README.md for general troubleshooting
5. Visit the project's GitHub Issues page
