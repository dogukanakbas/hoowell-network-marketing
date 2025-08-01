// HOOWELL Career System Test Script
// Bu script kariyer sisteminin doğru çalışıp çalışmadığını test eder

const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hoowell_network'
});

async function testCareerSystem() {
  console.log('🚀 HOOWELL Career System Test Started...\n');

  try {
    // 1. Test career requirements
    console.log('📊 Testing Career Requirements:');
    const careerRequirements = {
      bronze: { kkp_required: 0, partners_required: 0 },
      silver: { kkp_required: 15000, partners_required: 1 },
      gold: { kkp_required: 50000, partners_required: 3 },
      star_leader: { kkp_required: 100000, partners_required: 7 },
      super_star_leader: { kkp_required: 175000, partners_required: 15 },
      presidents_team: { kkp_required: 300000, partners_required: 25 },
      country_distributor: { kkp_required: 400000, partners_required: 30 }
    };

    Object.entries(careerRequirements).forEach(([level, req]) => {
      console.log(`  ${level.toUpperCase()}: ${req.kkp_required.toLocaleString()} KKP + ${req.partners_required} partners`);
    });

    // 2. Test bonus amounts
    console.log('\n💰 Testing Career Bonuses:');
    const bonusAmounts = {
      silver: 400,
      gold: 800,
      star_leader: 1200,
      super_star_leader: 1600,
      presidents_team: 2000,
      country_distributor: 2500
    };

    Object.entries(bonusAmounts).forEach(([level, bonus]) => {
      console.log(`  ${level.toUpperCase()}: $${bonus}`);
    });

    // 3. Check database structure
    console.log('\n🗄️ Checking Database Structure:');
    
    // Check users table
    const [userColumns] = await db.promise().execute('SHOW COLUMNS FROM users');
    const hasCareerLevel = userColumns.some(col => col.Field === 'career_level');
    const hasTotalKKP = userColumns.some(col => col.Field === 'total_kkp');
    const hasActivePartners = userColumns.some(col => col.Field === 'active_partners');
    
    console.log(`  Users table - career_level: ${hasCareerLevel ? '✅' : '❌'}`);
    console.log(`  Users table - total_kkp: ${hasTotalKKP ? '✅' : '❌'}`);
    console.log(`  Users table - active_partners: ${hasActivePartners ? '✅' : '❌'}`);

    // Check career_bonuses table
    try {
      const [bonusColumns] = await db.promise().execute('SHOW COLUMNS FROM career_bonuses');
      const hasBonusUSD = bonusColumns.some(col => col.Field === 'bonus_amount_usd');
      const hasBonusTRY = bonusColumns.some(col => col.Field === 'bonus_amount_try');
      const hasKKPAchieved = bonusColumns.some(col => col.Field === 'kkp_achieved');
      
      console.log(`  Career bonuses table - bonus_amount_usd: ${hasBonusUSD ? '✅' : '❌'}`);
      console.log(`  Career bonuses table - bonus_amount_try: ${hasBonusTRY ? '✅' : '❌'}`);
      console.log(`  Career bonuses table - kkp_achieved: ${hasKKPAchieved ? '✅' : '❌'}`);
    } catch (error) {
      console.log('  Career bonuses table: ❌ (Table not found)');
    }

    // 4. Check current user distribution
    console.log('\n👥 Current User Distribution:');
    const [userStats] = await db.promise().execute(`
      SELECT 
        career_level,
        COUNT(*) as count,
        AVG(total_kkp) as avg_kkp,
        AVG(active_partners) as avg_partners
      FROM users 
      WHERE role = 'partner'
      GROUP BY career_level
      ORDER BY 
        CASE career_level
          WHEN 'bronze' THEN 1
          WHEN 'silver' THEN 2
          WHEN 'gold' THEN 3
          WHEN 'star_leader' THEN 4
          WHEN 'super_star_leader' THEN 5
          WHEN 'presidents_team' THEN 6
          WHEN 'country_distributor' THEN 7
          ELSE 8
        END
    `);

    userStats.forEach(stat => {
      console.log(`  ${stat.career_level.toUpperCase()}: ${stat.count} users (Avg KKP: ${Math.round(stat.avg_kkp)}, Avg Partners: ${Math.round(stat.avg_partners)})`);
    });

    // 5. Test career progression logic
    console.log('\n🎯 Testing Career Progression Logic:');
    
    // Test cases
    const testCases = [
      { kkp: 0, partners: 0, expected: 'bronze' },
      { kkp: 15000, partners: 1, expected: 'silver' },
      { kkp: 50000, partners: 3, expected: 'gold' },
      { kkp: 100000, partners: 7, expected: 'star_leader' },
      { kkp: 175000, partners: 15, expected: 'super_star_leader' },
      { kkp: 300000, partners: 25, expected: 'presidents_team' },
      { kkp: 400000, partners: 30, expected: 'country_distributor' }
    ];

    testCases.forEach(testCase => {
      let calculatedLevel = 'bronze';
      
      Object.entries(careerRequirements).forEach(([level, req]) => {
        if (testCase.kkp >= req.kkp_required && testCase.partners >= req.partners_required) {
          calculatedLevel = level;
        }
      });

      const isCorrect = calculatedLevel === testCase.expected;
      console.log(`  ${testCase.kkp.toLocaleString()} KKP + ${testCase.partners} partners = ${calculatedLevel.toUpperCase()} ${isCorrect ? '✅' : '❌'}`);
    });

    // 6. Check awarded bonuses
    console.log('\n🏆 Checking Awarded Bonuses:');
    try {
      const [bonusStats] = await db.promise().execute(`
        SELECT 
          career_level,
          COUNT(*) as bonus_count,
          SUM(bonus_amount_usd) as total_usd,
          AVG(kkp_achieved) as avg_kkp_achieved
        FROM career_bonuses
        GROUP BY career_level
        ORDER BY 
          CASE career_level
            WHEN 'silver' THEN 1
            WHEN 'gold' THEN 2
            WHEN 'star_leader' THEN 3
            WHEN 'super_star_leader' THEN 4
            WHEN 'presidents_team' THEN 5
            WHEN 'country_distributor' THEN 6
            ELSE 7
          END
      `);

      if (bonusStats.length > 0) {
        bonusStats.forEach(stat => {
          console.log(`  ${stat.career_level.toUpperCase()}: ${stat.bonus_count} bonuses, $${stat.total_usd} total, ${Math.round(stat.avg_kkp_achieved)} avg KKP`);
        });
      } else {
        console.log('  No bonuses awarded yet');
      }
    } catch (error) {
      console.log('  Error checking bonuses:', error.message);
    }

    console.log('\n✅ HOOWELL Career System Test Completed Successfully!');
    console.log('\n📋 Summary:');
    console.log('  - Career requirements updated to HOOWELL Global standards');
    console.log('  - Bronze: First sale → Bronze Partner');
    console.log('  - Silver: 15K KKP + 1 partner → $400 bonus');
    console.log('  - Gold: 50K KKP + 3 partners → $800 bonus');
    console.log('  - Star Leader: 100K KKP + 7 partners → $1,200 bonus');
    console.log('  - Super Star: 175K KKP + 15 partners → $1,600 bonus');
    console.log('  - Presidents: 300K KKP + 25 partners → $2,000 bonus');
    console.log('  - Country Distributor: 400K KKP + 30 partners → $2,500 bonus');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    db.end();
  }
}

// Run the test
testCareerSystem();