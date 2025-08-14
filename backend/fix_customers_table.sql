-- Customers tablosuna eksik sözleşme kolonlarını ekle
ALTER TABLE customers 
ADD COLUMN contract3_accepted BOOLEAN DEFAULT FALSE COMMENT 'Mesafeli Satış Sözleşmesi',
ADD COLUMN contract4_accepted BOOLEAN DEFAULT FALSE COMMENT 'Ön Bilgilendirme Formu',
ADD COLUMN contract5_accepted BOOLEAN DEFAULT FALSE COMMENT 'Elektronik Ticaret Bilgilendirmesi';

-- Eksik kolonları kontrol et
DESCRIBE customers;