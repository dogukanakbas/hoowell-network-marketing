#!/bin/bash

echo "🚀 HOOWELL Production Deployment Starting..."

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hata durumunda çık
set -e

echo -e "${YELLOW}📋 Pre-deployment Checklist${NC}"

# 1. Git durumunu kontrol et
echo "1. Checking Git status..."
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}❌ Uncommitted changes found. Please commit all changes first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git status clean${NC}"

# 2. Veritabanı backup
echo "2. Creating database backup..."
mysqldump -u root -p hoowell_network > "deployment/backup_$(date +%Y%m%d_%H%M%S).sql"
echo -e "${GREEN}✅ Database backup created${NC}"

# 3. Frontend build
echo "3. Building frontend..."
cd frontend
npm run build
cd ..
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# 4. Backend dependencies
echo "4. Installing backend dependencies..."
cd backend
npm install --production
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# 5. Database migrations
echo "5. Running database migrations..."
mysql -u root -p hoowell_network < backend/fix_customers_table.sql
mysql -u root -p hoowell_network < backend/create_settings_table.sql
mysql -u root -p hoowell_network < backend/fix_payments_table.sql
echo -e "${GREEN}✅ Database migrations completed${NC}"

# 6. Environment setup
echo "6. Setting up production environment..."
cp .env.production .env
echo -e "${GREEN}✅ Production environment configured${NC}"

# 7. PM2 setup (if available)
if command -v pm2 &> /dev/null; then
    echo "7. Starting with PM2..."
    pm2 stop hoowell-backend || true
    pm2 delete hoowell-backend || true
    pm2 start backend/server.js --name hoowell-backend
    pm2 save
    echo -e "${GREEN}✅ PM2 process started${NC}"
else
    echo "7. PM2 not found, starting with node..."
    cd backend
    nohup node server.js > ../logs/server.log 2>&1 &
    cd ..
    echo -e "${GREEN}✅ Server started in background${NC}"
fi

# 8. Nginx setup (if needed)
if command -v nginx &> /dev/null; then
    echo "8. Reloading Nginx..."
    sudo nginx -t && sudo nginx -s reload
    echo -e "${GREEN}✅ Nginx reloaded${NC}"
fi

echo -e "${GREEN}🎉 Production deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update your domain DNS to point to this server"
echo "2. Configure SSL certificate (Let's Encrypt recommended)"
echo "3. Update PayTR merchant settings with production URLs"
echo "4. Test the payment flow end-to-end"

echo -e "${GREEN}🔗 Your application should be running at:${NC}"
echo "Frontend: https://hoowell.net"
echo "Backend API: https://hoowell.net/api"