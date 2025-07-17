const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hoowell_network'
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'hoowell_secret_key';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Admin middleware
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin required.' });
  }
  next();
};

// Sponsor ID oluşturma fonksiyonu
const generateSponsorId = async () => {
  try {
    // Son kullanıcının ID'sini al
    const [lastUser] = await db.promise().execute(
      'SELECT sponsor_id FROM users WHERE sponsor_id IS NOT NULL ORDER BY sponsor_id DESC LIMIT 1'
    );
    
    let nextNumber = 1;
    if (lastUser.length > 0) {
      // Son ID'den numarayı çıkar (P2025000014 -> 14)
      const lastId = lastUser[0].sponsor_id;
      const lastNumber = parseInt(lastId.substring(5)); // P2025 sonrasını al
      nextNumber = lastNumber + 1;
    }
    
    // Yeni ID oluştur: P2025 + 6 haneli numara
    const newId = `P2025${nextNumber.toString().padStart(6, '0')}`;
    return newId;
  } catch (error) {
    console.error('Generate sponsor ID error:', error);
    return null;
  }
};

// Ödeme blok kontrolü middleware
const checkPaymentBlock = async (req, res, next) => {
  try {
    const [user] = await db.promise().execute(
      'SELECT payment_blocked, payment_pending FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (user[0] && user[0].payment_blocked) {
      return res.status(403).json({ 
        error: 'Ödemeniz reddedilmiştir. Lütfen geçerli bir ödeme makbuzu yükleyiniz.',
        blocked: true 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı kontrol hatası' });
  }
};

// Routes will be added here

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const [users] = await db.promise().execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Şifre hatalı' });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    delete user.password_hash;

    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const [users] = await db.promise().execute(
      'SELECT id, username, email, first_name, last_name, phone, role, sponsor_id, career_level, total_kkp, active_partners, is_active, payment_confirmed, education_completed, backoffice_access, payment_pending, payment_blocked FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Dashboard Routes
app.get('/api/dashboard/stats', verifyToken, async (req, res) => {
  try {
    // Get system statistics (these would be calculated from actual data)
    const stats = {
      liderlikHavuzu: 12000,
      baskanlikHavuzu: 8000,
      karPaylasimHavuzu: 5000
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// News Routes
app.get('/api/news', verifyToken, async (req, res) => {
  try {
    const [news] = await db.promise().execute(
      'SELECT * FROM news WHERE is_active = 1 ORDER BY created_at DESC LIMIT 10'
    );

    res.json(news);
  } catch (error) {
    console.error('News error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Videos Routes
app.get('/api/videos', verifyToken, checkPaymentBlock, async (req, res) => {
  try {
    // Sadece bloklu kullanıcıları engelle, diğerlerine izin ver
    const [videos] = await db.promise().execute(
      'SELECT * FROM videos WHERE is_active = 1 ORDER BY order_number'
    );

    res.json(videos);
  } catch (error) {
    console.error('Videos error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Payment Routes
app.post('/api/payments', verifyToken, upload.single('receipt'), async (req, res) => {
  try {
    const { payment_type } = req.body;
    const receipt_path = req.file ? req.file.path : null;

    // Get system settings
    const [settings] = await db.promise().execute(
      'SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN (?, ?, ?, ?)',
      ['usd_to_try_rate', 'vat_rate', 'education_price_usd', 'device_price_usd']
    );

    const settingsMap = {};
    settings.forEach(setting => {
      settingsMap[setting.setting_key] = parseFloat(setting.setting_value);
    });

    const usdRate = settingsMap.usd_to_try_rate;
    const vatRate = settingsMap.vat_rate;
    const educationPrice = settingsMap.education_price_usd;
    const devicePrice = settingsMap.device_price_usd;

    let amount_usd;
    if (payment_type === 'education') {
      amount_usd = educationPrice;
    } else if (payment_type === 'device') {
      amount_usd = devicePrice;
    } else {
      return res.status(400).json({ message: 'Geçersiz ödeme türü' });
    }

    const amount_try = amount_usd * usdRate;
    const vat_amount = amount_try * (vatRate / 100);
    const total_amount = amount_try + vat_amount;

    // Insert payment record with pending status
    const [result] = await db.promise().execute(
      'INSERT INTO payments (user_id, payment_type, amount_usd, amount_try, vat_amount, total_amount, receipt_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, payment_type, amount_usd, amount_try, vat_amount, total_amount, receipt_path, 'pending']
    );

    // Kullanıcıya otomatik eğitim erişimi ver
    await db.promise().execute(
      'UPDATE users SET payment_confirmed = TRUE, education_completed = FALSE, payment_pending = TRUE, payment_blocked = FALSE WHERE id = ?',
      [req.user.id]
    );

    res.json({ 
      message: 'Ödeme makbuzu yüklendi! Eğitimlere erişiminiz açılmıştır. Ödemeniz kontrol edildikten sonra onaylanacaktır.',
      payment_id: result.insertId,
      total_amount: total_amount
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.get('/api/payments/my', verifyToken, async (req, res) => {
  try {
    const [payments] = await db.promise().execute(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// System Settings Routes
app.get('/api/settings', verifyToken, async (req, res) => {
  try {
    const [settings] = await db.promise().execute(
      'SELECT setting_key, setting_value FROM system_settings'
    );

    const settingsMap = {};
    settings.forEach(setting => {
      settingsMap[setting.setting_key] = setting.setting_value;
    });

    res.json(settingsMap);
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin Routes
app.get('/api/admin/payments', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [payments] = await db.promise().execute(`
      SELECT p.*, u.first_name, u.last_name, u.username 
      FROM payments p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);

    res.json(payments);
  } catch (error) {
    console.error('Admin payments error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin ödeme onay endpoint'i
app.put('/api/admin/payments/:id/approve', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const paymentId = req.params.id;

    // Update payment status to approved
    await db.promise().execute(
      'UPDATE payments SET status = ?, verified_by = ?, verified_at = NOW() WHERE id = ?',
      ['approved', req.user.id, paymentId]
    );

    // Get payment details
    const [payments] = await db.promise().execute(
      'SELECT user_id FROM payments WHERE id = ?',
      [paymentId]
    );

    if (payments.length > 0) {
      // Kullanıcının pending durumunu kaldır ve blok durumunu temizle
      await db.promise().execute(
        'UPDATE users SET payment_pending = FALSE, payment_blocked = FALSE WHERE id = ?',
        [payments[0].user_id]
      );
    }

    res.json({ message: 'Ödeme onaylandı' });
  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin ödeme red endpoint'i
app.put('/api/admin/payments/:id/reject', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const paymentId = req.params.id;

    // Update payment status to rejected
    await db.promise().execute(
      'UPDATE payments SET status = ?, verified_by = ?, verified_at = NOW() WHERE id = ?',
      ['rejected', req.user.id, paymentId]
    );

    // Get payment details
    const [payments] = await db.promise().execute(
      'SELECT user_id FROM payments WHERE id = ?',
      [paymentId]
    );

    if (payments.length > 0) {
      // Kullanıcıyı blokla ve eğitim erişimini kapat
      await db.promise().execute(
        'UPDATE users SET payment_blocked = TRUE, payment_block_date = NOW(), payment_confirmed = FALSE WHERE id = ?',
        [payments[0].user_id]
      );
    }

    res.json({ message: 'Ödeme reddedildi, kullanıcı bloklandı' });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.post('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { username, email, first_name, last_name, phone, sponsor_id } = req.body;
    
    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Generate unique sponsor ID for new user
    const newSponsorId = await generateSponsorId();
    if (!newSponsorId) {
      return res.status(500).json({ message: 'Sponsor ID oluşturulamadı' });
    }

    const [result] = await db.promise().execute(
      'INSERT INTO users (username, email, password_hash, first_name, last_name, phone, sponsor_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, first_name, last_name, phone, newSponsorId, req.user.id]
    );

    res.json({ 
      message: 'Kullanıcı oluşturuldu',
      user_id: result.insertId,
      sponsor_id: newSponsorId,
      password: randomPassword
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = 'uploads/receipts';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Education Routes
app.get('/api/education/progress', verifyToken, async (req, res) => {
  try {
    const [progress] = await db.promise().execute(
      'SELECT * FROM user_video_progress WHERE user_id = ?',
      [req.user.id]
    );

    res.json(progress);
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.get('/api/videos/:id/questions', verifyToken, async (req, res) => {
  try {
    const videoId = req.params.id;
    
    // Her video için 20 sorudan random 10 tanesini seç
    const [questions] = await db.promise().execute(
      'SELECT * FROM questions WHERE video_id = ? ORDER BY RAND() LIMIT 10',
      [videoId]
    );

    res.json(questions);
  } catch (error) {
    console.error('Questions error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.post('/api/education/video-complete', verifyToken, async (req, res) => {
  try {
    const { video_id } = req.body;

    // Insert or update video progress
    await db.promise().execute(`
      INSERT INTO user_video_progress (user_id, video_id, watched, watched_at) 
      VALUES (?, ?, 1, NOW()) 
      ON DUPLICATE KEY UPDATE watched = 1, watched_at = NOW()
    `, [req.user.id, video_id]);

    res.json({ message: 'Video tamamlandı' });
  } catch (error) {
    console.error('Video complete error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.post('/api/education/submit-exam', verifyToken, async (req, res) => {
  try {
    const { video_id, answers } = req.body;

    // Get correct answers
    const [questions] = await db.promise().execute(
      'SELECT id, correct_answer FROM questions WHERE video_id = ?',
      [video_id]
    );

    // Calculate score
    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correctCount++;
      }
    });

    const score = correctCount;
    const passed = score >= 7;

    // Update user progress
    await db.promise().execute(`
      UPDATE user_video_progress 
      SET exam_taken = 1, exam_score = ?, exam_passed = ?, exam_taken_at = NOW() 
      WHERE user_id = ? AND video_id = ?
    `, [score, passed, req.user.id, video_id]);

    // Check if all videos are completed
    if (passed) {
      const [allProgress] = await db.promise().execute(
        'SELECT COUNT(*) as total FROM user_video_progress WHERE user_id = ? AND exam_passed = 1',
        [req.user.id]
      );

      const [totalVideos] = await db.promise().execute(
        'SELECT COUNT(*) as total FROM videos WHERE is_active = 1'
      );

      if (allProgress[0].total >= totalVideos[0].total) {
        // All videos completed, grant backoffice access
        await db.promise().execute(
          'UPDATE users SET education_completed = 1, backoffice_access = 1 WHERE id = ?',
          [req.user.id]
        );
      }
    }

    res.json({ score, passed, total: questions.length });
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Her admin sadece kendi oluşturduğu kullanıcıları görsün
    const [users] = await db.promise().execute(`
      SELECT u.*, s.first_name as sponsor_first_name, s.last_name as sponsor_last_name,
             c.first_name as created_by_first_name, c.last_name as created_by_last_name
      FROM users u 
      LEFT JOIN users s ON u.sponsor_id = s.id 
      LEFT JOIN users c ON u.created_by = c.id
      WHERE u.role = 'partner' AND u.created_by = ?
      ORDER BY u.created_at DESC
    `, [req.user.id]);

    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.put('/api/admin/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await db.promise().execute(
        'UPDATE system_settings SET setting_value = ? WHERE setting_key = ?',
        [value, key]
      );
    }

    res.json({ message: 'Ayarlar güncellendi' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Partner Registration API (Education completed users only)
app.post('/api/partner/register', verifyToken, async (req, res) => {
  try {
    // Check if user completed education
    const [userCheck] = await db.promise().execute(
      'SELECT education_completed FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!userCheck[0] || !userCheck[0].education_completed) {
      return res.status(403).json({ message: 'Eğitim tamamlama gerekli' });
    }

    const { 
      partner_type, 
      first_name, 
      last_name, 
      tc_no, 
      email, 
      phone, 
      delivery_address, 
      billing_address,
      company_name,
      tax_office,
      tax_no,
      authorized_person,
      referrer_sponsor_id
    } = req.body;

    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Generate unique sponsor ID for new partner
    const newSponsorId = await generateSponsorId();
    if (!newSponsorId) {
      return res.status(500).json({ message: 'Sponsor ID oluşturulamadı' });
    }

    // Prepare user data based on partner type
    let userData = {
      email,
      password_hash: hashedPassword,
      phone,
      role: 'partner',
      sponsor_id: newSponsorId,
      created_by: req.user.id,
      partner_type,
      delivery_address,
      billing_address,
      referrer_sponsor_id: referrer_sponsor_id || null
    };

    if (partner_type === 'individual') {
      userData.username = email;
      userData.first_name = first_name;
      userData.last_name = last_name;
      userData.tc_no = tc_no;
    } else if (partner_type === 'corporate') {
      userData.username = email;
      userData.first_name = authorized_person.split(' ')[0] || authorized_person;
      userData.last_name = authorized_person.split(' ').slice(1).join(' ') || '';
      userData.company_name = company_name;
      userData.tax_office = tax_office;
      userData.tax_no = tax_no;
      userData.authorized_person = authorized_person;
    }

    const [result] = await db.promise().execute(
      `INSERT INTO users (
        username, email, password_hash, first_name, last_name, phone, role, 
        sponsor_id, created_by, partner_type, tc_no, delivery_address, 
        billing_address, company_name, tax_office, tax_no, authorized_person, 
        referrer_sponsor_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.username, userData.email, userData.password_hash, 
        userData.first_name, userData.last_name, userData.phone, userData.role,
        userData.sponsor_id, userData.created_by, userData.partner_type,
        userData.tc_no || null, userData.delivery_address, userData.billing_address,
        userData.company_name || null, userData.tax_office || null, 
        userData.tax_no || null, userData.authorized_person || null,
        userData.referrer_sponsor_id
      ]
    );

    res.json({ 
      message: 'İş ortağı başarıyla kaydedildi',
      user_id: result.insertId,
      sponsor_id: newSponsorId,
      password: randomPassword
    });
  } catch (error) {
    console.error('Partner registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Bulk Questions Insert API (Admin only)
app.post('/api/admin/questions/bulk', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { video_id, questions } = req.body;
    
    // Delete existing questions for this video
    await db.promise().execute(
      'DELETE FROM questions WHERE video_id = ?',
      [video_id]
    );
    
    // Insert new questions
    for (const question of questions) {
      await db.promise().execute(
        'INSERT INTO questions (video_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [video_id, question.text, question.a, question.b, question.c, question.d, question.correct]
      );
    }
    
    res.json({ message: `${questions.length} soru başarıyla eklendi` });
  } catch (error) {
    console.error('Bulk questions error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});