# Deployment Guide - Tailoré Catalog Service

## 📋 Overview

Panduan lengkap untuk deploy Tailoré Catalog & Inventory Service ke STB (Set Top Box) atau server production menggunakan Docker.

---

## 🎯 Prerequisites

### Di Local Machine (Development)
- Node.js v18+
- Docker Desktop (untuk testing)
- Git
- outfits.csv dataset

### Di STB/Server (Production)
- Docker Engine
- Docker Compose
- SSH access
- Port 3000 available (atau port custom)
- Public IP atau domain

---

## 🚀 Deployment Steps

### Step 1: Prepare Project

```bash
# 1. Clone repository atau copy project
git clone <your-repo-url>
cd Tailore_CatalogService

# 2. Pastikan outfits.csv ada di tempat yang benar
# Default: ../outfits.csv (parent directory)
# Atau edit CSV_PATH di .env

# 3. Update .env untuk production
cp .env.example .env
nano .env
```

Edit `.env`:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<GENERATE-STRONG-SECRET-KEY>
JWT_EXPIRES_IN=24h
DB_PATH=/app/data/catalog.db
CSV_PATH=../outfits.csv
```

**🔐 Generate Strong JWT Secret:**
```bash
# Linux/Mac
openssl rand -hex 32

# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

### Step 2: Build Docker Image

```bash
# Build image
docker build -t tailore-catalog-service:latest .

# Test locally
docker run -d -p 3000:3000 --name catalog-test tailore-catalog-service:latest

# Check logs
docker logs -f catalog-test

# Test endpoint
curl http://localhost:3000/health

# Stop test container
docker stop catalog-test
docker rm catalog-test
```

---

### Step 3: Transfer to STB/Server

#### Option A: Using Docker Save/Load

```bash
# On local machine
docker save tailore-catalog-service:latest | gzip > catalog-service.tar.gz

# Transfer to STB
scp catalog-service.tar.gz user@stb-ip:/path/to/deploy/

# On STB
ssh user@stb-ip
cd /path/to/deploy/
docker load < catalog-service.tar.gz
```

#### Option B: Using Git + Build on STB

```bash
# On STB
ssh user@stb-ip
cd /path/to/deploy/
git clone <your-repo-url>
cd Tailore_CatalogService

# Build on STB
docker build -t tailore-catalog-service:latest .
```

#### Option C: Transfer Files via SCP

```bash
# On local machine
cd Tailore_CatalogService
tar -czf catalog-service-src.tar.gz .

# Transfer
scp catalog-service-src.tar.gz user@stb-ip:/path/to/deploy/

# On STB
ssh user@stb-ip
cd /path/to/deploy/
tar -xzf catalog-service-src.tar.gz
docker-compose up -d
```

---

### Step 4: Deploy with Docker Compose

```bash
# On STB
cd /path/to/deploy/Tailore_CatalogService

# Make sure outfits.csv is available
ls -l ../outfits.csv

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f catalog-service

# Check health
curl http://localhost:3000/health
```

---

### Step 5: Initialize Database

**First time deployment:**

```bash
# Option 1: Initialize inside container
docker-compose exec catalog-service npm run init-db
docker-compose exec catalog-service npm run seed

# Option 2: Restart container (will auto-initialize on first run)
docker-compose restart
```

---

### Step 6: Configure Firewall

```bash
# Allow port 3000 (Ubuntu/Debian)
sudo ufw allow 3000/tcp
sudo ufw reload

# Check firewall status
sudo ufw status

# For CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

### Step 7: Setup Reverse Proxy (Optional but Recommended)

#### Using Nginx

```bash
# Install Nginx
sudo apt-get install nginx

# Create config
sudo nano /etc/nginx/sites-available/tailore-catalog
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tailore-catalog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL with Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

---

### Step 8: Verify Deployment

```bash
# 1. Check container is running
docker ps

# 2. Check logs
docker-compose logs -f

# 3. Test health endpoint
curl http://your-stb-ip:3000/health

# 4. Test login
curl -X POST http://your-stb-ip:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 5. Test products endpoint
curl http://your-stb-ip:3000/api/catalog/products?limit=5
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Or without downtime
docker-compose build
docker-compose up -d --no-deps --build catalog-service
```

### View Logs

```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f catalog-service
```

### Backup Database

```bash
# Backup
docker-compose exec catalog-service tar -czf /tmp/db-backup.tar.gz /app/data
docker cp $(docker-compose ps -q catalog-service):/tmp/db-backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz

# Restore
docker cp backup-20260104.tar.gz $(docker-compose ps -q catalog-service):/tmp/
docker-compose exec catalog-service tar -xzf /tmp/backup-20260104.tar.gz -C /
docker-compose restart
```

### Database Management

```bash
# Access container
docker-compose exec catalog-service sh

# Inside container:
cd /app
npm run init-db    # Re-initialize tables
npm run seed       # Re-seed data
node              # Node REPL for debugging
```

---

## 📊 Monitoring

### Health Check

```bash
# Manual check
curl http://localhost:3000/health

# Auto-monitor (every 30 seconds)
watch -n 30 'curl -s http://localhost:3000/health | jq'
```

### Docker Stats

```bash
# Resource usage
docker stats catalog-service

# Continuous monitoring
docker stats
```

### Application Logs

```bash
# Follow logs
docker-compose logs -f catalog-service

# Export logs
docker-compose logs catalog-service > app-logs-$(date +%Y%m%d).log
```

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs catalog-service

# Check container status
docker-compose ps

# Restart
docker-compose restart

# Full rebuild
docker-compose down
docker-compose up -d --build
```

### Port already in use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Or change port in docker-compose.yml
# ports:
#   - "3001:3000"
```

### Database issues

```bash
# Reset database
docker-compose exec catalog-service rm /app/data/catalog.db
docker-compose restart
docker-compose exec catalog-service npm run seed
```

### Out of disk space

```bash
# Clean Docker
docker system prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
df -h
docker system df
```

---

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Change default admin password
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure firewall rules
- [ ] Disable unnecessary ports
- [ ] Regular backup schedule
- [ ] Monitor logs for suspicious activity
- [ ] Keep Docker images updated
- [ ] Use environment-specific .env files
- [ ] Don't commit .env to git

---

## 📞 Support & Resources

### Useful Commands

```bash
# Service management
docker-compose up -d        # Start
docker-compose down         # Stop
docker-compose restart      # Restart
docker-compose ps           # Status
docker-compose logs -f      # Logs

# Database
docker-compose exec catalog-service npm run init-db
docker-compose exec catalog-service npm run seed

# Shell access
docker-compose exec catalog-service sh

# Health check
curl http://localhost:3000/health
```

### Links
- Documentation: README.md
- API Testing: API_TESTING.md
- Postman Collection: postman_collection.json

---

## 📝 Production Checklist

- [ ] Project transferred to STB
- [ ] Docker installed and running
- [ ] Environment variables configured
- [ ] Database initialized and seeded
- [ ] Application running on Docker
- [ ] Firewall configured
- [ ] Reverse proxy setup (optional)
- [ ] SSL certificate installed (optional)
- [ ] Health check passing
- [ ] API endpoints tested
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Documentation updated

---

**Happy Deploying! 🚀**
