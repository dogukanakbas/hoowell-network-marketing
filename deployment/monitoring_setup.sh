#!/bin/bash

echo "📊 Setting up monitoring and logging for hoowell.net"

# Renklendirme
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Log dizinleri oluştur
echo -e "${YELLOW}Creating log directories...${NC}"
sudo mkdir -p /var/log/hoowell
sudo mkdir -p /home/$(whoami)/hoowell_son/logs
sudo chown -R $(whoami):$(whoami) /home/$(whoami)/hoowell_son/logs

# PM2 monitoring
echo -e "${YELLOW}Setting up PM2 monitoring...${NC}"
npm install -g pm2
pm2 install pm2-logrotate

# PM2 ecosystem dosyası
tee ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [{
    name: 'hoowell-backend',
    script: 'backend/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Logrotate konfigürasyonu
sudo tee /etc/logrotate.d/hoowell > /dev/null <<EOF
/home/$(whoami)/hoowell_son/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $(whoami) $(whoami)
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Nginx log monitoring
sudo tee /etc/logrotate.d/nginx > /dev/null <<EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF

echo -e "${GREEN}✅ Monitoring setup completed!${NC}"
echo "PM2 Dashboard: pm2 monit"
echo "Logs location: ~/hoowell_son/logs/"