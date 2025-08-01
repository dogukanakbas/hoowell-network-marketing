// HOOWELL Network Marketing - Yeni API Endpoints
// Frontend güncellemelerine göre yeni API endpoint'leri

const express = require('express');
const mysql = require('mysql2');

// Bu fonksiyonları server.js'den import edeceğiz
// const { verifyToken, verifyAdmin, db } = require('./server');

// Yeni API Endpoints - server.js dosyasına eklenecek

// 1. DOPING PROMOSYONU API ENDPOINTS
const dopingPromotionRoutes = `
// Doping Promosyonu - Kullanıcının mevcut durumunu getir
app.get('/api/doping-promotion/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [dopingData] = await db.promise().execute(\`
      SELECT 
        dp.*,
        u.first_name,
        u.last_name,
        u.created_at as user_start_date
      FROM doping_promotion dp
      JOIN users u ON dp.user_id = u.id
      WHERE dp.user_id = ? AND dp.is_active = TRUE
    \`, [userId]);

    if (dopingData.length === 0) {
      return res.status(404).json({ message: 'Doping promosyonu bulunamadı' });
    }

    const data = dopingData[0];
    
    // Etap durumlarını hesapla
    const now = new Date();
    const etap1End = new Date(data.etap1_end_date);
    const etap2End = new Date(data.etap2_end_date);
    
    res.json({
      etap1: {
        baslangic_tarihi: data.etap1_start_date,
        bitis_tarihi: data.etap1_end_date,
        hedef_satis: data.etap1_target_sales,
        yapilan_satis: data.etap1_achieved_sales,
        kalan_satis: Math.max(0, data.etap1_target_sales - data.etap1_achieved_sales),
        hedef_ortak: data.etap1_target_partners,
        yapilan_ortak: data.etap1_achieved_partners,
        kalan_ortak: Math.max(0, data.etap1_target_partners - data.etap1_achieved_partners),
        kazanilacak_puan: data.etap1_extra_points,
        tamamlandi: data.etap1_completed,
        sure_doldu: now > etap1End
      },
      etap2: {
        baslangic_tarihi: data.etap2_start_date,
        bitis_tarihi: data.etap2_end_date,
        hedef_satis: data.etap2_target_sales,
        yapilan_satis: data.etap2_achieved_sales,
        kalan_satis: Math.max(0, data.etap2_target_sales - data.etap2_achieved_sales),
        hedef_ortak: data.etap2_target_partners,
        yapilan_ortak: data.etap2_achieved_partners,
        kalan_ortak: Math.max(0, data.etap2_target_partners - data.etap2_achieved_partners),
        kazanilacak_puan: data.etap2_extra_points,
        tamamlandi: data.etap2_completed,
        sure_doldu: now > etap2End
      },
      toplam_extra_puan: data.total_extra_points
    });
  } catch (error) {
    console.error('Doping promotion progress error:', error);
    res.status(500).json({ error: 'Doping promosyonu verileri alınamadı' });
  }
});

// Doping Promosyonu - Manuel güncelleme (admin)
app.post('/api/doping-promotion/update', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, etap, field, value } = req.body;
    
    const validFields = [
      'etap1_achieved_sales', 'etap1_achieved_partners', 'etap1_extra_points',
      'etap2_achieved_sales', 'etap2_achieved_partners', 'etap2_extra_points'
    ];
    
    const fieldName = \`etap\${etap}_\${field}\`;
    
    if (!validFields.includes(fieldName)) {
      return res.status(400).json({ error: 'Geçersiz alan' });
    }
    
    await db.promise().execute(\`
      UPDATE doping_promotion 
      SET \${fieldName} = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    \`, [value, userId]);
    
    res.json({ message: 'Doping promosyonu güncellendi' });
  } catch (error) {
    console.error('Doping promotion update error:', error);
    res.status(500).json({ error: 'Güncelleme hatası' });
  }
});
`;

// 2. MEMNUN MÜŞTERİ TAKİP API ENDPOINTS
const customerSatisfactionRoutes = `
// Memnun Müşteri Takip - Kullanıcının müşterilerini getir
app.get('/api/customer-satisfaction/my-customers', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [customers] = await db.promise().execute(\`
      SELECT 
        c.id,
        c.customer_id,
        CASE 
          WHEN c.registration_type = 'individual' THEN CONCAT(c.first_name, ' ', c.last_name)
          ELSE c.company_name
        END as name,
        c.selected_product as product,
        DATE_FORMAT(c.created_at, '%d.%m.%Y') as date,
        c.referral_count as referrals,
        c.gift1_earned,
        c.gift1_recipient,
        c.gift2_earned,
        c.gift2_recipient,
        c.gift3_earned,
        c.gift3_recipient,
        c.loyalty_protection_until,
        c.total_amount,
        c.status
      FROM customers c
      WHERE c.created_by = ? AND c.status = 'confirmed'
      ORDER BY c.created_at DESC
    \`, [userId]);

    // İstatistikleri hesapla
    const stats = {
      total_customers: customers.length,
      total_referrals: customers.reduce((sum, c) => sum + (c.referrals || 0), 0),
      gift1_earned: customers.filter(c => c.gift1_earned).length,
      gift2_earned: customers.filter(c => c.gift2_earned).length,
      gift3_earned: customers.filter(c => c.gift3_earned).length
    };

    res.json({
      customers,
      stats
    });
  } catch (error) {
    console.error('Customer satisfaction fetch error:', error);
    res.status(500).json({ error: 'Müşteri verileri alınamadı' });
  }
});

// Müşteri referans güncelleme
app.post('/api/customer-satisfaction/update-referrals', verifyToken, async (req, res) => {
  try {
    const { customerId, referralCount } = req.body;
    const userId = req.user.id;
    
    // Müşterinin bu kullanıcıya ait olduğunu kontrol et
    const [customer] = await db.promise().execute(\`
      SELECT id, referral_count FROM customers 
      WHERE id = ? AND created_by = ?
    \`, [customerId, userId]);
    
    if (customer.length === 0) {
      return res.status(404).json({ error: 'Müşteri bulunamadı' });
    }
    
    // Referans sayısını güncelle
    await db.promise().execute(\`
      UPDATE customers 
      SET referral_count = ?,
          gift1_earned = CASE WHEN ? >= 1 THEN TRUE ELSE gift1_earned END,
          gift2_earned = CASE WHEN ? >= 2 THEN TRUE ELSE gift2_earned END,
          gift3_earned = CASE WHEN ? >= 3 THEN TRUE ELSE gift3_earned END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    \`, [referralCount, referralCount, referralCount, referralCount, customerId]);
    
    res.json({ message: 'Referans sayısı güncellendi' });
  } catch (error) {
    console.error('Update referrals error:', error);
    res.status(500).json({ error: 'Referans güncelleme hatası' });
  }
});
`;

// 3. SPONSORLUK TAKİP API ENDPOINTS
const sponsorshipTrackingRoutes = `
// Sponsorluk Takip - Kullanıcının sponsor olduğu partnerleri getir
app.get('/api/sponsorship/my-partners', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [partners] = await db.promise().execute(\`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.sponsor_id,
        u.phone,
        u.career_level,
        u.created_at,
        se.bronze_earnings,
        se.silver_earnings,
        se.gold_earnings,
        se.star_earnings,
        se.super_star_earnings,
        se.monthly_earnings,
        se.first_sale_activated,
        se.activation_date,
        se.partner_start_date,
        se.partner_education_status,
        se.total_earnings
      FROM users u
      LEFT JOIN sponsorship_earnings se ON u.id = se.partner_id AND se.sponsor_id = ?
      WHERE u.created_by = ? AND u.role = 'partner'
      ORDER BY u.created_at DESC
    \`, [userId, userId]);

    // Her partner için kazanç limitlerini kontrol et
    const partnersWithLimits = partners.map(partner => {
      const limits = {
        bronze_limit: 750,
        silver_limit: 1200,
        gold_limit: 1350,
        star_limit: 1200,
        super_star_limit: 750
      };
      
      return {
        ...partner,
        ...limits,
        bronze_earnings: partner.bronze_earnings || 0,
        silver_earnings: partner.silver_earnings || 0,
        gold_earnings: partner.gold_earnings || 0,
        star_earnings: partner.star_earnings || 0,
        super_star_earnings: partner.super_star_earnings || 0,
        total_earnings: partner.total_earnings || 0,
        first_sale_activated: !!partner.first_sale_activated
      };
    });

    res.json(partnersWithLimits);
  } catch (error) {
    console.error('Sponsorship tracking fetch error:', error);
    res.status(500).json({ error: 'Sponsorluk verileri alınamadı' });
  }
});

// Sponsorluk kazançlarını güncelle
app.post('/api/sponsorship/update-earnings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { sponsorId, partnerId, level, amount } = req.body;
    
    const validLevels = ['bronze', 'silver', 'gold', 'star', 'super_star'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ error: 'Geçersiz seviye' });
    }
    
    const fieldName = \`\${level}_earnings\`;
    
    await db.promise().execute(\`
      INSERT INTO sponsorship_earnings (sponsor_id, partner_id, \${fieldName})
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        \${fieldName} = ?,
        total_earnings = bronze_earnings + silver_earnings + gold_earnings + star_earnings + super_star_earnings,
        updated_at = CURRENT_TIMESTAMP
    \`, [sponsorId, partnerId, amount, amount]);
    
    res.json({ message: 'Sponsorluk kazancı güncellendi' });
  } catch (error) {
    console.error('Update sponsorship earnings error:', error);
    res.status(500).json({ error: 'Kazanç güncelleme hatası' });
  }
});
`;

// 4. SATIŞ TAKİP API ENDPOINTS
const salesTrackingRoutes = `
// Satış Takip - Kullanıcının satışlarını getir
app.get('/api/sales/tracker', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Bekleme odasındaki satışlar (15 gün dolmamış)
    const [pendingSales] = await db.promise().execute(\`
      SELECT 
        st.id,
        st.product_name,
        st.sale_amount,
        st.bonus_amount,
        st.sale_date,
        st.bonus_date,
        st.customer_name,
        st.status,
        DATEDIFF(st.bonus_date, CURDATE()) as days_remaining
      FROM sales_tracking st
      WHERE st.seller_id = ? 
      AND st.status = 'pending'
      AND st.bonus_date > CURDATE()
      ORDER BY st.sale_date DESC
    \`, [userId]);
    
    // Bu ay gerçekleşen satışlar (15 gün dolmuş, aktif)
    const [activeSales] = await db.promise().execute(\`
      SELECT 
        st.id,
        st.product_name,
        st.sale_amount,
        st.bonus_amount,
        st.sale_date,
        st.bonus_date,
        st.customer_name,
        st.status,
        st.payment_status
      FROM sales_tracking st
      WHERE st.seller_id = ? 
      AND st.status = 'active'
      AND MONTH(st.sale_date) = MONTH(CURDATE())
      AND YEAR(st.sale_date) = YEAR(CURDATE())
      ORDER BY st.sale_date DESC
    \`, [userId]);
    
    // Aylık aktiflik kontrolü
    const [monthlyActivity] = await db.promise().execute(\`
      SELECT 
        ma.is_active,
        ma.personal_sales_count,
        ma.partner_first_sales_count,
        ma.last_activity_date
      FROM monthly_activity ma
      WHERE ma.user_id = ? 
      AND ma.month_year = DATE_FORMAT(CURDATE(), '%Y-%m')
    \`, [userId]);
    
    const isActive = monthlyActivity.length > 0 ? monthlyActivity[0].is_active : false;
    
    res.json({
      pendingSales,
      activeSales,
      monthlyActivity: isActive,
      activityDetails: monthlyActivity[0] || null
    });
  } catch (error) {
    console.error('Sales tracking fetch error:', error);
    res.status(500).json({ error: 'Satış verileri alınamadı' });
  }
});

// Satış ekleme
app.post('/api/sales/add', verifyToken, async (req, res) => {
  try {
    const { 
      customerName, 
      productName, 
      saleAmount, 
      bonusAmount, 
      saleType = 'product_sale' 
    } = req.body;
    const sellerId = req.user.id;
    
    const saleDate = new Date();
    const bonusDate = new Date(saleDate.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 gün sonra
    
    await db.promise().execute(\`
      INSERT INTO sales_tracking (
        seller_id, customer_name, sale_type, product_name, 
        sale_amount, bonus_amount, sale_date, bonus_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    \`, [sellerId, customerName, saleType, productName, saleAmount, bonusAmount, saleDate, bonusDate]);
    
    res.json({ message: 'Satış başarıyla eklendi' });
  } catch (error) {
    console.error('Add sale error:', error);
    res.status(500).json({ error: 'Satış ekleme hatası' });
  }
});
`;

// 5. TAKIM TAKİP API ENDPOINTS
const teamTrackingRoutes = `
// Takım Takip - Kullanıcının takım verilerini getir
app.get('/api/team/tracker', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Takım üyelerini getir
    const [teamMembers] = await db.promise().execute(\`
      SELECT 
        u.id,
        u.sponsor_id,
        u.first_name,
        u.last_name,
        u.phone,
        u.career_level,
        u.created_at as start_date,
        u.total_kkp,
        u.active_partners,
        tt.franchise_percentage,
        tt.earning_percentage,
        tt.monthly_sales_volume,
        tt.monthly_franchise_income,
        tt.franchise_sales,
        tt.monthly_sales_kkp,
        tt.activated_partners,
        tt.is_active_this_month,
        up.education_completed
      FROM users u
      LEFT JOIN team_tracking tt ON u.id = tt.member_id AND tt.team_leader_id = ?
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.created_by = ? AND u.role = 'partner'
      ORDER BY u.created_at DESC
    \`, [userId, userId]);

    // Franchise yüzdelerini hesapla
    const membersWithCalculations = teamMembers.map(member => {
      const franchisePercentages = {
        bronze: 0,
        silver: 2,
        gold: 4,
        star_leader: 6,
        super_star_leader: 8,
        presidents_team: 10
      };
      
      return {
        ...member,
        franchise_percentage: franchisePercentages[member.career_level] || 0,
        education_status: member.education_completed ? 'completed' : 'in_progress'
      };
    });

    res.json(membersWithCalculations);
  } catch (error) {
    console.error('Team tracking fetch error:', error);
    res.status(500).json({ error: 'Takım verileri alınamadı' });
  }
});

// Takım üyesi istatistiklerini güncelle
app.post('/api/team/update-member', verifyToken, async (req, res) => {
  try {
    const { memberId, field, value } = req.body;
    const teamLeaderId = req.user.id;
    
    const validFields = [
      'monthly_sales_volume', 'monthly_franchise_income', 'franchise_sales',
      'monthly_sales_kkp', 'activated_partners', 'is_active_this_month'
    ];
    
    if (!validFields.includes(field)) {
      return res.status(400).json({ error: 'Geçersiz alan' });
    }
    
    await db.promise().execute(\`
      INSERT INTO team_tracking (team_leader_id, member_id, \${field})
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        \${field} = ?,
        updated_at = CURRENT_TIMESTAMP
    \`, [teamLeaderId, memberId, value, value]);
    
    res.json({ message: 'Takım üyesi güncellendi' });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Güncelleme hatası' });
  }
});
`;

// 6. KARİYER TAKİP API ENDPOINTS
const careerTrackingRoutes = `
// Kariyer Takip - Kullanıcının kariyer ilerlemesini getir
app.get('/api/career/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [userCareer] = await db.promise().execute(\`
      SELECT 
        u.career_level as current_level,
        u.total_kkp,
        u.active_partners,
        up.is_active_this_month
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ?
    \`, [userId]);
    
    if (userCareer.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    const user = userCareer[0];
    
    // Hedef KKP ve partner sayılarını belirle
    const targets = {
      bronze: { kkp: 15000, partners: 1 },
      silver: { kkp: 50000, partners: 3 },
      gold: { kkp: 100000, partners: 7 },
      star_leader: { kkp: 175000, partners: 15 },
      super_star_leader: { kkp: 300000, partners: 25 },
      presidents_team: { kkp: 400000, partners: 30 }
    };
    
    const currentTarget = targets[user.current_level];
    
    // Seviye yükseltme kontrolü
    let levelUpgraded = false;
    if (currentTarget && user.total_kkp >= currentTarget.kkp && user.active_partners >= currentTarget.partners) {
      // Seviye yükseltme işlemi burada yapılabilir
      levelUpgraded = true;
    }
    
    res.json({
      current_level: user.current_level,
      total_kkp: user.total_kkp,
      active_partners: user.active_partners,
      target_kkp: currentTarget ? currentTarget.kkp : 0,
      target_partners: currentTarget ? currentTarget.partners : 0,
      level_upgraded: levelUpgraded,
      is_active_this_month: user.is_active_this_month
    });
  } catch (error) {
    console.error('Career progress fetch error:', error);
    res.status(500).json({ error: 'Kariyer verileri alınamadı' });
  }
});

// Kariyer bonuslarını getir
app.get('/api/career/bonuses', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [bonuses] = await db.promise().execute(\`
      SELECT 
        cb.id,
        cb.career_level,
        cb.bonus_amount,
        cb.bonus_amount_usd,
        cb.bonus_amount_try,
        cb.kkp_threshold,
        cb.kkp_achieved,
        cb.status,
        cb.paid,
        cb.paid_at,
        cb.awarded_at
      FROM career_bonuses cb
      WHERE cb.user_id = ?
      ORDER BY cb.awarded_at DESC
    \`, [userId]);
    
    res.json(bonuses);
  } catch (error) {
    console.error('Career bonuses fetch error:', error);
    res.status(500).json({ error: 'Kariyer bonusları alınamadı' });
  }
});
`;

module.exports = {
  dopingPromotionRoutes,
  customerSatisfactionRoutes,
  sponsorshipTrackingRoutes,
  salesTrackingRoutes,
  teamTrackingRoutes,
  careerTrackingRoutes
};