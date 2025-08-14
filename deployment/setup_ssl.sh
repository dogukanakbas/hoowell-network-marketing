#!/bin/bash

echo "🔒 Setting up SSL certificate for hoowell.net"

# Renklendirme
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Certbot kurulumu (Ubuntu/Debian)
echo -e "${YELLOW}Installing Certbot...${NC}"
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# SSL sertifikası alma
echo -e "${YELLOW}Obtaining SSL certificate for hoowell.net...${NC}"
sudo certbot --nginx -d hoowell.net -d www.hoowell.net

# Otomatik yenileme ayarı
echo -e "${YELLOW}Setting up automatic renewal...${NC}"
sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo -e "${GREEN}✅ SSL certificate setup completed!${NC}"
echo "Your site is now secure at: https://hoowell.net"