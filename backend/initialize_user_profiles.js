const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Fetih1453.',
  database: process.env.DB_NAME || 'hoowell_network'
});

const initializeUserProfiles = async () => {
  try {
    console.log('Starting user profiles initialization...');
    
    // Get all users
    const [users] = await db.promise().execute(`
      SELECT id, created_at, role 
      FROM users 
      WHERE role = 'partner'
      ORDER BY created_at ASC
    `);
    
    console.log(`Found ${users.length} users to process`);
    
    // Process each user
    for (const user of users) {
      // Check if profile already exists
      const [existing] = await db.promise().execute(
        'SELECT id FROM user_profiles WHERE user_id = ?',
        [user.id]
      );
      
      if (existing.length === 0) {
        // Create profile
        await db.promise().execute(`
          INSERT INTO user_profiles (
            user_id, join_date, total_sales, monthly_sales, team_size, 
            active_team_members, personal_volume, team_volume, 
            is_active_this_month, created_at
          ) VALUES (?, ?, 0, 0, 0, 0, 0, 0, FALSE, ?)
        `, [user.id, user.created_at, user.created_at]);
        
        console.log(`Created profile for user ${user.id}`);
      } else {
        console.log(`Profile already exists for user ${user.id}`);
      }
      
      // Create sponsorship earnings record if user has a sponsor
      const [userInfo] = await db.promise().execute(
        'SELECT created_by FROM users WHERE id = ?',
        [user.id]
      );
      
      if (userInfo[0] && userInfo[0].created_by) {
        const [existingEarnings] = await db.promise().execute(
          'SELECT id FROM sponsorship_earnings WHERE sponsor_id = ? AND partner_id = ?',
          [userInfo[0].created_by, user.id]
        );
        
        if (existingEarnings.length === 0) {
          await db.promise().execute(`
            INSERT INTO sponsorship_earnings (
              sponsor_id, partner_id, bronze_earnings, silver_earnings, 
              gold_earnings, star_earnings, super_star_earnings, 
              monthly_earnings, first_sale_activated, created_at
            ) VALUES (?, ?, 0, 0, 0, 0, 0, 0, FALSE, ?)
          `, [userInfo[0].created_by, user.id, user.created_at]);
          
          console.log(`Created sponsorship earnings record: sponsor ${userInfo[0].created_by} -> partner ${user.id}`);
        }
      }
    }
    
    console.log('User profiles initialization completed successfully!');
    
  } catch (error) {
    console.error('User profiles initialization error:', error);
  } finally {
    db.end();
  }
};

// Run the initialization
initializeUserProfiles();