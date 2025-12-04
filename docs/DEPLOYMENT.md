# 🚀 Deployment Guide - IT Asset Management System

Panduan lengkap untuk deploy IT Asset Management System ke production server.

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 10+
- **RAM**: Minimum 2GB (Recommended 4GB)
- **CPU**: 2 Core minimum
- **Disk**: 20GB minimum

### Software Requirements
- Node.js 18+ LTS
- MySQL 8.0+
- Nginx (untuk reverse proxy)
- PM2 (process manager)
- Git

---

## 🔧 Step 1: Server Setup

### 1.1 Update System
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS
sudo yum update -y
```

### 1.2 Install Node.js (via NVM)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```

### 1.3 Install MySQL
```bash
# Ubuntu/Debian
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Start & Enable
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 1.4 Install Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# Start & Enable
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 1.5 Install PM2
```bash
npm install -g pm2
pm2 startup  # Setup auto-start on reboot
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Create Database & User
```bash
sudo mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE it_asset_management_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'asset_prod'@'localhost' IDENTIFIED BY 'YourSecurePassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON it_asset_management_prod.* TO 'asset_prod'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

---

## 📦 Step 3: Deploy Application

### 3.1 Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/VibeCoding3-JC/asst-mngmtjc.git it-asset-management
sudo chown -R $USER:$USER it-asset-management
cd it-asset-management
```

### 3.2 Setup Backend
```bash
cd backend

# Install dependencies
npm install --production

# Copy & configure environment
cp .env.production .env

# Edit .env dengan nilai production
nano .env
```

**Edit `.env` dengan nilai production:**
```env
DB_HOST=localhost
DB_NAME=it_asset_management_prod
DB_USER=asset_prod
DB_PASS=YourSecurePassword123!
DB_PORT=3306

# Generate JWT secrets
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
ACCESS_TOKEN_SECRET=your_generated_access_token_secret
REFRESH_TOKEN_SECRET=your_generated_refresh_token_secret

PORT=5000
NODE_ENV=production

CLIENT_URL=https://yourdomain.com
```

### 3.3 Setup Database Tables & Seeder
```bash
# Run migrations/sync (one-time setup)
node -e "
import db from './config/Database.js';
import './models/index.js';
(async () => {
  await db.sync();
  console.log('Database synced!');
  process.exit(0);
})();
"

# Run seeder
npm run seed
```

### 3.4 Setup Frontend
```bash
cd ../frontend

# Copy & configure environment
cp .env.production .env

# Edit .env
nano .env
```

**Edit `.env` dengan nilai production:**
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=IT Asset Management
```

```bash
# Install dependencies & build
npm install --production=false
npm run build
```

---

## 🌐 Step 4: Configure Nginx

### 4.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/it-asset-management
```

```nginx
# Backend API Server
server {
    listen 80;
    server_name api.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    # SSL Configuration (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}

# Frontend Server
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    root /var/www/it-asset-management/frontend/dist;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4.2 Enable Site & Test
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/it-asset-management /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔐 Step 5: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## ⚡ Step 6: Start Application with PM2

```bash
cd /var/www/it-asset-management/backend

# Start with PM2
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs it-asset-api
```

### PM2 Useful Commands
```bash
pm2 status          # Check app status
pm2 logs            # View logs
pm2 restart all     # Restart all apps
pm2 reload all      # Zero-downtime reload
pm2 stop all        # Stop all apps
pm2 delete all      # Remove all apps from PM2
pm2 monit           # Real-time monitoring
```

---

## ✅ Step 7: Verify Deployment

### 7.1 Check Backend
```bash
curl https://api.yourdomain.com/api/health
```
Expected response:
```json
{
  "success": true,
  "message": "API is healthy",
  "database": "connected"
}
```

### 7.2 Check Frontend
Open browser: `https://yourdomain.com`
- Pastikan halaman login muncul
- Test login dengan admin credentials

---

## 🔄 Updating Application

### Update dari Git
```bash
cd /var/www/it-asset-management

# Pull latest changes
git pull origin main

# Backend update
cd backend
npm install --production
pm2 reload it-asset-api

# Frontend update (jika ada perubahan)
cd ../frontend
npm install --production=false
npm run build
```

---

## 🛡️ Security Checklist

- [ ] Ganti semua password default
- [ ] Generate JWT secrets baru
- [ ] Enable firewall (UFW)
- [ ] Disable root SSH login
- [ ] Setup fail2ban
- [ ] Regular security updates
- [ ] Backup database otomatis

### Firewall Setup (UFW)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 📊 Monitoring

### PM2 Monitoring Dashboard
```bash
pm2 install pm2-logrotate  # Log rotation
pm2 install pm2-server-monit  # Server monitoring
```

### Log Locations
- PM2 Logs: `/var/www/it-asset-management/backend/logs/`
- Nginx Access: `/var/log/nginx/access.log`
- Nginx Error: `/var/log/nginx/error.log`

---

## 🆘 Troubleshooting

### Backend tidak bisa connect ke database
```bash
# Check MySQL status
sudo systemctl status mysql

# Check connection
mysql -u asset_prod -p -h localhost it_asset_management_prod
```

### PM2 app tidak jalan
```bash
pm2 logs it-asset-api --lines 100
pm2 restart it-asset-api
```

### Nginx 502 Bad Gateway
```bash
# Check if backend running
pm2 status

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 Support

Untuk bantuan lebih lanjut, hubungi tim development atau buat issue di repository GitHub.
