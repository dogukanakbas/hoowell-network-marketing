// HOOWELL Network Marketing - Server.js'ye yeni endpoint'leri eklemek için script
// Bu dosyayı çalıştırarak server.js'ye yeni API endpoint'lerini ekleyebilirsiniz

const fs = require('fs');
const path = require('path');

// Yeni API endpoint'leri
const newEndpoints = `

// ==========================================
// YENİ API ENDPOINTS - FRONTEND GÜNCELLEMELERİ İÇİN
// ==========================================

// 1. DOPING PROMOSYONU API ENDPOINTS
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

// 2. MEMNUN MÜŞTERİ TAKİP API ENDPOINTS
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

    res.json(customers);
  } catch (error) {
    console.error('Customer satisfaction fetch error:', error);
    res.status(500).json({ error: 'Müşteri verileri alınamadı' });
  }
});

// 3. SPONSORLUK TAKİP API ENDPOINTS
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

// 4. SATIŞ TAKİP API ENDPOINTS
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

// 5. TAKIM TAKİP API ENDPOINTS
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
        u.education_completed
      FROM users u
      LEFT JOIN team_tracking tt ON u.id = tt.member_id AND tt.team_leader_id = ?
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

// 6. KARİYER TAKİP API ENDPOINTS
// Kariyer Takip - Kullanıcının kariyer ilerlemesini getir
app.get('/api/career/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [userCareer] = await db.promise().execute(\`
      SELECT 
        u.career_level as current_level,
        u.total_kkp,
        u.active_partners
      FROM users u
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
    
    res.json({
      current_level: user.current_level,
      total_kkp: user.total_kkp,
      active_partners: user.active_partners,
      target_kkp: currentTarget ? currentTarget.kkp : 0,
      target_partners: currentTarget ? currentTarget.partners : 0
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

// ==========================================
// YENİ API ENDPOINTS SONU
// ==========================================
`;

// Server.js dosyasını oku
const serverPath = path.join(__dirname, 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Yeni endpoint'leri server.js'nin sonuna ekle (app.listen'den önce)
const listenIndex = serverContent.lastIndexOf('app.listen');
if (listenIndex !== -1) {
  const beforeListen = serverContent.substring(0, listenIndex);
  const afterListen = serverContent.substring(listenIndex);
  
  serverContent = beforeListen + newEndpoints + '\n\n' + afterListen;
  
  // Güncellenmiş içeriği dosyaya yaz
  fs.writeFileSync(serverPath, serverContent);
  
  console.log('✅ Yeni API endpoint\'leri server.js dosyasına başarıyla eklendi!');
  console.log('📝 Eklenen endpoint\'ler:');
  console.log('   - /api/doping-promotion/progress');
  console.log('   - /api/customer-satisfaction/my-customers');
  console.log('   - /api/sponsorship/my-partners');
  console.log('   - /api/sales/tracker');
  console.log('   - /api/team/tracker');
  console.log('   - /api/career/progress');
  console.log('   - /api/career/bonuses');
  console.log('');
  console.log('🔄 Şimdi veritabanını güncellemek için şu komutu çalıştırın:');
  console.log('   mysql -u root -p hoowell_network < update_database_for_new_features.sql');
} else {
  console.error('❌ Server.js dosyasında app.listen bulunamadı!');
}