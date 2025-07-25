const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Fetih1453.',
  database: process.env.DB_NAME || 'hoowell_network'
});

const updateSponsorshipEarnings = async () => {
  try {
    console.log('Starting sponsorship earnings update...');
    
    // Get all sponsorship earnings records
    const [earnings] = await db.promise().execute(`
      SELECT se.*, 
             sponsor.first_name as sponsor_name, 
             partner.first_name as partner_name,
             partner.career_level
      FROM sponsorship_earnings se
      JOIN users sponsor ON se.sponsor_id = sponsor.id
      JOIN users partner ON se.partner_id = partner.id
      ORDER BY se.created_at ASC
    `);
    
    console.log(`Found ${earnings.length} sponsorship records to update`);
    
    // Simulate some earnings for testing
    for (const earning of earnings) {
      // Simulate partner making sales based on their career level
      let bronzeEarnings = 0;
      let silverEarnings = 0;
      let goldEarnings = 0;
      let starEarnings = 0;
      let superStarEarnings = 0;
      let monthlyEarnings = 0;
      
      // Simulate earnings based on partner's career level
      const partnerLevel = earning.career_level || 'bronze';
      
      // Bronze level earnings (5% of $1000 = $50)
      if (['bronze', 'silver', 'gold', 'star_leader', 'super_star_leader'].includes(partnerLevel)) {
        bronzeEarnings = Math.min(50 + Math.random() * 100, 750); // Max 750
      }
      
      // Silver level earnings (4% of $1500 = $60)
      if (['silver', 'gold', 'star_leader', 'super_star_leader'].includes(partnerLevel)) {
        silverEarnings = Math.min(60 + Math.random() * 150, 1200); // Max 1200
      }
      
      // Gold level earnings (3% of $2000 = $60)
      if (['gold', 'star_leader', 'super_star_leader'].includes(partnerLevel)) {
        goldEarnings = Math.min(60 + Math.random() * 200, 1350); // Max 1350
      }
      
      // Star level earnings (2% of $3000 = $60)
      if (['star_leader', 'super_star_leader'].includes(partnerLevel)) {
        starEarnings = Math.min(60 + Math.random() * 150, 1200); // Max 1200
      }
      
      // Super Star level earnings (1% of $5000 = $50)
      if (['super_star_leader'].includes(partnerLevel)) {
        superStarEarnings = Math.min(50 + Math.random() * 100, 750); // Max 750
      }
      
      // Calculate monthly earnings (current month portion)
      monthlyEarnings = (bronzeEarnings + silverEarnings + goldEarnings + starEarnings + superStarEarnings) * 0.3;
      
      // Update the record
      await db.promise().execute(`
        UPDATE sponsorship_earnings SET
        bronze_earnings = ?,
        silver_earnings = ?,
        gold_earnings = ?,
        star_earnings = ?,
        super_star_earnings = ?,
        monthly_earnings = ?,
        first_sale_activated = TRUE,
        activation_date = NOW()
        WHERE id = ?
      `, [
        bronzeEarnings.toFixed(2),
        silverEarnings.toFixed(2), 
        goldEarnings.toFixed(2),
        starEarnings.toFixed(2),
        superStarEarnings.toFixed(2),
        monthlyEarnings.toFixed(2),
        earning.id
      ]);
      
      console.log(`Updated earnings for sponsor ${earning.sponsor_name} -> partner ${earning.partner_name}:`);
      console.log(`  Bronze: $${bronzeEarnings.toFixed(2)}, Silver: $${silverEarnings.toFixed(2)}, Gold: $${goldEarnings.toFixed(2)}`);
      console.log(`  Star: $${starEarnings.toFixed(2)}, Super Star: $${superStarEarnings.toFixed(2)}, Monthly: $${monthlyEarnings.toFixed(2)}`);
    }
    
    console.log('Sponsorship earnings update completed successfully!');
    
  } catch (error) {
    console.error('Sponsorship earnings update error:', error);
  } finally {
    db.end();
  }
};

// Run the update
updateSponsorshipEarnings();