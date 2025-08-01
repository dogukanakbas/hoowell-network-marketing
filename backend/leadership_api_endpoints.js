// HOOWELL Network Marketing - Liderlik ve Başkanlık Havuzu API Endpoints
// Bu endpoint'leri server.js dosyasına ekleyin

const leadershipApiEndpoints = `
// ==========================================
// LİDERLİK VE BAŞKANLIK HAVUZU API ENDPOINTS
// ==========================================

// Liderlik Havuzları - Kullanıcının havuz verilerini getir
app.get('/api/leadership/pools', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Kullanıcının kariyer seviyesini kontrol et
    const [user] = await db.promise().execute(\`
      SELECT career_level, is_active FROM users WHERE id = ?
    \`, [userId]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    const userCareer = user[0].career_level;
    const allowedLevels = ['star_leader', 'super_star_leader', 'presidents_team'];
    
    if (!allowedLevels.includes(userCareer)) {
      return res.status(403).json({ 
        error: 'Bu sayfaya erişmek için STAR LİDER veya daha yüksek kariyer seviyesine sahip olmanız gerekiyor',
        required_level: 'star_leader',
        current_level: userCareer
      });
    }
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    // Kullanıcının bu ayki aktivitelerini getir
    const [userActivities] = await db.promise().execute(\`
      SELECT 
        COALESCE(ma.personal_sales_count, 0) as personal_sales,
        COALESCE(ma.partner_first_sales_count, 0) as activated_partners,
        COALESCE(ma.total_activity_points, 0) as total_action_points,
        COALESCE(ma.is_active, FALSE) as is_active
      FROM monthly_activity ma
      WHERE ma.user_id = ? AND ma.month_year = ?
    \`, [userId, currentMonth]);
    
    const activities = userActivities[0] || {
      personal_sales: 0,
      activated_partners: 0,
      total_action_points: 0,
      is_active: false
    };
    
    // Aksiyon puanlarını hesapla (1 satış = 1 puan, 1 partner = 2 puan)
    const calculatedActionPoints = activities.personal_sales + (activities.activated_partners * 2);
    const targetPoints = 5;
    const remainingPoints = Math.max(0, targetPoints - calculatedActionPoints);
    
    // Bu ayki toplam ciroyu hesapla (tüm sistem)
    const [totalRevenue] = await db.promise().execute(\`
      SELECT COALESCE(SUM(sale_amount), 0) as total_monthly_revenue
      FROM sales_tracking 
      WHERE DATE_FORMAT(sale_date, '%Y-%m') = ? 
      AND status = 'active'
    \`, [currentMonth]);
    
    const monthlyRevenue = totalRevenue[0].total_monthly_revenue || 0;
    
    // Liderlik havuzu (aylık cironun %0.75'i)
    const leadershipPoolAmount = monthlyRevenue * 0.0075;
    
    // Başkanlık havuzu (aylık cironun %1.25'i)
    const presidencyPoolAmount = monthlyRevenue * 0.0125;
    
    // Liderlik havuzuna katılan toplam kişi sayısı ve puan
    const [leadershipParticipants] = await db.promise().execute(\`
      SELECT 
        COUNT(*) as participant_count,
        COALESCE(SUM(ma.total_activity_points), 0) as total_action_points
      FROM monthly_activity ma
      JOIN users u ON ma.user_id = u.id
      WHERE ma.month_year = ? 
      AND u.career_level IN ('star_leader', 'super_star_leader')
      AND ma.total_activity_points >= 5
      AND ma.is_active = TRUE
    \`, [currentMonth]);
    
    // Başkanlık havuzuna katılan toplam kişi sayısı ve puan
    const [presidencyParticipants] = await db.promise().execute(\`
      SELECT 
        COUNT(*) as participant_count,
        COALESCE(SUM(ma.total_activity_points), 0) as total_action_points
      FROM monthly_activity ma
      JOIN users u ON ma.user_id = u.id
      WHERE ma.month_year = ? 
      AND u.career_level = 'presidents_team'
      AND ma.total_activity_points >= 5
      AND ma.is_active = TRUE
    \`, [currentMonth]);
    
    const leadershipStats = leadershipParticipants[0];
    const presidencyStats = presidencyParticipants[0];
    
    // Puan başına değer hesapla
    const leadershipPointValue = leadershipStats.total_action_points > 0 
      ? leadershipPoolAmount / leadershipStats.total_action_points 
      : 0;
      
    const presidencyPointValue = presidencyStats.total_action_points > 0 
      ? presidencyPoolAmount / presidencyStats.total_action_points 
      : 0;
    
    // Kullanıcının tahmini kazancı
    const userLeadershipEarning = calculatedActionPoints >= 5 && ['star_leader', 'super_star_leader'].includes(userCareer)
      ? calculatedActionPoints * leadershipPointValue 
      : 0;
      
    const userPresidencyEarning = calculatedActionPoints >= 5 && userCareer === 'presidents_team'
      ? calculatedActionPoints * presidencyPointValue 
      : 0;
    
    res.json({
      leadership_pool: {
        total_amount: leadershipPoolAmount,
        monthly_amount: leadershipPoolAmount,
        user_action_points: calculatedActionPoints,
        total_action_points: leadershipStats.total_action_points,
        point_value: leadershipPointValue,
        estimated_earning: userLeadershipEarning,
        participant_count: leadershipStats.participant_count
      },
      presidency_pool: {
        total_amount: presidencyPoolAmount,
        monthly_amount: presidencyPoolAmount,
        user_action_points: calculatedActionPoints,
        total_action_points: presidencyStats.total_action_points,
        point_value: presidencyPointValue,
        estimated_earning: userPresidencyEarning,
        participant_count: presidencyStats.participant_count
      },
      user_activities: {
        personal_sales: activities.personal_sales,
        activated_partners: activities.activated_partners,
        total_action_points: calculatedActionPoints,
        target_points: targetPoints,
        remaining_points: remainingPoints,
        is_qualified: calculatedActionPoints >= 5 && activities.is_active,
        is_active: activities.is_active
      },
      system_stats: {
        monthly_revenue: monthlyRevenue,
        current_month: currentMonth,
        user_career_level: userCareer
      }
    });
  } catch (error) {
    console.error('Leadership pools fetch error:', error);
    res.status(500).json({ error: 'Liderlik havuzu verileri alınamadı' });
  }
});

// Liderlik Havuzu - Aylık dağıtım hesaplama (Admin)
app.post('/api/leadership/calculate-distribution', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { month_year } = req.body;
    
    if (!month_year) {
      return res.status(400).json({ error: 'Ay bilgisi gerekli (YYYY-MM format)' });
    }
    
    // O ayki toplam ciroyu hesapla
    const [totalRevenue] = await db.promise().execute(\`
      SELECT COALESCE(SUM(sale_amount), 0) as total_monthly_revenue
      FROM sales_tracking 
      WHERE DATE_FORMAT(sale_date, '%Y-%m') = ? 
      AND status = 'active'
    \`, [month_year]);
    
    const monthlyRevenue = totalRevenue[0].total_monthly_revenue || 0;
    const leadershipPoolAmount = monthlyRevenue * 0.0075;
    const presidencyPoolAmount = monthlyRevenue * 0.0125;
    
    // Liderlik havuzu katılımcıları
    const [leadershipParticipants] = await db.promise().execute(\`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.sponsor_id,
        u.career_level,
        ma.total_activity_points,
        ma.personal_sales_count,
        ma.partner_first_sales_count
      FROM monthly_activity ma
      JOIN users u ON ma.user_id = u.id
      WHERE ma.month_year = ? 
      AND u.career_level IN ('star_leader', 'super_star_leader')
      AND ma.total_activity_points >= 5
      AND ma.is_active = TRUE
      ORDER BY ma.total_activity_points DESC
    \`, [month_year]);
    
    // Başkanlık havuzu katılımcıları
    const [presidencyParticipants] = await db.promise().execute(\`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.sponsor_id,
        u.career_level,
        ma.total_activity_points,
        ma.personal_sales_count,
        ma.partner_first_sales_count
      FROM monthly_activity ma
      JOIN users u ON ma.user_id = u.id
      WHERE ma.month_year = ? 
      AND u.career_level = 'presidents_team'
      AND ma.total_activity_points >= 5
      AND ma.is_active = TRUE
      ORDER BY ma.total_activity_points DESC
    \`, [month_year]);
    
    // Toplam puanları hesapla
    const totalLeadershipPoints = leadershipParticipants.reduce((sum, p) => sum + p.total_action_points, 0);
    const totalPresidencyPoints = presidencyParticipants.reduce((sum, p) => sum + p.total_action_points, 0);
    
    // Puan başına değerleri hesapla
    const leadershipPointValue = totalLeadershipPoints > 0 ? leadershipPoolAmount / totalLeadershipPoints : 0;
    const presidencyPointValue = totalPresidencyPoints > 0 ? presidencyPoolAmount / totalPresidencyPoints : 0;
    
    // Katılımcıların kazançlarını hesapla
    const leadershipDistribution = leadershipParticipants.map(participant => ({
      ...participant,
      point_value: leadershipPointValue,
      earning: participant.total_action_points * leadershipPointValue
    }));
    
    const presidencyDistribution = presidencyParticipants.map(participant => ({
      ...participant,
      point_value: presidencyPointValue,
      earning: participant.total_action_points * presidencyPointValue
    }));
    
    res.json({
      month_year,
      monthly_revenue: monthlyRevenue,
      leadership_pool: {
        total_amount: leadershipPoolAmount,
        total_points: totalLeadershipPoints,
        point_value: leadershipPointValue,
        participant_count: leadershipParticipants.length,
        distribution: leadershipDistribution
      },
      presidency_pool: {
        total_amount: presidencyPoolAmount,
        total_points: totalPresidencyPoints,
        point_value: presidencyPointValue,
        participant_count: presidencyParticipants.length,
        distribution: presidencyDistribution
      }
    });
  } catch (error) {
    console.error('Leadership distribution calculation error:', error);
    res.status(500).json({ error: 'Dağıtım hesaplama hatası' });
  }
});

// Kullanıcının aksiyon puanlarını güncelle
app.post('/api/leadership/update-action-points', verifyToken, async (req, res) => {
  try {
    const { personal_sales, activated_partners } = req.body;
    const userId = req.user.id;
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Aksiyon puanlarını hesapla
    const totalActionPoints = personal_sales + (activated_partners * 2);
    const isActive = totalActionPoints > 0;
    
    // Monthly activity tablosunu güncelle
    await db.promise().execute(\`
      INSERT INTO monthly_activity (
        user_id, month_year, personal_sales_count, partner_first_sales_count, 
        total_activity_points, is_active, last_activity_date
      ) VALUES (?, ?, ?, ?, ?, ?, CURDATE())
      ON DUPLICATE KEY UPDATE
        personal_sales_count = ?,
        partner_first_sales_count = ?,
        total_activity_points = ?,
        is_active = ?,
        last_activity_date = CURDATE(),
        updated_at = CURRENT_TIMESTAMP
    \`, [
      userId, currentMonth, personal_sales, activated_partners, 
      totalActionPoints, isActive,
      personal_sales, activated_partners, totalActionPoints, isActive
    ]);
    
    res.json({ 
      message: 'Aksiyon puanları güncellendi',
      total_action_points: totalActionPoints,
      is_qualified: totalActionPoints >= 5
    });
  } catch (error) {
    console.error('Update action points error:', error);
    res.status(500).json({ error: 'Aksiyon puanları güncelleme hatası' });
  }
});

// ==========================================
// LİDERLİK VE BAŞKANLIK HAVUZU API ENDPOINTS SONU
// ==========================================
`;

module.exports = leadershipApiEndpoints;