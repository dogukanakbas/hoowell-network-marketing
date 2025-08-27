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
app.use(cors({
  origin: ['https://panel.hoowell.net', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Farklı dosya türleri için farklı klasörler
    if (file.fieldname === 'tc_identity_front' || file.fieldname === 'tax_plate') {
      cb(null, 'uploads/accounting/');
    } else {
      cb(null, 'uploads/receipts/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece JPG, PNG ve PDF dosyaları yüklenebilir.'), false);
    }
  }
});

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hoowell_network',
  connectTimeout: 60000,
  charset: 'utf8mb4'
});

// Database connection error handling
db.on('error', (err) => {
  console.error('Database connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect to database...');
    // Yeniden bağlanma denemesi
    setTimeout(() => {
      db.connect((err) => {
        if (err) {
          console.error('Reconnection failed:', err);
        } else {
          console.log('Reconnected to database');
        }
      });
    }, 2000);
  }
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

// PayTR Routes
const paytrRoutes = require('./routes/paytr');
app.use('/api/paytr', paytrRoutes);

// TREPS Routes
const trepsRoutes = require('./routes/treps');
app.use('/api/treps', trepsRoutes);

// Network Tree Routes
app.get('/api/network/tree', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Recursive function to build COMPLETE downline tree structure
    const buildDownlineTree = async (parentId, level = 1, maxLevel = 10) => {
      // Prevent infinite recursion
      if (level > maxLevel) return [];

      const [users] = await db.promise().execute(`
        SELECT 
          u.id as user_id,
          u.first_name,
          u.last_name,
          u.sponsor_id,
          u.career_level,
          u.total_kkp,
          u.created_at,
          u.phone,
          u.email,
          up.profile_photo,
          up.total_sales,
          up.monthly_sales,
          up.team_size,
          up.is_active_this_month,
          sponsor.first_name as sponsor_first_name,
          sponsor.last_name as sponsor_last_name,
          sponsor.sponsor_id as sponsor_sponsor_id
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN users sponsor ON u.created_by = sponsor.id
        WHERE u.created_by = ? AND u.role = 'partner'
        ORDER BY u.created_at ASC
      `, [parentId]);

      const treeNodes = [];
      for (const user of users) {
        // Recursively get ALL children (complete downline)
        const children = await buildDownlineTree(user.user_id, level + 1, maxLevel);

        // Calculate total downline count
        const totalDownline = children.reduce((total, child) => {
          return total + 1 + (child.total_downline || 0);
        }, children.length);

        treeNodes.push({
          ...user,
          level,
          children,
          total_downline: totalDownline,
          direct_partners: children.length
        });
      }

      return treeNodes;
    };

    // Get current user info
    const [currentUser] = await db.promise().execute(`
      SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.sponsor_id,
        u.career_level,
        u.total_kkp,
        u.created_at,
        u.phone,
        u.email,
        up.profile_photo,
        up.total_sales,
        up.monthly_sales,
        up.team_size,
        up.is_active_this_month,
        sponsor.first_name as sponsor_first_name,
        sponsor.last_name as sponsor_last_name,
        sponsor.sponsor_id as sponsor_sponsor_id
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN users sponsor ON u.created_by = sponsor.id
      WHERE u.id = ?
    `, [userId]);

    if (currentUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build COMPLETE downline tree starting from current user
    const children = await buildDownlineTree(userId);

    // Calculate total downline for current user
    const totalDownline = children.reduce((total, child) => {
      return total + 1 + (child.total_downline || 0);
    }, children.length);

    const treeData = {
      ...currentUser[0],
      level: 1,
      children,
      total_downline: totalDownline,
      direct_partners: children.length
    };

    res.json(treeData);
  } catch (error) {
    console.error('Network tree error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/network/user-details/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const [userDetails] = await db.promise().execute(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.sponsor_id,
        u.career_level,
        u.total_kkp,
        u.created_at,
        COALESCE(up.profile_photo, '') as profile_photo,
        COALESCE(up.join_date, u.created_at) as join_date,
        up.last_login,
        COALESCE(up.total_sales, 0) as total_sales,
        COALESCE(up.monthly_sales, 0) as monthly_sales,
        COALESCE(up.team_size, 0) as team_size,
        COALESCE(up.active_team_members, 0) as active_team_members,
        COALESCE(up.personal_volume, 0) as personal_volume,
        COALESCE(up.team_volume, 0) as team_volume,
        COALESCE(up.notes, '') as notes,
        COALESCE(sponsor.first_name, '') as sponsor_first_name,
        COALESCE(sponsor.last_name, '') as sponsor_last_name,
        -- Calculate real-time activity status
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM sales_tracking st 
            WHERE st.seller_id = u.id 
            AND MONTH(st.sale_date) = MONTH(NOW()) 
            AND YEAR(st.sale_date) = YEAR(NOW())
          ) OR EXISTS (
            SELECT 1 FROM customers c 
            WHERE c.created_by = u.id 
            AND MONTH(c.created_at) = MONTH(NOW()) 
            AND YEAR(c.created_at) = YEAR(NOW())
          ) THEN TRUE
          ELSE FALSE
        END as is_active_this_month
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN users sponsor ON u.created_by = sponsor.id
      WHERE u.id = ?
    `, [userId]);

    if (userDetails.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userDetails[0];
    user.sponsor_name = user.sponsor_first_name && user.sponsor_last_name ?
      `${user.sponsor_first_name} ${user.sponsor_last_name}` : null;
    user.join_date = user.join_date || user.created_at;

    res.json(user);
  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize user profiles for existing users
app.post('/api/network/initialize-profiles', verifyToken, async (req, res) => {
  try {
    // Only admin can initialize profiles
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [users] = await db.promise().execute(`
      SELECT id, created_at FROM users WHERE role = 'partner'
    `);

    for (const user of users) {
      // Check if profile already exists
      const [existing] = await db.promise().execute(`
        SELECT id FROM user_profiles WHERE user_id = ?
      `, [user.id]);

      if (existing.length === 0) {
        // Create profile
        await db.promise().execute(`
          INSERT INTO user_profiles (
            user_id, 
            join_date, 
            total_sales, 
            team_size, 
            is_active_this_month
          ) VALUES (?, ?, 0, 0, FALSE)
        `, [user.id, user.created_at]);
      }
    }

    res.json({ message: 'Profiles initialized successfully' });
  } catch (error) {
    console.error('Initialize profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// KKP Award Functions
const awardKKPForCustomerSale = async (userId, productPrice) => {
  try {
    // KKP calculation: 1 KKP = 1 USD (net price, excluding VAT)
    // productPrice is already in USD (net amount)
    let kkpEarned = productPrice;

    // Check for doping promotion multiplier
    const dopingMultiplier = await checkDopingPromotionMultiplier(userId);
    if (dopingMultiplier > 1) {
      kkpEarned = kkpEarned * dopingMultiplier;
      console.log(`Doping promotion applied: ${dopingMultiplier}x multiplier for user ${userId}`);
    }

    // Update user's total KKP
    await db.promise().execute(
      'UPDATE users SET total_kkp = total_kkp + ? WHERE id = ?',
      [kkpEarned, userId]
    );

    console.log(`KKP awarded: User ${userId} earned ${kkpEarned} KKP from customer sale (${productPrice} USD net, multiplier: ${dopingMultiplier}x)`);

    return kkpEarned;
  } catch (error) {
    console.error('Award KKP error:', error);
    return 0;
  }
};

// Check if user qualifies for doping promotion multiplier
const checkDopingPromotionMultiplier = async (userId) => {
  try {
    // Get user registration date
    const [userInfo] = await db.promise().execute(
      'SELECT created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!userInfo[0]) return 1;

    const registrationDate = new Date(userInfo[0].created_at);
    const now = new Date();
    const daysSinceRegistration = Math.floor((now - registrationDate) / (1000 * 60 * 60 * 24));

    // Get personal sales count
    const [personalSales] = await db.promise().execute(`
      SELECT COUNT(*) as count
      FROM customers c
      WHERE c.created_by = ? AND c.selected_product = 'device'
    `, [userId]);

    // Get team sales count
    const [teamSales] = await db.promise().execute(`
      SELECT COUNT(*) as count
      FROM customers c
      INNER JOIN users u ON c.created_by = u.id
      WHERE u.created_by = ? AND c.selected_product = 'device'
    `, [userId]);

    // Get personal partners count
    const [personalPartners] = await db.promise().execute(`
      SELECT COUNT(*) as count
      FROM users u
      WHERE u.created_by = ? AND u.role = 'partner'
    `, [userId]);

    const totalSales = personalSales[0].count + teamSales[0].count;
    const totalPartners = personalPartners[0].count;

    // Stage 1: First 60 days - 40 sales + 7 partners = 2x multiplier
    if (daysSinceRegistration <= 60 && totalSales >= 40 && totalPartners >= 7) {
      return 2;
    }

    // Stage 2: 61-120 days - 80 sales + 15 partners = 2x multiplier
    if (daysSinceRegistration > 60 && daysSinceRegistration <= 120 && totalSales >= 80 && totalPartners >= 15) {
      return 2;
    }

    return 1; // No multiplier
  } catch (error) {
    console.error('Check doping promotion multiplier error:', error);
    return 1;
  }
};

const awardKKPForPartnerRegistration = async (userId) => {
  try {
    // Partner registration gives fixed KKP (100 KKP = 100 USD equivalent)
    let kkpEarned = 100;

    // Check for doping promotion multiplier
    const dopingMultiplier = await checkDopingPromotionMultiplier(userId);
    if (dopingMultiplier > 1) {
      kkpEarned = kkpEarned * dopingMultiplier;
      console.log(`Doping promotion applied: ${dopingMultiplier}x multiplier for partner registration by user ${userId}`);
    }

    // Update user's total KKP
    await db.promise().execute(
      'UPDATE users SET total_kkp = total_kkp + ? WHERE id = ?',
      [kkpEarned, userId]
    );

    console.log(`KKP awarded: User ${userId} earned ${kkpEarned} KKP from partner registration (multiplier: ${dopingMultiplier}x)`);

    return kkpEarned;
  } catch (error) {
    console.error('Award KKP for partner error:', error);
    return 0;
  }
};

const createSalesTrackingRecord = async (sellerId, customerId, saleType, productName, saleAmount) => {
  try {
    // Calculate bonus date (15 days after sale)
    const bonusDate = new Date();
    bonusDate.setDate(bonusDate.getDate() + 15);

    // Calculate bonus amount based on sale type and USD conversion
    const usdRate = 40; // TL to USD rate
    const saleAmountUSD = saleAmount / usdRate;

    let bonusAmount = 0;
    if (saleType === 'education_package') {
      bonusAmount = saleAmountUSD * 0.1; // 10% for education packages (USD)
    } else if (saleType === 'partner_registration') {
      bonusAmount = saleAmountUSD * 0.15; // 15% for partner registrations (USD)
    } else {
      bonusAmount = saleAmountUSD * 0.08; // 8% for other sales (USD)
    }

    // Convert bonus back to TL for display
    const bonusAmountTL = bonusAmount * usdRate;

    // Insert into sales_tracking table
    await db.promise().execute(`
      INSERT INTO sales_tracking (
        seller_id, customer_id, partner_id, sale_type, product_name, 
        sale_amount, bonus_amount, sale_date, bonus_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'pending')
    `, [
      sellerId,
      saleType === 'partner_registration' ? null : customerId,
      saleType === 'partner_registration' ? customerId : null,
      saleType,
      productName,
      saleAmount,
      bonusAmountTL, // TL cinsinden bonus
      bonusDate
    ]);

    console.log(`Sales tracking record created: Seller ${sellerId}, Type ${saleType}, Amount ${saleAmount} TL, Bonus ${bonusAmountTL} TL`);

  } catch (error) {
    console.error('Create sales tracking error:', error);
  }
};

const updateUserActivityStatus = async (userId) => {
  try {
    // Check if user has any sales this month
    const [salesThisMonth] = await db.promise().execute(`
      SELECT COUNT(*) as count FROM sales_tracking 
      WHERE seller_id = ? AND MONTH(sale_date) = MONTH(NOW()) AND YEAR(sale_date) = YEAR(NOW())
    `, [userId]);

    const isActive = salesThisMonth[0].count > 0;

    // Update user profile
    await db.promise().execute(`
      UPDATE user_profiles SET is_active_this_month = ? WHERE user_id = ?
    `, [isActive, userId]);

    console.log(`Activity status updated: User ${userId} is ${isActive ? 'active' : 'inactive'} this month`);
  } catch (error) {
    console.error('Update activity status error:', error);
  }
};

// Sponsorship Earnings Calculation Functions - IMPROVED WITH DOWNLINE
const calculateSponsorshipEarnings = async (partnerId, saleAmount, saleType) => {
  try {
    // Get partner info
    const [partner] = await db.promise().execute(
      'SELECT created_by, career_level FROM users WHERE id = ?',
      [partnerId]
    );

    if (!partner[0] || !partner[0].created_by) {
      return; // No sponsor
    }

    const sponsorId = partner[0].created_by;
    const partnerLevel = partner[0].career_level;

    // RECURSIVE DOWNLINE COMMISSION CALCULATION
    await calculateDownlineCommissions(sponsorId, saleAmount, saleType, 1, partnerId, partnerLevel);

  } catch (error) {
    console.error('Calculate sponsorship earnings error:', error);
  }
};

// New function for recursive downline commissions
const calculateDownlineCommissions = async (currentSponsorId, saleAmount, saleType, level, originalPartnerId, partnerLevel) => {
  try {
    // Maximum levels for commission (prevent infinite recursion)
    const MAX_LEVELS = 5;
    if (level > MAX_LEVELS) return;

    // Get current sponsor info
    const [sponsor] = await db.promise().execute(
      'SELECT id, career_level, created_by FROM users WHERE id = ?',
      [currentSponsorId]
    );

    if (!sponsor[0]) return;

    const sponsorLevel = sponsor[0].career_level;
    const nextSponsorId = sponsor[0].created_by;

    // Calculate bonus based on partner's level and sponsor's eligibility
    const bonusPercentages = {
      bronze: 0.05,    // 5%
      silver: 0.04,    // 4%
      gold: 0.03,      // 3%
      star_leader: 0.02, // 2%
      super_star_leader: 0.01 // 1%
    };

    const maxEarnings = {
      bronze: 750,
      silver: 1200,
      gold: 1350,
      star_leader: 1200,
      super_star_leader: 750
    };

    // Convert TL to USD for calculation
    const saleAmountUSD = saleAmount / 40;

    // Calculate bonus for each level up to partner's current level
    const levels = ['bronze', 'silver', 'gold', 'star_leader', 'super_star_leader'];
    const partnerLevelIndex = levels.indexOf(partnerLevel || 'bronze'); // Default to bronze if undefined

    if (partnerLevelIndex === -1) {
      return; // Invalid level
    }

    // Calculate bonuses for each level
    for (let i = 0; i <= partnerLevelIndex; i++) {
      const level = levels[i];
      const bonusPercentage = bonusPercentages[level];
      const maxEarning = maxEarnings[level];

      if (bonusPercentage && maxEarning) {
        const bonusAmount = saleAmountUSD * bonusPercentage;

        // Get current earnings for this level
        const [currentEarnings] = await db.promise().execute(
          `SELECT ${level}_earnings FROM sponsorship_earnings WHERE sponsor_id = ? AND partner_id = ?`,
          [currentSponsorId, originalPartnerId]
        );

        if (currentEarnings.length > 0) {
          const currentAmount = currentEarnings[0][`${level}_earnings`] || 0;
          const newAmount = Math.min(currentAmount + bonusAmount, maxEarning);

          // Update earnings
          await db.promise().execute(
            `UPDATE sponsorship_earnings SET ${level}_earnings = ?, monthly_earnings = monthly_earnings + ? WHERE sponsor_id = ? AND partner_id = ?`,
            [newAmount, bonusAmount, currentSponsorId, originalPartnerId]
          );

          console.log(`Sponsorship bonus: ${bonusAmount} USD added to ${level} level for sponsor ${currentSponsorId} from partner ${originalPartnerId}`);
        }
      }
    }

    // Activate first sale if this is the first sale
    await db.promise().execute(`
      UPDATE sponsorship_earnings 
      SET first_sale_activated = TRUE, activation_date = NOW() 
      WHERE sponsor_id = ? AND partner_id = ? AND first_sale_activated = FALSE
    `, [currentSponsorId, originalPartnerId]);

  } catch (error) {
    console.error('Calculate sponsorship earnings error:', error);
  }
};

const initializeUserProfile = async (userId) => {
  try {
    // Create user profile if not exists
    await db.promise().execute(`
      INSERT IGNORE INTO user_profiles (
        user_id, join_date, total_sales, team_size, is_active_this_month
      ) VALUES (?, DATE(NOW()), 0, 0, FALSE)
    `, [userId]);

    // Create sponsorship earnings record if user has a sponsor
    const [user] = await db.promise().execute(
      'SELECT created_by FROM users WHERE id = ?',
      [userId]
    );

    if (user[0] && user[0].created_by) {
      await db.promise().execute(`
        INSERT IGNORE INTO sponsorship_earnings (
          sponsor_id, partner_id, bronze_earnings, silver_earnings, 
          gold_earnings, star_earnings, super_star_earnings, 
          monthly_earnings, first_sale_activated
        ) VALUES (?, ?, 0, 0, 0, 0, 0, 0, FALSE)
      `, [user[0].created_by, userId]);
    }

    console.log(`User profile initialized: User ${userId}`);
  } catch (error) {
    console.error('Initialize user profile error:', error);
  }
};

// Network Tree Functions
const addToNetworkTree = async (userId, sponsorId) => {
  try {
    // Get sponsor's tree info
    const [sponsorTree] = await db.promise().execute(
      'SELECT level, tree_path FROM network_tree WHERE user_id = ?',
      [sponsorId]
    );

    let level = 1;
    let treePath = userId.toString();

    if (sponsorTree.length > 0) {
      level = sponsorTree[0].level + 1;
      treePath = `${sponsorTree[0].tree_path}/${userId}`;
    }

    // Insert into network tree
    await db.promise().execute(`
      INSERT INTO network_tree (
        user_id, parent_id, sponsor_id, level, tree_path, 
        left_count, right_count, total_downline
      ) VALUES (?, ?, ?, ?, ?, 0, 0, 0)
    `, [userId, sponsorId, sponsorId, level, treePath]);

    console.log(`Added to network tree: User ${userId} under sponsor ${sponsorId} at level ${level}`);
  } catch (error) {
    console.error('Add to network tree error:', error);
  }
};

const updateDownlineCounts = async (sponsorId) => {
  try {
    // Count direct downline
    const [directCount] = await db.promise().execute(
      'SELECT COUNT(*) as count FROM users WHERE created_by = ? AND role = "partner"',
      [sponsorId]
    );

    // Count total downline recursively
    const getTotalDownline = async (userId) => {
      const [children] = await db.promise().execute(
        'SELECT id FROM users WHERE created_by = ? AND role = "partner"',
        [userId]
      );

      let total = children.length;
      for (const child of children) {
        total += await getTotalDownline(child.id);
      }
      return total;
    };

    const totalDownline = await getTotalDownline(sponsorId);

    // Update network tree
    await db.promise().execute(
      'UPDATE network_tree SET total_downline = ? WHERE user_id = ?',
      [totalDownline, sponsorId]
    );

    // Update user's active partners count
    await db.promise().execute(
      'UPDATE users SET active_partners = ? WHERE id = ?',
      [directCount[0].count, sponsorId]
    );

    console.log(`Updated downline counts: User ${sponsorId} has ${totalDownline} total downline`);
  } catch (error) {
    console.error('Update downline counts error:', error);
  }
};

// Personal Management API Endpoints

// Get user profile
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const [users] = await db.promise().execute(
      'SELECT first_name, last_name, email, phone, country_code, city, district, full_address FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({ success: true, profile: users[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Profil bilgileri alınırken hata oluştu' });
  }
});

// Update user profile
app.put('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const { first_name, last_name, email, phone, country_code, city, district, full_address } = req.body;

    // Email uniqueness check (excluding current user)
    const [existingUsers] = await db.promise().execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, req.user.id]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor' });
    }

    await db.promise().execute(`
      UPDATE users 
      SET first_name = ?, last_name = ?, email = ?, phone = ?, country_code = ?, 
          city = ?, district = ?, full_address = ?, updated_at = NOW()
      WHERE id = ?
    `, [first_name, last_name, email, phone, country_code || '+90', city, district, full_address, req.user.id]);

    res.json({ success: true, message: 'Profil başarıyla güncellendi' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Profil güncellenirken hata oluştu' });
  }
});

// Change password
app.put('/api/user/password', verifyToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    // Get current user
    const [users] = await db.promise().execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, users[0].password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await db.promise().execute(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [hashedNewPassword, req.user.id]
    );

    res.json({ success: true, message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Şifre değiştirilirken hata oluştu' });
  }
});

// Update user settings
app.put('/api/user/settings', verifyToken, async (req, res) => {
  try {
    const { email_notifications, sms_notifications, marketing_emails, system_notifications } = req.body;

    // Check if user_settings table exists, if not create it
    await db.promise().execute(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email_notifications BOOLEAN DEFAULT TRUE,
        sms_notifications BOOLEAN DEFAULT FALSE,
        marketing_emails BOOLEAN DEFAULT TRUE,
        system_notifications BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_settings (user_id)
      )
    `);

    // Insert or update settings
    await db.promise().execute(`
      INSERT INTO user_settings (user_id, email_notifications, sms_notifications, marketing_emails, system_notifications)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      email_notifications = VALUES(email_notifications),
      sms_notifications = VALUES(sms_notifications),
      marketing_emails = VALUES(marketing_emails),
      system_notifications = VALUES(system_notifications),
      updated_at = NOW()
    `, [req.user.id, email_notifications, sms_notifications, marketing_emails, system_notifications]);

    res.json({ success: true, message: 'Ayarlar başarıyla kaydedildi' });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: 'Ayarlar kaydedilirken hata oluştu' });
  }
});

// Get user settings
app.get('/api/user/settings', verifyToken, async (req, res) => {
  try {
    const [settings] = await db.promise().execute(
      'SELECT email_notifications, sms_notifications, marketing_emails, system_notifications FROM user_settings WHERE user_id = ?',
      [req.user.id]
    );

    const userSettings = settings.length > 0 ? settings[0] : {
      email_notifications: true,
      sms_notifications: false,
      marketing_emails: true,
      system_notifications: true
    };

    res.json({ success: true, settings: userSettings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ message: 'Ayarlar alınırken hata oluştu' });
  }
});

// Customer Registration API
app.post('/api/customers', verifyToken, async (req, res) => {
  try {
    const {
      registration_type,
      first_name,
      last_name,
      tc_no,
      email,
      phone,
      country_code,
      city,
      district,
      delivery_address,
      company_name,
      tax_office,
      tax_no,
      authorized_person,
      authorized_email,
      authorized_phone,
      authorized_country_code,
      selected_product,
      selected_color,
      product_price,
      product_vat,
      total_amount,
      contract1_accepted,
      contract2_accepted,
      contract3_accepted, // Mesafeli Satış Sözleşmesi
      contract4_accepted, // Ön Bilgilendirme Formu
      contract5_accepted  // Elektronik Ticaret Bilgilendirmesi
    } = req.body;

    // Generate customer ID
    const customerId = await generateCustomerId();
    if (!customerId) {
      return res.status(500).json({ message: 'Müşteri ID oluşturulamadı' });
    }

    // Insert customer record
    const [result] = await db.promise().execute(`
      INSERT INTO customers (
        customer_id, registration_type, first_name, last_name, tc_no, email, phone,
        country_code, delivery_city, delivery_district, delivery_address, 
        company_name, tax_office, tax_no, authorized_person,
        authorized_email, authorized_phone, authorized_country_code, 
        selected_product, product_price, product_vat, total_amount, 
        contract1_accepted, contract2_accepted, contract3_accepted, 
        contract4_accepted, contract5_accepted, created_by, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      customerId, registration_type, first_name, last_name, tc_no, email, phone,
      country_code || '+90', city, district, delivery_address, 
      company_name, tax_office, tax_no, authorized_person,
      authorized_email, authorized_phone, authorized_country_code || '+90', 
      selected_product, product_price, product_vat, total_amount, 
      contract1_accepted, contract2_accepted, contract3_accepted, 
      contract4_accepted, contract5_accepted, req.user.id, 'confirmed'
    ]);

    // Award KKP for customer sale - KDV hariç net fiyat üzerinden
    // product_price TL cinsinden, USD'ye çevir (1 USD = 40 TL, 1 USD = 1 KKP)
    // product_price zaten KDV hariç net fiyat (CustomerRegistration.js'den geliyor)
    const productPriceUSD = product_price / 40; // TL'yi USD'ye çevir (1 USD = 40 TL)
    const kkpEarned = await awardKKPForCustomerSale(req.user.id, productPriceUSD);

    // Create sales tracking record
    await createSalesTrackingRecord(
      req.user.id,
      result.insertId,
      'product_sale',
      selected_product === 'education' ? 'Eğitim Paketi' : 'Cihaz Paketi',
      total_amount
    );

    // Update user activity status
    await updateUserActivityStatus(req.user.id);

    // Update user profile sales data
    await db.promise().execute(`
      UPDATE user_profiles 
      SET total_sales = total_sales + ?, monthly_sales = monthly_sales + ?, is_active_this_month = TRUE
      WHERE user_id = ?
    `, [total_amount / 40, total_amount / 40, req.user.id]); // USD cinsinden kaydet (KKP hesaplama için - 1 USD = 40 TL)

    // Calculate sponsorship earnings for the seller's sponsor
    await calculateSponsorshipEarnings(req.user.id, total_amount, 'customer_sale');

    res.json({
      success: true,
      message: 'Müşteri kaydı başarıyla oluşturuldu!',
      customer_id: customerId,
      kkp_earned: kkpEarned,
      total_amount_tl: total_amount,
      total_amount_usd: total_amount / 40
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Sales Tracker API - Updated
app.get('/api/sales/tracker', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get pending sales (waiting room)
    const [pendingSales] = await db.promise().execute(`
      SELECT 
        st.*,
        CASE 
          WHEN st.customer_id IS NOT NULL THEN 
            CONCAT(COALESCE(c.first_name, c.authorized_person, ''), ' ', COALESCE(c.last_name, ''))
          WHEN st.partner_id IS NOT NULL THEN 
            CONCAT(COALESCE(p.first_name, ''), ' ', COALESCE(p.last_name, ''))
          ELSE 'Bilinmeyen Müşteri'
        END as customer_name
      FROM sales_tracking st
      LEFT JOIN customers c ON st.customer_id = c.id
      LEFT JOIN users p ON st.partner_id = p.id
      WHERE st.seller_id = ? AND st.status = 'pending'
      ORDER BY st.sale_date DESC
    `, [userId]);

    // Get active sales (this month)
    const [activeSales] = await db.promise().execute(`
      SELECT 
        st.*,
        CASE 
          WHEN st.customer_id IS NOT NULL THEN 
            CONCAT(COALESCE(c.first_name, c.authorized_person, ''), ' ', COALESCE(c.last_name, ''))
          WHEN st.partner_id IS NOT NULL THEN 
            CONCAT(COALESCE(p.first_name, ''), ' ', COALESCE(p.last_name, ''))
          ELSE 'Bilinmeyen Müşteri'
        END as customer_name
      FROM sales_tracking st
      LEFT JOIN customers c ON st.customer_id = c.id
      LEFT JOIN users p ON st.partner_id = p.id
      WHERE st.seller_id = ? AND st.status = 'active'
      AND MONTH(st.sale_date) = MONTH(NOW()) AND YEAR(st.sale_date) = YEAR(NOW())
      ORDER BY st.sale_date DESC
    `, [userId]);

    // Check monthly activity
    const [activityCheck] = await db.promise().execute(`
      SELECT COUNT(*) as count FROM sales_tracking 
      WHERE seller_id = ? AND MONTH(sale_date) = MONTH(NOW()) AND YEAR(sale_date) = YEAR(NOW())
    `, [userId]);

    const monthlyActivity = activityCheck[0].count > 0;

    // Format data for frontend
    const formatSalesData = (sales) => {
      return sales.map(sale => ({
        ...sale,
        customer_name: sale.customer_name?.trim() || 'Bilinmeyen Müşteri'
      }));
    };

    res.json({
      pendingSales: formatSalesData(pendingSales),
      activeSales: formatSalesData(activeSales),
      monthlyActivity
    });

  } catch (error) {
    console.error('Sales tracker error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Career Progress API
app.get('/api/career/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's current career data
    const [userResult] = await db.promise().execute(`
      SELECT 
        career_level,
        total_kkp,
        active_partners,
        created_at
      FROM users 
      WHERE id = ?
    `, [userId]);

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult[0];

    // Calculate target values based on current level
    const levelTargets = {
      bronze: { kkp: 15000, partners: 1 },
      silver: { kkp: 50000, partners: 3 },
      gold: { kkp: 100000, partners: 7 },
      star_leader: { kkp: 175000, partners: 15 },
      super_star_leader: { kkp: 300000, partners: 25 },
      presidents_team: { kkp: 400000, partners: 30 },
      country_distributor: { kkp: 400000, partners: 30 }
    };

    const currentTargets = levelTargets[user.career_level] || levelTargets.bronze;

    res.json({
      current_level: user.career_level,
      total_kkp: parseFloat(user.total_kkp) || 0,
      active_partners: user.active_partners || 0,
      target_kkp: currentTargets.kkp,
      target_partners: currentTargets.partners,
      level_upgraded: false
    });

  } catch (error) {
    console.error('Career progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Career Bonuses API
app.get('/api/career/bonuses', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [bonuses] = await db.promise().execute(`
      SELECT 
        career_level,
        bonus_amount,
        kkp_threshold,
        paid,
        paid_at,
        created_at
      FROM career_bonuses 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);

    res.json(bonuses);

  } catch (error) {
    console.error('Career bonuses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Doping Promotion API
app.get('/api/doping-promotion/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user registration date
    const [userInfo] = await db.promise().execute(
      'SELECT created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!userInfo[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    const registrationDate = new Date(userInfo[0].created_at);
    const now = new Date();
    const daysSinceRegistration = Math.floor((now - registrationDate) / (1000 * 60 * 60 * 24));

    // Calculate stage dates
    const stage1Start = new Date(registrationDate);
    const stage1End = new Date(registrationDate);
    stage1End.setDate(stage1End.getDate() + 60);

    const stage2Start = new Date(registrationDate);
    stage2Start.setDate(stage2Start.getDate() + 61);
    const stage2End = new Date(registrationDate);
    stage2End.setDate(stage2End.getDate() + 120);

    // Get personal sales (direct sales by user)
    const [personalSales] = await db.promise().execute(`
      SELECT COUNT(*) as count
      FROM customers c
      WHERE c.created_by = ? AND c.selected_product = 'device'
    `, [userId]);

    // Get team sales (sales by user's partners)
    const [teamSales] = await db.promise().execute(`
      SELECT COUNT(*) as count
      FROM customers c
      INNER JOIN users u ON c.created_by = u.id
      WHERE u.created_by = ? AND c.selected_product = 'device'
    `, [userId]);

    // Get personal partners (direct partners registered by user)
    const [personalPartners] = await db.promise().execute(`
      SELECT COUNT(*) as count
      FROM users u
      WHERE u.created_by = ? AND u.role = 'partner'
    `, [userId]);

    // Calculate stage 1 progress
    const stage1PersonalSales = personalSales[0].count;
    const stage1TeamSales = teamSales[0].count;
    const stage1TotalSales = stage1PersonalSales + stage1TeamSales;
    const stage1Partners = personalPartners[0].count;

    // Calculate stage 1 KKP bonus
    let stage1KKPBonus = 0;
    if (daysSinceRegistration <= 60 && stage1TotalSales >= 40 && stage1Partners >= 7) {
              // Calculate KKP earned in first 60 days and double it
        const [stage1KKP] = await db.promise().execute(`
          SELECT COALESCE(SUM(
            CASE 
              WHEN c.selected_product = 'device' THEN 100
              WHEN c.selected_product = 'education' THEN 100
              ELSE 0
            END
          ), 0) as total_kkp
          FROM customers c
          WHERE c.created_by = ? AND c.created_at BETWEEN ? AND ?
        `, [userId, registrationDate, stage1End]);

      stage1KKPBonus = stage1KKP[0].total_kkp; // This will be doubled
    }

    // Calculate stage 2 progress (similar logic for 61-120 days)
    let stage2KKPBonus = 0;
    if (daysSinceRegistration > 60 && daysSinceRegistration <= 120) {
      // Stage 2 calculations...
      if (stage1TotalSales >= 80 && stage1Partners >= 15) {
        const [stage2KKP] = await db.promise().execute(`
          SELECT COALESCE(SUM(
            CASE 
              WHEN c.selected_product = 'device' THEN 100
              WHEN c.selected_product = 'education' THEN 100
              ELSE 0
            END
          ), 0) as total_kkp
          FROM customers c
          WHERE c.created_by = ? AND c.created_at BETWEEN ? AND ?
        `, [userId, stage2Start, stage2End]);

        stage2KKPBonus = stage2KKP[0].total_kkp;
      }
    }

    const dopingData = {
      etap1: {
        baslangic_tarihi: stage1Start.toLocaleDateString('tr-TR'),
        bitis_tarihi: stage1End.toLocaleDateString('tr-TR'),
        hedef_satis: 40,
        yapilan_satis: stage1TotalSales,
        kalan_satis: Math.max(40 - stage1TotalSales, 0),
        hedef_ortak: 7,
        yapilan_ortak: stage1Partners,
        kalan_ortak: Math.max(7 - stage1Partners, 0),
        kazanilacak_puan: stage1KKPBonus,
        tamamlandi: stage1TotalSales >= 40 && stage1Partners >= 7 && daysSinceRegistration <= 60,
        personal_sales: stage1PersonalSales,
        team_sales: stage1TeamSales
      },
      etap2: {
        baslangic_tarihi: stage2Start.toLocaleDateString('tr-TR'),
        bitis_tarihi: stage2End.toLocaleDateString('tr-TR'),
        hedef_satis: 80,
        yapilan_satis: stage1TotalSales, // Cumulative
        kalan_satis: Math.max(80 - stage1TotalSales, 0),
        hedef_ortak: 15,
        yapilan_ortak: stage1Partners,
        kalan_ortak: Math.max(15 - stage1Partners, 0),
        kazanilacak_puan: stage2KKPBonus,
        tamamlandi: stage1TotalSales >= 80 && stage1Partners >= 15 && daysSinceRegistration > 60 && daysSinceRegistration <= 120,
        personal_sales: stage1PersonalSales,
        team_sales: stage1TeamSales
      },
      days_since_registration: daysSinceRegistration,
      current_stage: daysSinceRegistration <= 60 ? 1 : daysSinceRegistration <= 120 ? 2 : 0
    };

    res.json(dopingData);

  } catch (error) {
    console.error('Doping promotion progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Automatic Sales Activation System (Cron Job Alternative)
const activatePendingSales = async () => {
  try {
    // Activate sales that have passed their 15-day waiting period
    const [result] = await db.promise().execute(`
      UPDATE sales_tracking 
      SET status = 'active' 
      WHERE status = 'pending' AND bonus_date <= NOW()
    `);

    if (result.affectedRows > 0) {
      console.log(`Activated ${result.affectedRows} pending sales`);
    }
  } catch (error) {
    console.error('Activate pending sales error:', error);
  }
};

// Run sales activation every hour
setInterval(activatePendingSales, 60 * 60 * 1000); // 1 hour

// Monthly activity reset (runs on the 1st of each month)
const resetMonthlyActivity = async () => {
  try {
    const now = new Date();
    if (now.getDate() === 1) { // First day of month
      await db.promise().execute(`
        UPDATE user_profiles SET 
        monthly_sales = 0, 
        is_active_this_month = FALSE
      `);
      console.log('Monthly activity reset completed');
    }
  } catch (error) {
    console.error('Monthly activity reset error:', error);
  }
};

// Run monthly reset check daily at midnight
setInterval(resetMonthlyActivity, 24 * 60 * 60 * 1000); // 24 hours

// Dashboard Stats API
app.get('/api/dashboard/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Get total commission earnings from sponsorship_earnings
    const [commissionResult] = await db.promise().execute(`
      SELECT 
        COALESCE(SUM(bronze_earnings + silver_earnings + gold_earnings + star_earnings + super_star_earnings), 0) as total_commission,
        COALESCE(SUM(monthly_earnings), 0) as monthly_earnings
      FROM sponsorship_earnings 
      WHERE sponsor_id = ?
    `, [userId]);

    // Get pending commissions from sales_tracking
    const [pendingResult] = await db.promise().execute(`
      SELECT COALESCE(SUM(bonus_amount), 0) as pending_commissions
      FROM sales_tracking 
      WHERE seller_id = ? AND status = 'pending'
    `, [userId]);

    // Get pool data (example calculations)
    const [poolResult] = await db.promise().execute(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as yearly_revenue
      FROM payments 
      WHERE status = 'approved' AND YEAR(created_at) = ?
    `, [currentYear]);

    const yearlyRevenue = poolResult[0]?.yearly_revenue || 0;

    res.json({
      totalCommission: (commissionResult[0]?.total_commission || 0) / 40, // Convert TL to USD
      monthlyEarnings: (commissionResult[0]?.monthly_earnings || 0) / 40,
      pendingCommissions: (pendingResult[0]?.pending_commissions || 0) / 40,
      liderlikHavuzu: (yearlyRevenue * 0.005) / 40, // 0.5% of yearly revenue in USD
      baskanlikHavuzu: (yearlyRevenue * 0.005) / 40,
      karPaylasimHavuzu: (yearlyRevenue * 0.01) / 40 // 1% of yearly revenue in USD
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Server Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Import accounting endpoints
const {
  getAccountingData,
  addEarning,
  updateEarning,
  getEarningTypes,
  getAccountingSummary
} = require('./accounting_api_endpoints');

// Muhasebe Takip Paneli API Routes
app.get('/api/accounting/data', verifyToken, getAccountingData);
app.post('/api/accounting/earnings', verifyToken, addEarning);
app.put('/api/accounting/earnings/:id', verifyToken, updateEarning);
app.get('/api/accounting/earning-types', verifyToken, getEarningTypes);
app.get('/api/accounting/summary', verifyToken, getAccountingSummary);

// Global Seyahat API Routes
app.get('/api/global-travel/data', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.promise().execute(`
      SELECT * FROM global_travel_data WHERE user_id = ?
    `, [userId]);

    if (rows.length === 0) {
      // Kullanıcı için varsayılan veri oluştur
      await db.promise().execute(`
        INSERT INTO global_travel_data (user_id) VALUES (?)
      `, [userId]);

      // Yeni oluşturulan veriyi getir
      const [newRows] = await db.promise().execute(`
        SELECT * FROM global_travel_data WHERE user_id = ?
      `, [userId]);

      return res.json(newRows[0]);
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Global travel data fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Global seyahat verileri getirilemedi',
      error: error.message
    });
  }
});

// Doping Promosyonu API Routes
app.get('/api/doping-promotion/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Kullanıcının başlangıç tarihi
    const [userInfo] = await db.promise().execute(`
      SELECT created_at FROM users WHERE id = ?
    `, [userId]);

    if (userInfo.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const startDate = new Date(userInfo[0].created_at);
    const now = new Date();
    const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

    // Etap 1: İlk 60 gün
    const etap1EndDate = new Date(startDate.getTime() + (60 * 24 * 60 * 60 * 1000));

    // Etap 2: 61-120 gün
    const etap2StartDate = new Date(startDate.getTime() + (61 * 24 * 60 * 60 * 1000));
    const etap2EndDate = new Date(startDate.getTime() + (120 * 24 * 60 * 60 * 1000));

    // Kullanıcının sponsor_id'sini al
    const [sponsorInfo] = await db.promise().execute(`
      SELECT sponsor_id FROM users WHERE id = ?
    `, [userId]);

    const userSponsorId = sponsorInfo[0]?.sponsor_id;

    // Takım satış verileri (kullanıcının kendisi + takımı)
    const [teamSales] = await db.promise().execute(`
      SELECT 
        COUNT(CASE WHEN c.created_at BETWEEN ? AND ? THEN 1 END) as etap1_sales,
        COUNT(CASE WHEN c.created_at BETWEEN ? AND ? THEN 1 END) as etap2_sales
      FROM customers c
      JOIN users u ON c.created_by = u.id
      WHERE u.id = ? OR u.sponsor_id = ?
    `, [startDate, etap1EndDate, etap2StartDate, etap2EndDate, userId, userSponsorId]);

    // Şahsi iş ortağı sayısı (kullanıcının direkt sponsor olduğu kişiler)
    const [partners] = await db.promise().execute(`
      SELECT 
        COUNT(CASE WHEN created_at BETWEEN ? AND ? THEN 1 END) as etap1_partners,
        COUNT(CASE WHEN created_at BETWEEN ? AND ? THEN 1 END) as etap2_partners
      FROM users 
      WHERE sponsor_id = ?
    `, [startDate, etap1EndDate, etap2StartDate, etap2EndDate, userSponsorId]);

    // Etap 1 tamamlandı mı kontrol et
    const etap1Completed = (teamSales[0].etap1_sales >= 40 && partners[0].etap1_partners >= 7);
    
    // Debug log
    console.log('🔍 Doping Debug:', {
      userId,
      etap1_sales: teamSales[0].etap1_sales,
      etap1_partners: partners[0].etap1_partners,
      etap1Completed,
      etap2_sales: teamSales[0].etap2_sales,
      etap2_partners: partners[0].etap2_partners
    });
    
    // Etap 2 sadece etap 1 tamamlandıysa aktif olabilir
    const etap2Active = etap1Completed;
    const etap2Completed = etap2Active && (teamSales[0].etap2_sales >= 80 && partners[0].etap2_partners >= 15);

    const dopingData = {
      etap1: {
        baslangic_tarihi: startDate.toLocaleDateString('tr-TR'),
        bitis_tarihi: etap1EndDate.toLocaleDateString('tr-TR'),
        hedef_satis: 40,
        yapilan_satis: teamSales[0].etap1_sales || 0,
        kalan_satis: Math.max(0, 40 - (teamSales[0].etap1_sales || 0)),
        hedef_ortak: 7,
        yapilan_ortak: partners[0].etap1_partners || 0,
        kalan_ortak: Math.max(0, 7 - (partners[0].etap1_partners || 0)),
        kazanilacak_puan: etap1Completed ? 2000 : 0, // 2x KKP bonusu
        tamamlandi: etap1Completed,
        aktif: true // Etap 1 her zaman aktif
      },
      etap2: {
        baslangic_tarihi: etap2StartDate.toLocaleDateString('tr-TR'),
        bitis_tarihi: etap2EndDate.toLocaleDateString('tr-TR'),
        hedef_satis: 80,
        yapilan_satis: teamSales[0].etap2_sales || 0,
        kalan_satis: Math.max(0, 80 - (teamSales[0].etap2_sales || 0)),
        hedef_ortak: 15,
        yapilan_ortak: partners[0].etap2_partners || 0,
        kalan_ortak: Math.max(0, 15 - (partners[0].etap2_partners || 0)),
        kazanilacak_puan: etap2Completed ? 3000 : 0, // 2x KKP bonusu
        tamamlandi: etap2Completed,
        aktif: etap2Active, // Etap 2 sadece etap 1 tamamlandıysa aktif
        beklemekte: !etap2Active // Etap 1 tamamlanmadıysa beklemekte
      }
    };

    res.json(dopingData);
  } catch (error) {
    console.error('Doping promotion data fetch error:', error);
    res.status(500).json({
      error: 'Doping promosyonu verileri getirilemedi',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Run initial activation check
  activatePendingSales();
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

    // Eğitim durumunu da kontrol et
    const [user] = await db.promise().execute(
      'SELECT education_completed, backoffice_access FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      progress,
      education_completed: user[0]?.education_completed || false,
      backoffice_access: user[0]?.backoffice_access || false
    });
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

      console.log(`User ${req.user.id} progress: ${allProgress[0].total}/${totalVideos[0].total} videos completed`);

      if (allProgress[0].total >= totalVideos[0].total) {
        // All videos completed, grant backoffice access
        await db.promise().execute(
          'UPDATE users SET education_completed = 1, backoffice_access = 1 WHERE id = ?',
          [req.user.id]
        );

        console.log(`User ${req.user.id} education completed! Backoffice access granted.`);

        // Return education completion status
        return res.json({
          score,
          passed,
          total: questions.length,
          education_completed: true,
          message: 'Tebrikler! Tüm eğitimlerinizi başarıyla tamamladınız. Artık backoffice sistemine erişebilirsiniz.'
        });
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

    // Debug için gelen verileri logla
    console.log('=== PARTNER REGISTRATION DEBUG ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Request Headers:', req.headers);
    console.log('User ID:', req.user.id);
    console.log('Partner Type:', partner_type);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Delivery Address:', delivery_address);
    console.log('All Fields:', {
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
      authorized_person
    });
    console.log('=== END DEBUG ===');

    // Gerekli alanları kontrol et
    const missingFields = [];
    if (!partner_type) missingFields.push('partner_type');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!delivery_address) missingFields.push('delivery_address');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        message: `Temel bilgiler eksik: ${missingFields.join(', ')}` 
      });
    }

    if (partner_type === 'individual') {
      if (!first_name || !last_name || !tc_no) {
        return res.status(400).json({ message: 'Bireysel kayıt için gerekli alanlar eksik' });
      }
    } else if (partner_type === 'corporate') {
      if (!company_name || !tax_office || !tax_no || !authorized_person) {
        return res.status(400).json({ message: 'Kurumsal kayıt için gerekli alanlar eksik' });
      }
    }

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

    const newUserId = result.insertId;

    // Initialize user profile for network tree
    await initializeUserProfile(newUserId);

    // Award KKP to sponsor for partner registration
    await awardKKPForPartnerRegistration(req.user.id);

    // Create sales tracking record for partner registration
    await createSalesTrackingRecord(
      req.user.id,
      null,
      'partner_registration',
      'İş Ortağı Kaydı',
      4800 // Partner registration amount
    );

    // Create business partner record with pending payment status
    await db.promise().execute(
      'INSERT INTO business_partners (user_id, sponsor_id, partner_type, payment_status, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [newUserId, newSponsorId, partner_type, 'pending', 'pending']
    );

    // Update sponsor's activity status
    await updateUserActivityStatus(req.user.id);

    // Send registration email
    try {
      await sendNewRegistrationEmail(userData.email, {
        first_name: userData.first_name,
        last_name: userData.last_name,
        sponsor_id: newSponsorId,
        password: randomPassword
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }

    res.json({
      success: true,
      message: 'İş ortağı başarıyla kaydedildi',
      user_id: newUserId,
      partner_id: newUserId, // Partner ID'yi de döndür
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
app.post('/api/partner/register-new', verifyToken, async (req, res) => {
  try {
    const {
      registration_type,
      first_name,
      last_name,
      tc_no,
      email,
      phone,
      country_code,
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
      contract3_accepted,
      contract4_accepted,
      contract5_accepted,
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
    if (!contracts_accepted || !contract1_accepted || !contract2_accepted || !contract3_accepted || !contract4_accepted || !contract5_accepted) {
      return res.status(400).json({ message: 'Tüm sözleşme onayları gerekli' });
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
      country_code: country_code || '+90',
      role: 'partner',
      sponsor_id: newSponsorId,
      created_by: req.user.id, // Kayıt eden kişinin ID'si
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
      contract3_accepted,
      contract4_accepted,
      contract5_accepted,
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
        username, email, password_hash, first_name, last_name, phone, country_code, role, sponsor_id, created_by,
        partner_type, registration_type, tc_no, company_name, tax_office, tax_no,
        authorized_first_name, authorized_last_name, city, district, full_address,
        delivery_address, billing_address, contract1_accepted, contract2_accepted,
        contract3_accepted, contract4_accepted, contract5_accepted,
        total_amount, registration_step, registration_completed, payment_confirmed,
        education_completed, education_deadline, is_active, backoffice_access
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.username, userData.email, userData.password_hash,
        userData.first_name, userData.last_name, userData.phone, userData.country_code, userData.role,
        userData.sponsor_id, userData.created_by, userData.partner_type, userData.registration_type,
        userData.tc_no, userData.company_name, userData.tax_office, userData.tax_no,
        userData.authorized_first_name, userData.authorized_last_name,
        userData.city, userData.district, userData.full_address,
        userData.delivery_address, userData.billing_address,
        userData.contract1_accepted, userData.contract2_accepted,
        userData.contract3_accepted, userData.contract4_accepted, userData.contract5_accepted,
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

    // Award KKP points to the sponsor who registered this partner
    if (req.user.id) {
      await awardKKPForPartnerRegistration(req.user.id);
      await updateUserActivityStatus(req.user.id);
    }

    // Initialize profile for the new partner
    await initializeUserProfile(result.insertId);

    // Add to network tree structure
    await addToNetworkTree(result.insertId, req.user.id);

    // Update sponsor's downline counts
    await updateDownlineCounts(req.user.id);

    // Create sales tracking record for partner registration
    await createSalesTrackingRecord(req.user.id, null, 'partner_registration', 'Franchise Satış Paketi', userData.total_amount);

    // Update sponsor's profile with new partner
    await db.promise().execute(`
      UPDATE user_profiles 
      SET team_size = team_size + 1, total_sales = total_sales + ?, is_active_this_month = TRUE
      WHERE user_id = ?
    `, [userData.total_amount / 40, req.user.id]); // USD cinsinden kaydet

    // Calculate sponsorship earnings for the new partner registration
    await calculateSponsorshipEarnings(result.insertId, userData.total_amount, 'partner_registration');

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

    // Award KKP points to the partner who registered the customer
    await awardKKPForCustomerSale(req.user.id, customerData.total_amount);

    // Create sales tracking record
    await createSalesTrackingRecord(req.user.id, customerId, 'product_sale', customerData.selected_product, customerData.total_amount);

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
// Career Progress API
app.get('/api/career/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user career data
    const [userResult] = await db.promise().execute(
      'SELECT career_level, total_kkp, active_partners, sponsor_id FROM users WHERE id = ?',
      [userId]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const user = userResult[0];

    // Get USD to TRY rate from system settings
    const [rateResult] = await db.promise().execute(
      'SELECT setting_value FROM system_settings WHERE setting_key = "usd_to_try_rate"',
      []
    );
    const usdToTryRate = parseFloat(rateResult[0]?.setting_value || 40);

    // Calculate KKP from payments (Satış tutarı / Dolar kuru)
    const [paymentsResult] = await db.promise().execute(
      'SELECT SUM(total_amount) as total_sales FROM payments WHERE user_id = ? AND status = "approved"',
      [userId]
    );

    // Calculate KKP from partner registrations (Partner kayıtları - her partner için eğitim paketi 100 USD = 100 KKP)
    const [partnersResult] = await db.promise().execute(
      'SELECT COUNT(*) as partner_count FROM users WHERE created_by = ? AND role = "partner"',
      [userId]
    );

    // Calculate KKP from customer sales (KDV hariç net fiyat üzerinden)
    const [customersResult] = await db.promise().execute(
      'SELECT SUM(product_price) as customer_net_sales FROM customers WHERE created_by = ?',
      [userId]
    );

    // KKP Calculations
    const paymentKKP = paymentsResult[0].total_sales ? Math.floor(paymentsResult[0].total_sales / usdToTryRate) : 0;
    const partnerKKP = (partnersResult[0].partner_count || 0) * 100; // Her partner 100 KKP (partner registration bonus)
    const customerKKP = customersResult[0].customer_net_sales ? Math.floor(customersResult[0].customer_net_sales) : 0; // KDV hariç net fiyat = KKP
    const totalKKP = paymentKKP + partnerKKP + customerKKP;

    // Active partners count
    const activePartners = partnersResult[0].partner_count || 0;

    // Update user's KKP and partner count in database
    await db.promise().execute(
      'UPDATE users SET total_kkp = ?, active_partners = ? WHERE id = ?',
      [totalKKP, activePartners, userId]
    );

    // Career level requirements - Updated to match HOOWELL Global Career Levels
    const careerRequirements = {
      bronze: { kkp_required: 0, partners_required: 0 }, // İlk satış sonrası Bronze
      silver: { kkp_required: 15000, partners_required: 1 }, // 15.000 KKP + 1 aktif ortak
      gold: { kkp_required: 50000, partners_required: 3 }, // 50.000 KKP + 3 aktif ortak
      star_leader: { kkp_required: 100000, partners_required: 7 }, // 100.000 KKP + 7 aktif ortak
      super_star_leader: { kkp_required: 175000, partners_required: 15 }, // 175.000 KKP + 15 aktif ortak
      presidents_team: { kkp_required: 300000, partners_required: 25 }, // 300.000 KKP + 25 aktif ortak
      country_distributor: { kkp_required: 400000, partners_required: 30 } // 400.000 KKP + 30 aktif ortak
    };

    let currentLevel = user.career_level || 'bronze';

    // Find next level
    const levelOrder = ['bronze', 'silver', 'gold', 'star_leader', 'super_star_leader', 'presidents_team', 'country_distributor'];

    // Auto-upgrade career level if requirements met
    let levelUpgraded = false;
    let newLevel = currentLevel;

    for (let i = levelOrder.indexOf(currentLevel) + 1; i < levelOrder.length; i++) {
      const checkLevel = levelOrder[i];
      const requirements = careerRequirements[checkLevel];

      if (totalKKP >= requirements.kkp_required && activePartners >= requirements.partners_required) {
        newLevel = checkLevel;
        levelUpgraded = true;
      } else {
        break; // Bir sonraki seviye şartları karşılanmıyorsa dur
      }
    }

    // Update career level if upgraded
    if (levelUpgraded && newLevel !== currentLevel) {
      await db.promise().execute(
        'UPDATE users SET career_level = ? WHERE id = ?',
        [newLevel, userId]
      );

      // Award career bonus for the new level
      await awardCareerBonus(userId, newLevel, totalKKP, usdToTryRate);

      currentLevel = newLevel;
    }

    const currentIndex = levelOrder.indexOf(currentLevel);
    const nextLevel = currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null;
    const nextRequirements = nextLevel ? careerRequirements[nextLevel] : null;

    res.json({
      current_level: currentLevel,
      total_kkp: totalKKP,
      active_partners: activePartners,
      target_kkp: nextRequirements ? nextRequirements.kkp_required : careerRequirements[currentLevel].kkp_required,
      target_partners: nextRequirements ? nextRequirements.partners_required : careerRequirements[currentLevel].partners_required,
      next_level: nextLevel,
      level_upgraded: levelUpgraded,
      previous_level: levelUpgraded ? user.career_level : null,
      breakdown: {
        payment_kkp: paymentKKP,
        partner_kkp: partnerKKP,
        customer_kkp: customerKKP
      }
    });
  } catch (error) {
    console.error('Career progress error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});
// Career Bonus Award Function
const awardCareerBonus = async (userId, careerLevel, kkpAchieved, usdToTryRate) => {
  try {
    // Career bonus amounts in USD
    const bonusAmounts = {
      silver: 400,
      gold: 800,
      star_leader: 1200,
      super_star_leader: 1600,
      presidents_team: 2000,
      country_distributor: 2500
    };

    const bonusUSD = bonusAmounts[careerLevel];
    if (!bonusUSD) return; // No bonus for this level

    const bonusTRY = bonusUSD * usdToTryRate;

    // Check if bonus already awarded
    const [existingBonus] = await db.promise().execute(
      'SELECT id FROM career_bonuses WHERE user_id = ? AND career_level = ?',
      [userId, careerLevel]
    );

    if (existingBonus.length > 0) {
      console.log(`Career bonus already awarded for user ${userId} level ${careerLevel}`);
      return;
    }

    // Award the bonus
    await db.promise().execute(
      'INSERT INTO career_bonuses (user_id, career_level, bonus_amount_usd, bonus_amount_try, kkp_achieved, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, careerLevel, bonusUSD, bonusTRY, kkpAchieved, 'pending']
    );

    console.log(`Career bonus awarded: User ${userId} - ${careerLevel} - $${bonusUSD} (${bonusTRY} TL)`);
  } catch (error) {
    console.error('Award career bonus error:', error);
  }
};
// Get Career Bonuses API
app.get('/api/career/bonuses', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [bonuses] = await db.promise().execute(
      'SELECT * FROM career_bonuses WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(bonuses);
  } catch (error) {
    console.error('Get career bonuses error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});
// Sales Tracker API
app.get('/api/sales/tracker', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get pending sales (bekleme odası - waiting for bonus activation)
    const [pendingSales] = await db.promise().execute(`
      SELECT 
        st.id,
        st.product_name,
        st.sale_date,
        st.bonus_date,
        st.bonus_amount,
        CASE 
          WHEN st.customer_id IS NOT NULL THEN 
            CONCAT(COALESCE(c.first_name, ''), ' ', COALESCE(c.last_name, ''))
          WHEN st.partner_id IS NOT NULL THEN 
            CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))
          ELSE 'Bilinmeyen Müşteri'
        END as customer_name,
        st.sale_type
      FROM sales_tracking st
      LEFT JOIN customers c ON st.customer_id = c.id
      LEFT JOIN users u ON st.partner_id = u.id
      WHERE st.seller_id = ? 
      AND st.status = 'pending'
      AND st.bonus_date > NOW()
      AND st.sale_type IN ('product_sale', 'customer_registration')
      ORDER BY st.sale_date DESC
    `, [userId]);

    // Get active sales (bu ay gerçekleşen - bonus activated)
    const [activeSales] = await db.promise().execute(`
      SELECT 
        st.id,
        st.product_name,
        st.sale_date,
        st.bonus_date,
        st.bonus_amount,
        CASE 
          WHEN st.customer_id IS NOT NULL THEN 
            CONCAT(COALESCE(c.first_name, ''), ' ', COALESCE(c.last_name, ''))
          WHEN st.partner_id IS NOT NULL THEN 
            CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))
          ELSE 'Bilinmeyen Müşteri'
        END as customer_name,
        st.sale_type
      FROM sales_tracking st
      LEFT JOIN customers c ON st.customer_id = c.id
      LEFT JOIN users u ON st.partner_id = u.id
      WHERE st.seller_id = ? 
      AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))
      AND MONTH(st.sale_date) = ? 
      AND YEAR(st.sale_date) = ?
      AND st.sale_type IN ('product_sale', 'customer_registration')
      ORDER BY st.sale_date DESC
    `, [userId, currentMonth, currentYear]);

    // Check monthly activity (this month sales count)
    const [monthlyActivity] = await db.promise().execute(`
      SELECT COUNT(*) as activity_count
      FROM sales_tracking st
      WHERE st.seller_id = ?
      AND MONTH(st.sale_date) = ? 
      AND YEAR(st.sale_date) = ?
      AND st.sale_type IN ('product_sale', 'customer_registration')
    `, [userId, currentMonth, currentYear]);

    res.json({
      pendingSales: pendingSales || [],
      activeSales: activeSales || [],
      monthlyActivity: (monthlyActivity[0]?.activity_count || 0) > 0
    });
  } catch (error) {
    console.error('Sales tracker error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});
//Customer Satisfaction Tracking API
app.get('/api/customer-satisfaction/my-customers', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get customers with their referral counts
    const [customers] = await db.promise().execute(`
      SELECT 
        c.*,
        COUNT(cr.id) as reference_count,
        c.created_at as purchase_date
      FROM customers c
      LEFT JOIN customer_references cr ON c.id = cr.customer_id
      WHERE c.created_by = ? AND c.status = 'confirmed'
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [userId]);

    // Add reward information
    const customersWithRewards = customers.map(customer => ({
      ...customer,
      referrals: customer.reference_count, // Eski uyumluluk için
      level1_reward: customer.reference_count >= 1 ? '450 USD Filtre Seti' : null,
      level2_reward: customer.reference_count >= 2 ? '410 USD El Terminali' : null,
      level3_reward: customer.reference_count >= 3 ? '500 USD Franchise Lisans' : null,
      product_name: customer.selected_product === 'education' ? 'Eğitim Paketi' : 'Cihaz Paketi',
      is_protected: isCustomerProtected(customer.created_at) // 60 gün koruma
    }));

    res.json(customersWithRewards);
  } catch (error) {
    console.error('Customer satisfaction fetch error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Check if customer is in 60-day protection period
const isCustomerProtected = (purchaseDate) => {
  const purchase = new Date(purchaseDate);
  const now = new Date();
  const diffTime = Math.abs(now - purchase);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 60;
};

// Get customer references API
app.get('/api/customer-satisfaction/references/:customerId', verifyToken, async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const userId = req.user.id;

    // Verify customer belongs to user
    const [customerCheck] = await db.promise().execute(
      'SELECT id FROM customers WHERE id = ? AND created_by = ?',
      [customerId, userId]
    );

    if (customerCheck.length === 0) {
      return res.status(403).json({ message: 'Bu müşteriye erişim yetkiniz yok' });
    }

    // Get references
    const [references] = await db.promise().execute(
      'SELECT * FROM customer_references WHERE customer_id = ? ORDER BY created_at DESC',
      [customerId]
    );

    res.json(references);
  } catch (error) {
    console.error('Customer references fetch error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Add customer reference API
app.post('/api/customer-satisfaction/add-reference', verifyToken, async (req, res) => {
  try {
    const { customer_id, reference_name, reference_surname, reference_phone } = req.body;
    const userId = req.user.id;

    // Verify customer belongs to user
    const [customerCheck] = await db.promise().execute(
      'SELECT id FROM customers WHERE id = ? AND created_by = ?',
      [customer_id, userId]
    );

    if (customerCheck.length === 0) {
      return res.status(403).json({ message: 'Bu müşteriye erişim yetkiniz yok' });
    }

    // Add reference
    await db.promise().execute(
      'INSERT INTO customer_references (customer_id, reference_name, reference_surname, reference_phone) VALUES (?, ?, ?, ?)',
      [customer_id, reference_name, reference_surname, reference_phone]
    );

    // Get total reference count for this customer
    const [refCount] = await db.promise().execute(
      'SELECT COUNT(*) as count FROM customer_references WHERE customer_id = ?',
      [customer_id]
    );

    const referenceCount = refCount[0].count;

    // Award rewards based on reference count
    let rewardName = '';
    let rewardValue = 0;

    if (referenceCount === 1) {
      rewardName = '450 USD Değerinde Ücretsiz Filtre';
      rewardValue = 450;
    } else if (referenceCount === 2) {
      rewardName = '410 USD Değerinde El Terminali';
      rewardValue = 410;
    } else if (referenceCount === 3) {
      rewardName = '500 USD Değerinde Franchise Lisans';
      rewardValue = 500;
    }

    // If reward earned, add to rewards table
    if (rewardName) {
      await db.promise().execute(`
        INSERT INTO customer_satisfaction_rewards (
          customer_id, reward_level, reward_name, reward_description, earned_date
        ) VALUES (?, ?, ?, ?, NOW())
      `, [customer_id, referenceCount, rewardName, `${referenceCount}. referans ödülü`,]);
    }

    res.json({
      success: true,
      message: 'Referans başarıyla eklendi',
      referenceCount,
      rewardEarned: rewardName || null,
      rewardValue: rewardValue || 0
    });
  } catch (error) {
    console.error('Add reference error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});// Profit Sharing API
app.get('/api/profit-sharing/data', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentYear = new Date().getFullYear();

    // Get user's career level
    const [user] = await db.promise().execute(
      'SELECT career_level, total_kkp FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userLevel = user[0].career_level;

    // Calculate yearly revenue (example calculation)
    const [revenueResult] = await db.promise().execute(`
      SELECT SUM(total_amount) as yearly_revenue 
      FROM payments 
      WHERE status = 'approved' 
      AND YEAR(created_at) = ?
    `, [currentYear]);

    const yearlyRevenue = revenueResult[0]?.yearly_revenue || 0;

    // Get user's sales and partner data for current year
    const [salesData] = await db.promise().execute(`
      SELECT 
        COUNT(CASE WHEN sale_type = 'product_sale' THEN 1 END) as personal_sales,
        COUNT(CASE WHEN sale_type = 'partner_registration' THEN 1 END) as partner_registrations
      FROM sales_tracking 
      WHERE seller_id = ? AND YEAR(sale_date) = ?
    `, [userId, currentYear]);

    const [partnerData] = await db.promise().execute(`
      SELECT COUNT(*) as active_partners 
      FROM users 
      WHERE created_by = ? AND is_active = TRUE
    `, [userId]);

    const personalSales = salesData[0]?.personal_sales || 0;
    const activePartners = partnerData[0]?.active_partners || 0;
    const careerPromotions = 0; // This would need to be tracked separately

    // Calculate points for each category
    const salesChampions = {
      pool_amount: yearlyRevenue * 0.005, // 0.5% of yearly revenue
      personal_sales: personalSales,
      career_promotions: careerPromotions,
      total_points: personalSales + (careerPromotions * 10),
      target_points: 50,
      remaining_points: Math.max(0, 50 - (personalSales + (careerPromotions * 10))),
      is_qualified: (personalSales + (careerPromotions * 10)) >= 50
    };

    const partnershipChampions = {
      pool_amount: yearlyRevenue * 0.005, // 0.5% of yearly revenue
      active_partners: activePartners,
      career_promotions: careerPromotions,
      total_points: activePartners + (careerPromotions * 10),
      target_points: 25,
      remaining_points: Math.max(0, 25 - (activePartners + (careerPromotions * 10))),
      is_qualified: (activePartners + (careerPromotions * 10)) >= 25
    };

    const yearLeaders = {
      pool_amount: yearlyRevenue * 0.01, // 1.0% of yearly revenue
      personal_sales: personalSales,
      active_partners: activePartners,
      career_promotions: careerPromotions,
      total_points: personalSales + (activePartners * 2) + (careerPromotions * 10),
      target_points: 75,
      remaining_points: Math.max(0, 75 - (personalSales + (activePartners * 2) + (careerPromotions * 10))),
      is_qualified: (personalSales + (activePartners * 2) + (careerPromotions * 10)) >= 75
    };

    res.json({
      salesChampions,
      partnershipChampions,
      yearLeaders,
      yearly_revenue: yearlyRevenue,
      current_year: currentYear
    });

  } catch (error) {
    console.error('Profit sharing data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sponsorship Tracking API
app.get('/api/sponsorship/my-partners', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get partners sponsored by this user with their earnings
    const [partners] = await db.promise().execute(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.sponsor_id,
        u.career_level,
        u.created_at,
        u.education_completed,
        u.education_deadline,
        u.education_started_at,
        COALESCE(sp.bronze_earnings, 0) as bronze_earnings,
        COALESCE(sp.silver_earnings, 0) as silver_earnings,
        COALESCE(sp.gold_earnings, 0) as gold_earnings,
        COALESCE(sp.star_earnings, 0) as star_earnings,
        COALESCE(sp.super_star_earnings, 0) as super_star_earnings,
        COALESCE(sp.monthly_earnings, 0) as monthly_earnings,
        COALESCE(sp.first_sale_activated, FALSE) as first_sale_activated,
        sp.activation_date,
        -- Partner adını birleştir
        CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as partner_name
      FROM users u
      LEFT JOIN sponsorship_earnings sp ON u.id = sp.partner_id AND sp.sponsor_id = ?
      WHERE u.created_by = ? AND u.role = 'partner'
      ORDER BY u.created_at DESC
    `, [userId, userId]);

    // Enhanced partner data with sales tracking
    const partnersWithStatus = await Promise.all(partners.map(async (partner) => {
      // Check if partner has made any sales or registrations
      const [salesCheck] = await db.promise().execute(`
        SELECT COUNT(*) as sales_count, MIN(sale_date) as first_sale 
        FROM sales_tracking 
        WHERE seller_id = ? AND status IN ('pending', 'active')
      `, [partner.id]);

      // Check if partner has made customer registrations
      const [customerCheck] = await db.promise().execute(`
        SELECT COUNT(*) as customer_count 
        FROM customers 
        WHERE created_by = ?
      `, [partner.id]);

      // Check if partner has registered other partners
      const [partnerCheck] = await db.promise().execute(`
        SELECT COUNT(*) as partner_count 
        FROM users 
        WHERE created_by = ? AND role = 'partner'
      `, [partner.id]);

      const hasActivity = salesCheck[0].sales_count > 0 || customerCheck[0].customer_count > 0 || partnerCheck[0].partner_count > 0;

      return {
        ...partner,
        first_sale_activated: partner.first_sale_activated || hasActivity,
        first_sale_date: salesCheck[0].first_sale,
        total_sales: salesCheck[0].sales_count,
        total_customers: customerCheck[0].customer_count,
        total_partners: partnerCheck[0].partner_count,
        // Convert earnings to numbers for proper calculation
        bronze_earnings: parseFloat(partner.bronze_earnings) || 0,
        silver_earnings: parseFloat(partner.silver_earnings) || 0,
        gold_earnings: parseFloat(partner.gold_earnings) || 0,
        star_earnings: parseFloat(partner.star_earnings) || 0,
        super_star_earnings: parseFloat(partner.super_star_earnings) || 0,
        monthly_earnings: parseFloat(partner.monthly_earnings) || 0
      };
    }));

    res.json(partnersWithStatus);
  } catch (error) {
    console.error('Sponsorship fetch error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Check if date has passed X days
const isDatePassed = (date, days) => {
  if (!date) return false;
  const checkDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - checkDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= days;
};

// Create sponsorship earnings table if not exists
app.post('/api/admin/create-sponsorship-table', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.promise().execute(`
      CREATE TABLE IF NOT EXISTS sponsorship_earnings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sponsor_id INT NOT NULL,
        partner_id INT NOT NULL,
        bronze_earnings DECIMAL(10,2) DEFAULT 0,
        silver_earnings DECIMAL(10,2) DEFAULT 0,
        gold_earnings DECIMAL(10,2) DEFAULT 0,
        star_earnings DECIMAL(10,2) DEFAULT 0,
        super_star_earnings DECIMAL(10,2) DEFAULT 0,
        monthly_earnings DECIMAL(10,2) DEFAULT 0,
        first_sale_activated BOOLEAN DEFAULT FALSE,
        activation_date DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sponsor_id) REFERENCES users(id),
        FOREIGN KEY (partner_id) REFERENCES users(id),
        UNIQUE KEY unique_sponsor_partner (sponsor_id, partner_id)
      )
    `);

    res.json({ message: 'Sponsorship earnings table created successfully' });
  } catch (error) {
    console.error('Create sponsorship table error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Calculate and update sponsorship earnings

// ==================== EKSİK API ENDPOINT'LERİ ====================

// Team Tracker API
app.get('/api/team/tracker', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's career level first
    const [userInfo] = await db.promise().execute(
      'SELECT career_level FROM users WHERE id = ?',
      [userId]
    );

    const userCareerLevel = userInfo[0]?.career_level || 'bronze';

    // Get user's team members (direct partners)
    const [teamMembers] = await db.promise().execute(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.sponsor_id,
        u.career_level,
        u.total_kkp,
        u.created_at,
        u.phone,
        u.email,
        COALESCE(up.total_sales, 0) as total_sales,
        COALESCE(up.monthly_sales, 0) as monthly_sales,
        -- Aktiflik durumu: Ürün satışı VEYA yeni iş ortağı ilk satışı
        CASE 
          WHEN (
            SELECT COUNT(*) 
            FROM sales_tracking st 
            WHERE st.seller_id = u.id 
            AND st.sale_type IN ('product_sale', 'customer_registration')
            AND MONTH(st.sale_date) = MONTH(CURDATE())
            AND YEAR(st.sale_date) = YEAR(CURDATE())
            AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))
          ) > 0
          OR (
            SELECT COUNT(*) 
            FROM sales_tracking st 
            WHERE st.seller_id = u.id 
            AND st.sale_type = 'partner_registration'
            AND MONTH(st.sale_date) = MONTH(CURDATE())
            AND YEAR(st.sale_date) = YEAR(CURDATE())
            AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))
          ) > 0
          THEN TRUE
          ELSE FALSE
        END as is_active_this_month,
        -- Calculate franchise percentage based on user's level
        CASE 
          WHEN ? = 'silver' THEN 2
          WHEN ? = 'gold' THEN 4
          WHEN ? = 'star_leader' THEN 6
          WHEN ? = 'super_star_leader' THEN 8
          WHEN ? = 'presidents_team' THEN 10
          ELSE 0
        END as franchise_percentage
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.created_by = ? AND u.role = 'partner'
      ORDER BY u.created_at DESC
    `, [userCareerLevel, userCareerLevel, userCareerLevel, userCareerLevel, userCareerLevel, userId]);

    // Calculate team statistics
    const teamStats = {
      total_members: teamMembers.length,
      active_members: teamMembers.filter(member => member.is_active_this_month).length,
      total_team_sales: teamMembers.reduce((sum, member) => sum + parseFloat(member.total_sales || 0), 0),
      monthly_team_sales: teamMembers.reduce((sum, member) => sum + parseFloat(member.monthly_sales || 0), 0),
      franchise_percentage: teamMembers[0]?.franchise_percentage || 0
    };

    res.json({
      team_members: teamMembers,
      team_stats: teamStats
    });

  } catch (error) {
    console.error('Team tracker error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Leadership Pools API
app.get('/api/leadership/pools', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentYear = new Date().getFullYear();

    // Check if user has access (Gold and above)
    const [user] = await db.promise().execute(
      'SELECT career_level FROM users WHERE id = ?',
      [userId]
    );

    if (!user[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userLevel = user[0].career_level;
    const allowedLevels = ['gold', 'star_leader', 'super_star_leader', 'presidents_team', 'country_distributor'];

    if (!allowedLevels.includes(userLevel)) {
      return res.status(403).json({ message: 'Bu özelliğe erişim yetkiniz yok. Gold seviye ve üzeri gereklidir.' });
    }

    // Calculate yearly revenue for pool calculation
    const [revenueResult] = await db.promise().execute(`
      SELECT SUM(total_amount) as yearly_revenue 
      FROM payments 
      WHERE status = 'approved' 
      AND YEAR(created_at) = ?
    `, [currentYear]);

    const yearlyRevenue = revenueResult[0]?.yearly_revenue || 0;

    // Get user's activities for current year
    const [userActivities] = await db.promise().execute(`
      SELECT 
        COUNT(CASE WHEN sale_type = 'product_sale' THEN 1 END) as personal_sales,
        COUNT(CASE WHEN sale_type = 'partner_registration' THEN 1 END) as activated_partners
      FROM sales_tracking 
      WHERE seller_id = ? AND YEAR(sale_date) = ?
    `, [userId, currentYear]);

    const personalSales = userActivities[0]?.personal_sales || 0;
    const activatedPartners = userActivities[0]?.activated_partners || 0;
    const totalActionPoints = personalSales + activatedPartners;

    // Leadership Pool (2% of yearly revenue)
    const leadershipPoolTotal = yearlyRevenue * 0.02;
    const leadershipPoolMonthly = leadershipPoolTotal / 12;

    // Presidency Pool (1% of yearly revenue) - Only for Presidents Team and above
    const presidencyPoolTotal = yearlyRevenue * 0.01;
    const presidencyPoolMonthly = presidencyPoolTotal / 12;

    // Calculate estimated earnings (simplified calculation)
    const totalParticipants = 100; // This should be calculated from actual data
    const pointValue = leadershipPoolMonthly / Math.max(totalParticipants, 1);
    const estimatedLeadershipEarning = totalActionPoints * pointValue;

    const leadershipData = {
      leadership_pool: {
        total_amount: leadershipPoolTotal,
        monthly_amount: leadershipPoolMonthly,
        user_action_points: totalActionPoints,
        total_action_points: totalParticipants * 5, // Estimated
        point_value: pointValue,
        estimated_earning: estimatedLeadershipEarning
      },
      presidency_pool: {
        total_amount: presidencyPoolTotal,
        monthly_amount: presidencyPoolMonthly,
        user_action_points: totalActionPoints,
        total_action_points: totalParticipants * 3, // Estimated
        point_value: presidencyPoolMonthly / Math.max(totalParticipants * 3, 1),
        estimated_earning: totalActionPoints * (presidencyPoolMonthly / Math.max(totalParticipants * 3, 1))
      },
      user_activities: {
        personal_sales: personalSales,
        activated_partners: activatedPartners,
        total_action_points: totalActionPoints,
        target_points: 5,
        remaining_points: Math.max(0, 5 - totalActionPoints)
      },
      access_level: userLevel,
      has_presidency_access: ['presidents_team', 'country_distributor'].includes(userLevel)
    };

    res.json(leadershipData);

  } catch (error) {
    console.error('Leadership pools error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Global Travel Data API - İyileştirilmiş versiyon
app.get('/api/global-travel/data', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentYear = new Date().getFullYear();

    // Get user's sales data for current year
    const [salesData] = await db.promise().execute(`
      SELECT 
        SUM(CASE WHEN sale_type = 'product_sale' THEN sale_amount ELSE 0 END) as total_sales_tl,
        COUNT(CASE WHEN sale_type = 'product_sale' THEN 1 END) as total_sales_count
      FROM sales_tracking 
      WHERE seller_id = ? AND YEAR(sale_date) = ?
    `, [userId, currentYear]);

    // Get user's partnership data
    const [partnershipData] = await db.promise().execute(`
      SELECT COUNT(*) as active_partners 
      FROM users 
      WHERE created_by = ? AND is_active = TRUE
    `, [userId]);

    const totalSalesTL = salesData[0]?.total_sales_tl || 0;
    const totalSalesCount = salesData[0]?.total_sales_count || 0;
    const activePartners = partnershipData[0]?.active_partners || 0;

    // Convert TL to USD for comparison (assuming 1 USD = 40 TL)
    const totalSalesUSD = totalSalesTL / 40;

    // Travel targets
    const sales1Target = 40000; // USD
    const sales2Target = 65000; // USD
    const partnershipTarget = 5;

    const travelData = {
      startDate: 'EYLÜL 2025',
      endDate: 'AĞUSTOS 2026',
      sales1: {
        target: sales1Target,
        current: Math.min(totalSalesUSD, sales1Target),
        remaining: Math.max(0, sales1Target - totalSalesUSD),
        percentage: Math.min(100, (totalSalesUSD / sales1Target) * 100)
      },
      sales2: {
        target: sales2Target,
        current: Math.min(totalSalesUSD, sales2Target),
        remaining: Math.max(0, sales2Target - totalSalesUSD),
        percentage: Math.min(100, (totalSalesUSD / sales2Target) * 100)
      },
      partnership: {
        target: partnershipTarget,
        current: Math.min(activePartners, partnershipTarget),
        remaining: Math.max(0, partnershipTarget - activePartners),
        percentage: Math.min(100, (activePartners / partnershipTarget) * 100)
      },
      total_sales_tl: totalSalesTL,
      total_sales_usd: totalSalesUSD,
      total_sales_count: totalSalesCount,
      is_qualified_level1: totalSalesUSD >= sales1Target && activePartners >= partnershipTarget,
      is_qualified_level2: totalSalesUSD >= sales2Target && activePartners >= partnershipTarget
    };

    res.json(travelData);

  } catch (error) {
    console.error('Global travel data error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Doping Promotion Progress API - İyileştirilmiş versiyon
app.get('/api/doping-promotion/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user registration date
    const [userInfo] = await db.promise().execute(
      'SELECT created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!userInfo[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    const registrationDate = new Date(userInfo[0].created_at);
    const now = new Date();
    const daysSinceRegistration = Math.floor((now - registrationDate) / (1000 * 60 * 60 * 24));

    // Get user's sales and partnership data
    const [salesData] = await db.promise().execute(`
      SELECT COUNT(*) as device_sales
      FROM customers c
      WHERE c.created_by = ? AND c.selected_product = 'device'
    `, [userId]);

    const [teamSalesData] = await db.promise().execute(`
      SELECT COUNT(*) as team_device_sales
      FROM customers c
      INNER JOIN users u ON c.created_by = u.id
      WHERE u.created_by = ? AND c.selected_product = 'device'
    `, [userId]);

    const [partnerData] = await db.promise().execute(`
      SELECT COUNT(*) as total_partners
      FROM users u
      WHERE u.created_by = ? AND u.role = 'partner'
    `, [userId]);

    const personalSales = salesData[0]?.device_sales || 0;
    const teamSales = teamSalesData[0]?.team_device_sales || 0;
    const totalSales = personalSales + teamSales;
    const totalPartners = partnerData[0]?.total_partners || 0;

    // Calculate stages
    const etap1 = {
      baslangic_tarihi: new Date(registrationDate).toLocaleDateString('tr-TR'),
      bitis_tarihi: new Date(registrationDate.getTime() + (60 * 24 * 60 * 60 * 1000)).toLocaleDateString('tr-TR'),
      hedef_satis: 40,
      yapilan_satis: Math.min(totalSales, 40),
      kalan_satis: Math.max(0, 40 - totalSales),
      hedef_ortak: 7,
      yapilan_ortak: Math.min(totalPartners, 7),
      kalan_ortak: Math.max(0, 7 - totalPartners),
      kazanilacak_puan: totalSales * 2, // 2x multiplier
      tamamlandi: daysSinceRegistration <= 60 && totalSales >= 40 && totalPartners >= 7,
      aktif: daysSinceRegistration <= 60,
      kalan_gun: Math.max(0, 60 - daysSinceRegistration)
    };

    const etap2 = {
      baslangic_tarihi: new Date(registrationDate.getTime() + (61 * 24 * 60 * 60 * 1000)).toLocaleDateString('tr-TR'),
      bitis_tarihi: new Date(registrationDate.getTime() + (120 * 24 * 60 * 60 * 1000)).toLocaleDateString('tr-TR'),
      hedef_satis: 80,
      yapilan_satis: Math.min(totalSales, 80),
      kalan_satis: Math.max(0, 80 - totalSales),
      hedef_ortak: 15,
      yapilan_ortak: Math.min(totalPartners, 15),
      kalan_ortak: Math.max(0, 15 - totalPartners),
      kazanilacak_puan: totalSales * 2, // 2x multiplier
      tamamlandi: daysSinceRegistration > 60 && daysSinceRegistration <= 120 && totalSales >= 80 && totalPartners >= 15,
      aktif: daysSinceRegistration > 60 && daysSinceRegistration <= 120,
      kalan_gun: daysSinceRegistration > 60 ? Math.max(0, 120 - daysSinceRegistration) : 0
    };

    // Determine current stage
    let currentStage = 0;
    if (daysSinceRegistration <= 60) {
      currentStage = 1;
    } else if (daysSinceRegistration <= 120) {
      currentStage = 2;
    }

    // Calculate current multiplier
    let currentMultiplier = 1;
    if (etap1.tamamlandi || etap2.tamamlandi) {
      currentMultiplier = 2;
    }

    const dopingData = {
      etap1,
      etap2,
      days_since_registration: daysSinceRegistration,
      current_stage: currentStage,
      current_multiplier: currentMultiplier,
      total_sales: totalSales,
      total_partners: totalPartners,
      personal_sales: personalSales,
      team_sales: teamSales,
      registration_date: registrationDate.toLocaleDateString('tr-TR')
    };

    res.json(dopingData);

  } catch (error) {
    console.error('Doping promotion progress error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// ==================== DUPLICATE API'LERİ TEMİZLEME ====================
// Not: Duplicate API'ler manuel olarak temizlenecek
// ============= MUHASEBE BİLGİLERİ API'LERİ ====================

// Muhasebe bilgilerini kontrol et
app.get('/api/accounting/info', verifyToken, async (req, res) => {
  try {
    const [accountingInfo] = await db.promise().execute(
      'SELECT * FROM accounting_info WHERE user_id = ?',
      [req.user.id]
    );

    if (accountingInfo.length > 0) {
      res.json({
        success: true,
        accountingInfo: accountingInfo[0]
      });
    } else {
      res.json({
        success: false,
        message: 'Muhasebe bilgisi bulunamadı'
      });
    }
  } catch (error) {
    console.error('Accounting info check error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Muhasebe bilgilerini kaydet
app.post('/api/accounting/register', verifyToken, upload.fields([
  { name: 'tc_identity_front', maxCount: 1 },
  { name: 'tax_plate', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      account_type,
      iban,
      bank_name,
      account_holder_name,
      company_name,
      tax_number
    } = req.body;

    // Mevcut kayıt kontrolü
    const [existing] = await db.promise().execute(
      'SELECT id FROM accounting_info WHERE user_id = ?',
      [req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Zaten kayıtlı muhasebe bilginiz bulunmaktadır'
      });
    }

    // IBAN formatı kontrolü
    const ibanRegex = /^TR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/;
    if (!ibanRegex.test(iban.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz IBAN formatı'
      });
    }

    // Dosya kontrolü
    if (account_type === 'individual' && !req.files?.tc_identity_front) {
      return res.status(400).json({
        success: false,
        message: 'TC kimlik belgesi ön yüzü gereklidir'
      });
    }

    if (account_type === 'company' && !req.files?.tax_plate) {
      return res.status(400).json({
        success: false,
        message: 'Vergi levhası gereklidir'
      });
    }

    // Dosya yollarını hazırla
    let tcIdentityPath = null;
    let taxPlatePath = null;

    if (req.files?.tc_identity_front) {
      tcIdentityPath = req.files.tc_identity_front[0].path;
    }

    if (req.files?.tax_plate) {
      taxPlatePath = req.files.tax_plate[0].path;
    }

    // Veritabanına kaydet
    const [result] = await db.promise().execute(`
      INSERT INTO accounting_info (
        user_id, account_type, iban, bank_name, account_holder_name,
        company_name, tax_number, tc_identity_front, tax_plate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      account_type,
      iban.replace(/\s/g, ''),
      bank_name || null,
      account_holder_name,
      company_name || null,
      tax_number || null,
      tcIdentityPath,
      taxPlatePath
    ]);

    // Kayıtlı bilgiyi getir
    const [newRecord] = await db.promise().execute(
      'SELECT * FROM accounting_info WHERE id = ?',
      [result.insertId]
    );

    res.json({
      success: true,
      message: 'Muhasebe bilgileri başarıyla kaydedildi',
      accountingInfo: newRecord[0]
    });

  } catch (error) {
    console.error('Accounting registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu'
    });
  }
});

// Muhasebe verilerini getir (sadece onaylanmış kullanıcılar için)
app.get('/api/accounting/data', verifyToken, async (req, res) => {
  try {
    // Önce kullanıcının muhasebe bilgilerinin onaylanıp onaylanmadığını kontrol et
    const [accountingInfo] = await db.promise().execute(
      'SELECT is_approved FROM accounting_info WHERE user_id = ?',
      [req.user.id]
    );

    if (accountingInfo.length === 0 || !accountingInfo[0].is_approved) {
      return res.status(403).json({
        success: false,
        message: 'Muhasebe paneline erişim yetkiniz bulunmamaktadır'
      });
    }

    // Muhasebe verilerini getir (örnek veri - gerçek implementasyon gerekli)
    const bireyselData = [
      {
        id: 1,
        earning_type: 'Satış Komisyonu',
        related_person: 'Ahmet Yılmaz',
        sale_date: '2025-01-15',
        earn_date: '2025-01-30',
        payment_date: '2025-02-01',
        amount_usd: 100,
        stopaj_amount: 80,
        exchange_rate: 40,
        net_amount_tl: 3200,
        payment_status: 'ÖDENDİ'
      }
    ];

    const sirketData = [
      {
        id: 1,
        earning_type: 'Satış Komisyonu',
        related_person: 'ABC Ltd. Şti.',
        sale_date: '2025-01-15',
        earn_date: '2025-01-30',
        payment_date: '2025-02-01',
        amount_usd: 100,
        taxed_amount: 120,
        exchange_rate: 40,
        net_amount_tl: 4800,
        payment_status: 'ÖDENDİ'
      }
    ];

    res.json({
      success: true,
      data: {
        bireysel: bireyselData,
        sirket: sirketData
      }
    });

  } catch (error) {
    console.error('Accounting data fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Muhasebe verileri yüklenirken hata oluştu'
    });
  }
});

// Admin: Muhasebe onayları listesi
app.get('/api/admin/accounting/pending', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [pendingApprovals] = await db.promise().execute(`
      SELECT 
        ai.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM accounting_info ai
      JOIN users u ON ai.user_id = u.id
      WHERE ai.is_approved = FALSE
      ORDER BY ai.created_at DESC
    `);

    res.json({
      success: true,
      pendingApprovals
    });

  } catch (error) {
    console.error('Pending approvals fetch error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Admin: Muhasebe onayı/reddi
app.post('/api/admin/accounting/approve/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejection_reason } = req.body; // action: 'approve' or 'reject'

    if (action === 'approve') {
      await db.promise().execute(
        'UPDATE accounting_info SET is_approved = TRUE, approval_date = NOW() WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Muhasebe bilgileri onaylandı'
      });
    } else if (action === 'reject') {
      await db.promise().execute(
        'UPDATE accounting_info SET is_approved = FALSE, rejection_reason = ? WHERE id = ?',
        [rejection_reason || 'Belgeler uygun değil', id]
      );

      res.json({
        success: true,
        message: 'Muhasebe bilgileri reddedildi'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Geçersiz işlem'
      });
    }

  } catch (error) {
    console.error('Accounting approval error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});