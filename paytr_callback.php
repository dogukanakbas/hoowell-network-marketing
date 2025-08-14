<?php
/**
 * PayTR Callback Handler
 * HOOWELL Payment System
 */

// Error reporting (production'da kapatılabilir)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Content type
header('Content-Type: text/plain');

// Log dosyası
$logFile = '/var/log/hoowell/paytr_callback.log';

// PayTR Merchant bilgileri
$merchant_id = '605940';
$merchant_key = 'tMCPPznCxw8sb8b8';
$merchant_salt = 'bF1uwkXPAhDw5yok';

try {
    // Gelen veriyi logla
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => $_SERVER['REQUEST_METHOD'],
        'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'post_data' => $_POST,
        'raw_input' => file_get_contents('php://input')
    ];
    
    file_put_contents($logFile, json_encode($logData, JSON_PRETTY_PRINT) . "\n" . str_repeat('-', 50) . "\n", FILE_APPEND | LOCK_EX);

    // PayTR parametrelerini al
    $merchant_oid = $_POST['merchant_oid'] ?? '';
    $status = $_POST['status'] ?? '';
    $total_amount = $_POST['total_amount'] ?? '';
    $hash = $_POST['hash'] ?? '';

    // Parametreleri kontrol et
    if (empty($merchant_oid) || empty($status) || empty($hash)) {
        error_log("PayTR Callback: Eksik parametreler - merchant_oid: $merchant_oid, status: $status, hash: $hash");
        echo "FAIL";
        exit;
    }

    // Hash doğrulaması
    $check_hash = base64_encode(hash_hmac('sha256', $merchant_oid . $merchant_salt . $status . $total_amount, $merchant_key, true));
    
    if ($hash !== $check_hash) {
        error_log("PayTR Callback: Hash doğrulama hatası - Gelen: $hash, Hesaplanan: $check_hash");
        echo "FAIL";
        exit;
    }

    // Database bağlantısı
    $host = 'localhost';
    $dbname = 'hoowell_network';
    $username = 'hoowell_user';
    $password = 'Fetih1453.';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ödeme kaydını bul
    $stmt = $pdo->prepare("SELECT * FROM payments WHERE merchant_oid = ?");
    $stmt->execute([$merchant_oid]);
    $payment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$payment) {
        error_log("PayTR Callback: Ödeme kaydı bulunamadı - $merchant_oid");
        echo "FAIL";
        exit;
    }

    // Eğer ödeme zaten işlenmişse tekrar işleme
    if ($payment['status'] === 'approved' && $status === 'success') {
        error_log("PayTR Callback: Ödeme zaten onaylanmış - $merchant_oid");
        echo "OK";
        exit;
    }

    // Ödeme durumunu güncelle
    $payment_status = ($status === 'success') ? 'approved' : 'failed';
    
    $stmt = $pdo->prepare("UPDATE payments SET status = ?, paytr_status = ?, updated_at = NOW() WHERE merchant_oid = ?");
    $stmt->execute([$payment_status, $status, $merchant_oid]);

    // Başarılı ödeme işlemleri
    if ($status === 'success') {
        if ($payment['payment_type'] === 'education') {
            // Eğitim erişimi aç
            $stmt = $pdo->prepare("UPDATE users SET education_access = 1 WHERE id = ?");
            $stmt->execute([$payment['user_id']]);
            error_log("PayTR Callback: Eğitim erişimi açıldı - User ID: " . $payment['user_id']);
            
        } elseif ($payment['payment_type'] === 'device') {
            // Cihaz ödemesi tamamlandı
            error_log("PayTR Callback: Cihaz ödemesi tamamlandı - User ID: " . $payment['user_id']);
            
        } elseif ($payment['payment_type'] === 'franchise' && !empty($payment['partner_id'])) {
            // İş ortağı kaydını aktif et
            $stmt = $pdo->prepare("UPDATE business_partners SET payment_status = 'completed', status = 'active' WHERE id = ?");
            $stmt->execute([$payment['partner_id']]);
            error_log("PayTR Callback: İş ortağı aktif edildi - Partner ID: " . $payment['partner_id']);
        }
    }

    error_log("PayTR Callback: Başarılı - $merchant_oid - $status - $total_amount");
    echo "OK";

} catch (Exception $e) {
    error_log("PayTR Callback Error: " . $e->getMessage());
    file_put_contents($logFile, "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n" . str_repeat('=', 50) . "\n", FILE_APPEND | LOCK_EX);
    echo "FAIL";
}
?>