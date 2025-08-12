-- Muhasebe bilgileri tablosu
CREATE TABLE IF NOT EXISTS accounting_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account_type ENUM('individual', 'company') NOT NULL,
    
    -- Ortak bilgiler
    iban VARCHAR(34) NOT NULL,
    bank_name VARCHAR(100),
    account_holder_name VARCHAR(100) NOT NULL,
    
    -- Bireysel için
    tc_identity_front VARCHAR(255), -- TC kimlik ön yüz dosya yolu
    
    -- Şirket için
    tax_plate VARCHAR(255), -- Vergi levhası dosya yolu
    company_name VARCHAR(100),
    tax_number VARCHAR(20),
    
    -- Durum bilgileri
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date TIMESTAMP NULL,
    rejection_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_accounting (user_id)
);

-- Dosya yükleme tablosu
CREATE TABLE IF NOT EXISTS accounting_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accounting_info_id INT NOT NULL,
    document_type ENUM('tc_identity_front', 'tax_plate') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (accounting_info_id) REFERENCES accounting_info(id) ON DELETE CASCADE
);