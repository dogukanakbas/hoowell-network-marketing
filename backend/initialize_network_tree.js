const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Fetih1453.',
  database: process.env.DB_NAME || 'hoowell_network'
});

const initializeNetworkTree = async () => {
  try {
    console.log('Starting network tree initialization...');
    
    // Get all users with their sponsors
    const [users] = await db.promise().execute(`
      SELECT id, created_by, sponsor_id, created_at 
      FROM users 
      WHERE role = 'partner' 
      ORDER BY created_at ASC
    `);
    
    console.log(`Found ${users.length} users to process`);
    
    // Clear existing network tree data
    await db.promise().execute('DELETE FROM network_tree');
    console.log('Cleared existing network tree data');
    
    // Process each user
    for (const user of users) {
      let level = 1;
      let treePath = user.id.toString();
      
      if (user.created_by) {
        // Get sponsor's tree info
        const [sponsorTree] = await db.promise().execute(
          'SELECT level, tree_path FROM network_tree WHERE user_id = ?',
          [user.created_by]
        );
        
        if (sponsorTree.length > 0) {
          level = sponsorTree[0].level + 1;
          treePath = `${sponsorTree[0].tree_path}/${user.id}`;
        }
      }
      
      // Insert into network tree
      await db.promise().execute(`
        INSERT INTO network_tree (
          user_id, parent_id, sponsor_id, level, tree_path, 
          left_count, right_count, total_downline, created_at
        ) VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?)
      `, [user.id, user.created_by, user.created_by, level, treePath, user.created_at]);
      
      console.log(`Added user ${user.id} (${user.sponsor_id}) to network tree at level ${level}`);
    }
    
    // Update downline counts for all users
    console.log('Updating downline counts...');
    
    for (const user of users) {
      await updateDownlineCounts(user.id);
    }
    
    console.log('Network tree initialization completed successfully!');
    
  } catch (error) {
    console.error('Network tree initialization error:', error);
  } finally {
    db.end();
  }
};

const updateDownlineCounts = async (userId) => {
  try {
    // Count direct downline
    const [directCount] = await db.promise().execute(
      'SELECT COUNT(*) as count FROM users WHERE created_by = ? AND role = "partner"',
      [userId]
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
    
    const totalDownline = await getTotalDownline(userId);
    
    // Update network tree
    await db.promise().execute(
      'UPDATE network_tree SET total_downline = ? WHERE user_id = ?',
      [totalDownline, userId]
    );
    
    // Update user's active partners count
    await db.promise().execute(
      'UPDATE users SET active_partners = ? WHERE id = ?',
      [directCount[0].count, userId]
    );
    
  } catch (error) {
    console.error(`Update downline counts error for user ${userId}:`, error);
  }
};

// Run the initialization
initializeNetworkTree();