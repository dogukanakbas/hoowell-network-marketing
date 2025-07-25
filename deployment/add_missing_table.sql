-- Eksik customer_satisfaction_rewards tablosunu ekle
USE hoowell_network;

-- Önce tablo var mı kontrol et
CREATE TABLE IF NOT EXISTS customer_satisfaction_rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    reward_type ENUM('referral', 'satisfaction', 'loyalty') NOT NULL,
    reward_amount_usd DECIMAL(10,2) NOT NULL,
    reward_amount_try DECIMAL(10,2) NOT NULL,
    reward_date DATETIME NOT NULL,
    status ENUM('pending', 'approved', 'paid') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_reward_date (reward_date),
    INDEX idx_status (status)
);

-- Tablo oluşturuldu mu kontrol et
SELECT 'customer_satisfaction_rewards table created successfully' as status;