#!/bin/bash

echo "🧪 HOOWELL Test Deployment for hoowell.net"

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hata durumunda çık
set -e

echo -e "${BLUE}🚀 Starting test deployment...${NC}"

# 1. Sistem kontrolü
echo -e "${YELLOW}1. Checking system requirements...${NC}"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "MySQL status: $(systemctl is-active mysql || echo 'Not running')"
echo "Nginx status: $(systemctl is-active nginx || echo 'Not running')"

# 2. Proje dizinine git
echo -e "${YELLOW}2. Navigating to project directory...${NC}"
cd /home/$(whoami)/hoowell_son || {
    echo -e "${RED}❌ Project directory not found. Please clone the repository first.${NC}"
    exit 1
}

# 3. Git pull (en son değişiklikleri al)
echo -e "${YELLOW}3. Pulling latest changes...${NC}"
git pull origin main || echo "Git pull failed, continuing..."

# 4. Backend dependencies
echo -e "${YELLOW}4. Installing backend dependencies...${NC}"
npm install

# 5. Frontend dependencies ve build
echo -e "${YELLOW}5. Installing frontend dependencies and building...${NC}"
cd frontend
npm install
npm run build
cd ..

# 6. Database setup
echo -e "${YELLOW}6. Setting up database...${NC}"
echo "Please enter MySQL root password when prompted:"

# Database oluştur (eğer yoksa)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hoowell_network;" || echo "Database might already exist"

# Migration'ları çalıştır
echo "Running database migrations..."
mysql -u root -p hoowell_network < backend/fix_customers_table.sql || echo "Customers table migration completed"
mysql -u root -p hoowell_network < backend/create_settings_table.sql || echo "Settings table migration completed"
mysql -u root -p hoowell_network < backend/fix_payments_table.sql || echo "Payments table migration completed"

# 7. Environment setup
echo -e "${YELLOW}7. Setting up environment...${NC}"
if [ ! -f .env ]; then
    cp .env.production .env
    echo "Environment file created from production template"
    echo -e "${RED}⚠️  Please edit .env file with your actual credentials${NC}"
else
    echo "Environment file already exists"
fi

# 8. Test mode için PayTR ayarları
echo -e "${YELLOW}8. Configuring PayTR for test mode...${NC}"
# Test mode'u zorla aktif et
sed -i 's/NODE_ENV=production/NODE_ENV=development/' .env || echo "Environment already in test mode"

# 9. PM2 ile servisi başlat
echo -e "${YELLOW}9. Starting services with PM2...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 stop hoowell-backend || echo "Service not running"
    pm2 delete hoowell-backend || echo "Service not found"
    pm2 start backend/server.js --name hoowell-backend
    pm2 save
    echo -e "${GREEN}✅ PM2 service started${NC}"
else
    echo "PM2 not found, installing..."
    npm install -g pm2
    pm2 start backend/server.js --name hoowell-backend
    pm2 save
    pm2 startup
fi

# 10. Nginx test konfigürasyonu
echo -e "${YELLOW}10. Setting up Nginx for testing...${NC}"
sudo tee /etc/nginx/sites-available/hoowell-test > /dev/null <<EOF
server {
    listen 80;
    server_name hoowell.net www.hoowell.net;

    # Frontend (React build)
    location / {
        root $(pwd)/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Nginx site'ı aktif et
sudo ln -sf /etc/nginx/sites-available/hoowell-test /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}🎉 Test deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Test Information:${NC}"
echo "Frontend: http://hoowell.net"
echo "Backend API: http://hoowell.net/api"
echo "PM2 Status: pm2 status"
echo "Logs: pm2 logs hoowell-backend"
echo ""
echo -e "${YELLOW}🧪 Test Checklist:${NC}"
echo "1. ✅ Visit http://hoowell.net"
echo "2. ✅ Login with admin credentials"
echo "3. ✅ Try customer registration"
echo "4. ✅ Test PayTR payment (test mode)"
echo "5. ✅ Check database records"
echo ""
echo -e "${RED}⚠️  Important Notes:${NC}"
echo "- This is TEST MODE deployment"
echo "- PayTR is in test mode (no real payments)"
echo "- No SSL certificate (HTTP only)"
echo "- Edit .env file for production settings"
echo ""
echo -e "${GREEN}🔧 Useful Commands:${NC}"
echo "pm2 status          - Check service status"
echo "pm2 logs            - View logs"
echo "pm2 restart all     - Restart services"
echo "sudo nginx -t       - Test nginx config"
echo "mysql -u root -p    - Access database"