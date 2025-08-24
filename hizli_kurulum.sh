#!/bin/bash

echo "⚡ HIZLI KURULUM BAŞLIYOR..."

# 1. Backend restart
pm2 restart hoowell-backend

# 2. Frontend build
cd /root/hoowell/frontend && npm run build

# 3. TREPS test
cd /root/hoowell && node test_treps_new.js

# 4. Nginx restart
systemctl restart nginx

echo "✅ Kurulum tamamlandı!"
echo "🌐 Test: https://panel.hoowell.net/customer-registration"
