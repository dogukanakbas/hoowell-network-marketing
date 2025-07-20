const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { sendNewRegistrationEmail } = require('./emailService');
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

// Müşteri ID oluşturma fonksiyonu
const generateCustomerId = async () => {
  try {
    // Son müşterinin ID'sini al
    const [lastCustomer] = await db.promise().execute(
      'SELECT customer_id FROM customers WHERE customer_id IS NOT NULL ORDER BY customer_id DESC LIMIT 1'
    );

    let nextNumber = 1;
    if (lastCustomer.length > 0) {
      // Son ID'den numarayı çıkar (C2025000001 -> 1)
      const lastId = lastCustomer[0].customer_id;
      const lastNumber = parseInt(lastId.substring(5)); // C2025 sonrasını al
      nextNumber = lastNumber + 1;
    }

    // Yeni ID oluştur: C2025 + 6 haneli numara
    const newId = `C2025${nextNumber.toString().padStart(6, '0')}`;
    return newId;
  } catch (error) {
    console.error('Generate customer ID error:', error);
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

    // Find user by username, email, or sponsor_id (Partner ID)
    const [users] = await db.promise().execute(
      'SELECT * FROM users WHERE username = ? OR email = ? OR sponsor_id = ?',
      [username, username, username]
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
      'SELECT id, username, email, first_name, last_name, phone, role, sponsor_id, career_level, total_kkp, active_partners, is_active, payment_confirmed, education_completed, backoffice_access, payment_pending, payment_blocked, education_deadline, education_started_at FROM users WHERE id = ?',
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
    const { payment_type, partner_id, total_amount, skip_receipt } = req.body;
    const receipt_path = req.file ? req.file.path : null;

    // Franchise payment için özel işlem
    if (payment_type === 'franchise') {
      if (!partner_id || !total_amount) {
        return res.status(400).json({ message: 'Partner ID ve tutar gerekli' });
      }

      // Partner için ödeme kaydı oluştur
      const [result] = await db.promise().execute(
        'INSERT INTO payments (user_id, payment_type, amount_usd, amount_try, vat_amount, total_amount, receipt_path, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [partner_id, 'franchise', 0, total_amount, 0, total_amount, null, 'pending']
      );

      res.json({
        message: 'Franchise ödeme kaydı oluşturuldu! Admin onayı bekleniyor.',
        payment_id: result.insertId,
        total_amount: total_amount
      });
      return;
    }

    // Normal ödeme işlemi
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
    const total_amount_calc = amount_try + vat_amount;

    // Insert payment record with pending status
    const [result] = await db.promise().execute(
      'INSERT INTO payments (user_id, payment_type, amount_usd, amount_try, vat_amount, total_amount, receipt_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, payment_type, amount_usd, amount_try, vat_amount, total_amount_calc, receipt_path, 'pending']
    );

    // Kullanıcıya otomatik eğitim erişimi ver ve eğitim başlangıç zamanını kaydet
    await db.promise().execute(
      'UPDATE users SET payment_confirmed = TRUE, education_completed = FALSE, payment_pending = TRUE, payment_blocked = FALSE, education_started_at = NOW(), education_deadline = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE id = ?',
      [req.user.id]
    );

    res.json({
      message: 'Ödeme makbuzu yüklendi! Eğitimlere erişiminiz açılmıştır. Ödemeniz kontrol edildikten sonra onaylanacaktır.',
      payment_id: result.insertId,
      total_amount: total_amount_calc
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
      'INSERT INTO users (username, email, password_hash, first_name, last_name, phone, sponsor_id, created_by, payment_confirmed, education_completed, education_deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, FALSE, DATE_ADD(NOW(), INTERVAL 7 DAY))',
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
        referrer_sponsor_id, payment_confirmed, education_completed, education_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, FALSE, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
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

// New Partner Registration API (6-step process)
app.post('/api/partner/register-new', async (req, res) => {
  try {
    const {
      registration_type,
      first_name,
      last_name,
      tc_no,
      email,
      phone,
      city,
      district,
      address,
      full_address,
      company_name,
      tax_office,
      tax_no,
      authorized_first_name,
      authorized_last_name,
      contract1_accepted,
      contract2_accepted,
      total_amount,
      contracts_accepted
    } = req.body;

    // Validate required fields
    if (!registration_type || !email || !phone || !city || !district || !address) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik' });
    }

    // Validate registration type specific fields
    if (registration_type === 'individual') {
      if (!first_name || !last_name || !tc_no) {
        return res.status(400).json({ message: 'Bireysel kayıt için gerekli alanlar eksik' });
      }
    } else if (registration_type === 'corporate') {
      if (!company_name || !tax_office || !tax_no || !authorized_first_name || !authorized_last_name) {
        return res.status(400).json({ message: 'Kurumsal kayıt için gerekli alanlar eksik' });
      }
    }

    // Validate contracts
    if (!contracts_accepted || !contract1_accepted || !contract2_accepted) {
      return res.status(400).json({ message: 'Sözleşme onayları gerekli' });
    }

    // Check if email already exists
    const [existingUser] = await db.promise().execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }

    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Generate unique sponsor ID
    const newSponsorId = await generateSponsorId();
    if (!newSponsorId) {
      return res.status(500).json({ message: 'Sponsor ID oluşturulamadı' });
    }

    // Generate username from email
    const username = email.split('@')[0] + '_' + Math.random().toString(36).slice(-4);

    // Prepare user data
    const userData = {
      username,
      email,
      password_hash: hashedPassword,
      first_name: registration_type === 'individual' ? first_name : authorized_first_name,
      last_name: registration_type === 'individual' ? last_name : authorized_last_name,
      phone,
      role: 'partner',
      sponsor_id: newSponsorId,
      partner_type: registration_type,
      registration_type,
      tc_no: registration_type === 'individual' ? tc_no : null,
      company_name: registration_type === 'corporate' ? company_name : null,
      tax_office: registration_type === 'corporate' ? tax_office : null,
      tax_no: registration_type === 'corporate' ? tax_no : null,
      authorized_first_name: registration_type === 'corporate' ? authorized_first_name : null,
      authorized_last_name: registration_type === 'corporate' ? authorized_last_name : null,
      city,
      district,
      full_address: full_address || `${address}, ${district}/${city}`,
      delivery_address: full_address || `${address}, ${district}/${city}`,
      billing_address: full_address || `${address}, ${district}/${city}`,
      contract1_accepted,
      contract2_accepted,
      total_amount: total_amount || 4800,
      registration_step: 6,
      registration_completed: true,
      payment_confirmed: false,
      education_completed: false,
      education_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      is_active: false,
      backoffice_access: false
    };

    // Insert new user
    const [result] = await db.promise().execute(`
      INSERT INTO users (
        username, email, password_hash, first_name, last_name, phone, role, sponsor_id,
        partner_type, registration_type, tc_no, company_name, tax_office, tax_no,
        authorized_first_name, authorized_last_name, city, district, full_address,
        delivery_address, billing_address, contract1_accepted, contract2_accepted,
        total_amount, registration_step, registration_completed, payment_confirmed,
        education_completed, education_deadline, is_active, backoffice_access, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userData.username, userData.email, userData.password_hash,
        userData.first_name, userData.last_name, userData.phone, userData.role,
        userData.sponsor_id, userData.partner_type, userData.registration_type,
        userData.tc_no, userData.company_name, userData.tax_office, userData.tax_no,
        userData.authorized_first_name, userData.authorized_last_name,
        userData.city, userData.district, userData.full_address,
        userData.delivery_address, userData.billing_address,
        userData.contract1_accepted, userData.contract2_accepted,
        userData.total_amount, userData.registration_step, userData.registration_completed,
        userData.payment_confirmed, userData.education_completed, userData.education_deadline,
        userData.is_active, userData.backoffice_access
      ]
    );

    // Send welcome email
    try {
      const emailData = {
        ...userData,
        sponsor_id: newSponsorId,
        username: userData.username
      };
      await sendNewRegistrationEmail(emailData, randomPassword);
      console.log(`Welcome email sent to: ${userData.email}`);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the registration if email fails
    }

    // Log the registration
    console.log(`New partner registered: ${userData.email} (${userData.sponsor_id})`);

    res.json({
      message: 'Kayıt başarıyla tamamlandı',
      partner_id: result.insertId,
      sponsor_id: newSponsorId,
      email: userData.email,
      registration_type: userData.registration_type,
      total_amount: userData.total_amount,
      password: randomPassword
    });

  } catch (error) {
    console.error('New partner registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('email')) {
        return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
      } else if (error.message.includes('sponsor_id')) {
        return res.status(400).json({ message: 'Sponsor ID çakışması, lütfen tekrar deneyin' });
      }
    }
    res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
  }
});

// Customer Registration API
app.post('/api/customer/register', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      registration_type,
      first_name,
      last_name,
      tc_no,
      email,
      phone,
      delivery_address,
      delivery_city,
      delivery_district,
      billing_address,
      billing_city,
      billing_district,
      same_address,
      company_name,
      tax_office,
      tax_no,
      authorized_person,
      authorized_email,
      authorized_phone,
      company_address,
      company_city,
      company_district,
      selected_product,
      product_price,
      product_vat,
      total_amount,
      contract1_accepted,
      contract2_accepted,
      references
    } = req.body;

    // Validate required fields
    if (!registration_type || !email || !phone || !delivery_city || !delivery_district || !delivery_address) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik' });
    }

    // Validate registration type specific fields
    if (registration_type === 'individual') {
      if (!first_name || !last_name || !tc_no) {
        return res.status(400).json({ message: 'Bireysel kayıt için gerekli alanlar eksik' });
      }
    } else if (registration_type === 'corporate') {
      if (!company_name || !tax_office || !tax_no || !authorized_person) {
        return res.status(400).json({ message: 'Kurumsal kayıt için gerekli alanlar eksik' });
      }
    }

    // Validate contracts
    if (!contract1_accepted || !contract2_accepted) {
      return res.status(400).json({ message: 'Sözleşme onayları gerekli' });
    }

    // Check if email already exists
    const [existingCustomer] = await db.promise().execute(
      'SELECT id FROM customers WHERE email = ?',
      [email]
    );

    if (existingCustomer.length > 0) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }

    // Generate unique customer ID
    const newCustomerId = await generateCustomerId();
    if (!newCustomerId) {
      return res.status(500).json({ message: 'Müşteri ID oluşturulamadı' });
    }

    // Generate order ID
    const orderId = `ORD${Date.now()}`;

    // Prepare customer data
    const customerData = {
      customer_id: newCustomerId,
      registration_type,
      first_name: registration_type === 'individual' ? first_name : null,
      last_name: registration_type === 'individual' ? last_name : null,
      tc_no: registration_type === 'individual' ? tc_no : null,
      email,
      phone,
      company_name: registration_type === 'corporate' ? company_name : null,
      tax_office: registration_type === 'corporate' ? tax_office : null,
      tax_no: registration_type === 'corporate' ? tax_no : null,
      authorized_person: registration_type === 'corporate' ? authorized_person : null,
      authorized_email: registration_type === 'corporate' ? authorized_email : null,
      authorized_phone: registration_type === 'corporate' ? authorized_phone : null,
      delivery_address,
      delivery_city,
      delivery_district,
      billing_address: same_address ? delivery_address : billing_address,
      billing_city: same_address ? delivery_city : billing_city,
      billing_district: same_address ? delivery_district : billing_district,
      same_address: same_address || false,
      selected_product,
      product_price: product_price || 0,
      product_vat: product_vat || 0,
      total_amount: total_amount || 0,
      contract1_accepted,
      contract2_accepted,
      created_by: req.user.id,
      order_id: orderId,
      status: 'pending'
    };

    // Insert customer record
    const [result] = await db.promise().execute(`
      INSERT INTO customers (
        customer_id, registration_type, first_name, last_name, tc_no, email, phone,
        company_name, tax_office, tax_no, authorized_person, authorized_email, authorized_phone,
        delivery_address, delivery_city, delivery_district, billing_address, billing_city, billing_district,
        same_address, selected_product, product_price, product_vat, total_amount,
        contract1_accepted, contract2_accepted, created_by, order_id, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        customerData.customer_id, customerData.registration_type,
        customerData.first_name, customerData.last_name, customerData.tc_no,
        customerData.email, customerData.phone,
        customerData.company_name, customerData.tax_office, customerData.tax_no,
        customerData.authorized_person, customerData.authorized_email, customerData.authorized_phone,
        customerData.delivery_address, customerData.delivery_city, customerData.delivery_district,
        customerData.billing_address, customerData.billing_city, customerData.billing_district,
        customerData.same_address, customerData.selected_product,
        customerData.product_price, customerData.product_vat, customerData.total_amount,
        customerData.contract1_accepted, customerData.contract2_accepted,
        customerData.created_by, customerData.order_id, customerData.status
      ]
    );

    const customerId = result.insertId;

    // Insert references if provided
    if (references && Array.isArray(references)) {
      for (const reference of references) {
        if (reference.name && reference.surname && reference.phone) {
          await db.promise().execute(
            'INSERT INTO customer_references (customer_id, reference_name, reference_surname, reference_phone) VALUES (?, ?, ?, ?)',
            [customerId, reference.name, reference.surname, reference.phone]
          );
        }
      }
    }

    // Log the registration
    console.log(`New customer registered: ${customerData.email} (${customerData.customer_id})`);

    res.json({
      message: 'Müşteri kaydı başarıyla tamamlandı',
      customer_id: customerId,
      customer_code: newCustomerId,
      order_id: orderId,
      email: customerData.email,
      registration_type: customerData.registration_type,
      total_amount: customerData.total_amount
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('email')) {
        return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
      } else if (error.message.includes('customer_id')) {
        return res.status(400).json({ message: 'Müşteri ID çakışması, lütfen tekrar deneyin' });
      }
    }
    res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
  }
});

// Get customers list (Admin only)
app.get('/api/admin/customers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [customers] = await db.promise().execute(`
      SELECT c.*, u.first_name as created_by_first_name, u.last_name as created_by_last_name
      FROM customers c 
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.created_by = ?
      ORDER BY c.created_at DESC
    `, [req.user.id]);

    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Get customer references
app.get('/api/admin/customers/:id/references', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const customerId = req.params.id;
    
    const [references] = await db.promise().execute(
      'SELECT * FROM customer_references WHERE customer_id = ? ORDER BY created_at',
      [customerId]
    );

    res.json(references);
  } catch (error) {
    console.error('Get customer references error:', error);
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