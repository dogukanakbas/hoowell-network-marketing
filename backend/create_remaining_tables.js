const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Fetih1453.',
  database: process.env.DB_NAME || 'hoowell_network'
});

const createRemainingTables = async () => {
  try {
    console.log('Creating remaining tables...');
    
    // Create user_profiles table
    await db.promise().execute(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        profile_photo VARCHAR(255),
        join_date DATE NOT NULL,
        last_login DATETIME,
        total_sales DECIMAL(15,2) DEFAULT 0,
        monthly_sales DECIMAL(15,2) DEFAULT 0,
        team_size INT DEFAULT 0,
        active_team_members INT DEFAULT 0,
        personal_volume DECIMAL(15,2) DEFAULT 0,
        team_volume DECIMAL(15,2) DEFAULT 0,
        rank_qualification_date DATE,
        next_rank_target DECIMAL(15,2) DEFAULT 0,
        achievements JSON,
        notes TEXT,
        is_active_this_month BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE KEY unique_user_profile (user_id),
        INDEX idx_user_id (user_id),
        INDEX idx_join_date (join_date),
        INDEX idx_total_sales (total_sales)
      )
    `);
    console.log('✓ user_profiles table created');

    // Create sponsorship_earnings table
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
        UNIQUE KEY unique_sponsor_partner (sponsor_id, partner_id),
        INDEX idx_sponsor_id (sponsor_id),
        INDEX idx_partner_id (partner_id)
      )
    `);
    console.log('✓ sponsorship_earnings table created');

    // Create sales_tracking table
    await db.promise().execute(`
      CREATE TABLE IF NOT EXISTS sales_tracking (
        id INT PRIMARY KEY AUTO_INCREMENT,
        seller_id INT NOT NULL,
        customer_id INT,
        partner_id INT,
        sale_type ENUM('education_package', 'product_sale', 'partner_registration') NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        sale_amount DECIMAL(10,2) NOT NULL,
        bonus_amount DECIMAL(10,2) NOT NULL,
        sale_date DATETIME NOT NULL,
        bonus_date DATETIME NOT NULL,
        status ENUM('pending', 'active', 'completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (partner_id) REFERENCES users(id),
        INDEX idx_seller_id (seller_id),
        INDEX idx_sale_date (sale_date),
        INDEX idx_status (status)
      )
    `);
    console.log('✓ sales_tracking table created');

    // Create network_tree table
    await db.promise().execute(`
      CREATE TABLE IF NOT EXISTS network_tree (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        parent_id INT,
        sponsor_id INT,
        level INT DEFAULT 1,
        position ENUM('left', 'right', 'center') DEFAULT 'center',
        tree_path VARCHAR(500),
        left_count INT DEFAULT 0,
        right_count INT DEFAULT 0,
        total_downline INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (parent_id) REFERENCES users(id),
        FOREIGN KEY (sponsor_id) REFERENCES users(id),
        UNIQUE KEY unique_user_tree (user_id),
        INDEX idx_parent_id (parent_id),
        INDEX idx_sponsor_id (sponsor_id),
        INDEX idx_level (level),
        INDEX idx_tree_path (tree_path)
      )
    `);
    console.log('✓ network_tree table created');

    // Fix career_bonuses table - add missing column
    try {
      await db.promise().execute(`
        ALTER TABLE career_bonuses 
        ADD COLUMN awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✓ awarded_at column added to career_bonuses table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ awarded_at column already exists in career_bonuses table');
      } else {
        console.error('Error adding awarded_at column:', error.message);
      }
    }

    console.log('All tables created successfully!');
    
  } catch (error) {
    console.error('Create tables error:', error);
  } finally {
    db.end();
  }
};

// Run the creation
createRemainingTables();