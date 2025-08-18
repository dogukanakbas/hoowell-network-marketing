w#!/bin/bash

echo "=== 502 GATEWAY HATASI TANI SCRIPTİ ==="
echo ""

# 1. PM2 DURUMU
echo "1. PM2 Process Durumu:"
pm2 list
echo ""

# 2. PORT KONTROLÜ
echo "2. Port Kontrolü:"
echo "Backend Port 5001:"
netstat -tlnp | grep :5001 || echo "❌ Port 5001 açık değil"
echo ""
echo "Frontend Port 3000:"
netstat -tlnp | grep :3000 || echo "❌ Port 3000 açık değil"
echo ""

# 3. BACKEND TEST
echo "3. Backend API Testi:"
curl -I http://localhost:5001/api/auth/me 2>/dev/null || echo "❌ Backend API çalışmıyor"
echo ""

# 4. FRONTEND TEST
echo "4. Frontend Testi:"
curl -I http://localhost:3000 2>/dev/null || echo "❌ Frontend çalışmıyor"
echo ""

# 5. NGINX DURUMU
echo "5. Nginx Durumu:"
systemctl status nginx --no-pager -l
echo ""

# 6. NGINX SYNTAX
echo "6. Nginx Syntax Kontrolü:"
nginx -t
echo ""

# 7. NGINX LOGLARI (son 10 satır)
echo "7. Nginx Error Logları (son 10 satır):"
tail -10 /var/log/nginx/error.log
echo ""

# 8. PM2 LOGLARI (son 5 satır)
echo "8. Backend Logları (son 5 satır):"
pm2 logs hoowell-backend --lines 5 --nostream
echo ""

# 9. FIREWALL KONTROLÜ
echo "9. Firewall Durumu:"
ufw status
echo ""

# 10. DISK ALANI
echo "10. Disk Alanı:"
df -h /
echo ""

echo "=== TANI TAMAMLANDI ==="
