#!/bin/bash

echo "🔒 Setting up security configurations for hoowell.net"

# Renklendirme
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Firewall ayarları
echo -e "${YELLOW}Configuring UFW firewall...${NC}"
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Fail2ban kurulumu
echo -e "${YELLOW}Installing Fail2ban...${NC}"
sudo apt update
sudo apt install -y fail2ban

# Fail2ban konfigürasyonu
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

sudo systemctl restart fail2ban

# MySQL güvenlik
echo -e "${YELLOW}Securing MySQL...${NC}"
echo "Please run: sudo mysql_secure_installation"

# Node.js güvenlik headers
echo -e "${YELLOW}Security headers configured in Nginx${NC}"

echo -e "${GREEN}✅ Security setup completed!${NC}"
echo -e "${RED}⚠️  Don't forget to:${NC}"
echo "1. Change default SSH port"
echo "2. Create non-root user for deployment"
echo "3. Set up SSH key authentication"
echo "4. Run mysql_secure_installation"