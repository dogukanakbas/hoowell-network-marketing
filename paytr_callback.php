<?php
/**
 * PayTR Callback Handler
 * HOOWELL Payment System
 * PayTR Resmi Örneğe Göre Düzenlenmiş
 * Tarih: 08.01.2025
 */

// Error reporting (production'da kapatılabilir)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Content type
header('Content-Type: text/plain');

// Log dosyası
$logFile = '/var/log/hoowell/paytr_callback.log';

// Log dizini oluştur
$logDir = '/var/log/hoowell';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

// Gelen veriyi logla
$logData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'post_data' => $_POST
];

file_put_contents($logFile, json_encode($logData, JSON_PRETTY_PRINT) . "\n" . str_repeat('-', 50) . "\n", FILE_APPEND | LOCK_EX);

// PayTR Merchant bilgileri
$merchant_key = 'tMCPPznCxw8sb8b8';
$merchant_salt = 'bF1uwkXPAhDw5yok';

$post = $_POST;

// POST değerleri ile hash oluştur (PayTR resmi örneğe göre)
// Hash string: merchant_oid + merchant_salt + status + total_amount
$hash_str = $post['merchant_oid'] . $merchant_salt . $post['status'] . $post['total_amount'];
$hash = base64_encode(hash_hmac('sha256', $hash_str, $merchant_key, true));

// Hash hesaplama detaylarını logla
$hashLog = [
    'hash_string' => $hash_str,
    'calculated_hash' => $hash,
    'received_hash' => $post['hash'] ?? 'missing',
    'match' => ($hash === ($post['hash'] ?? ''))
];
file_put_contents($logFile, "HASH DEBUG: " . json_encode($hashLog, JSON_PRETTY_PRINT) . "\n", FILE_APPEND | LOCK_EX);

// Oluşturulan hash'i, paytr'dan gelen post içindeki hash ile karşılaştır
if ($hash != $post['hash']) {
    error_log("PayTR notification failed: bad hash - Gelen: " . $post['hash'] . " Hesaplanan: " . $hash);
    file_put_contents($logFile, "ERROR: Hash doğrulama hatası - Gelen: " . $post['hash'] . " Hesaplanan: " . $hash . "\n", FILE_APPEND | LOCK_EX);
    die('PAYTR notification failed: bad hash');
}

// Database bağlantısı - ROOT kullanıcısı
$host = 'localhost';
$dbname = 'hoowell_network';
$username = 'root';
$password = 'HoowellDB_2025'; // Root şifresi

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Siparişin durumunu merchant_oid değerini kullanarak veri tabanından sorgula
    $stmt = $pdo->prepare("SELECT * FROM payments WHERE merchant_oid = ?");
    $stmt->execute([$post['merchant_oid']]);
    $payment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$payment) {
        error_log("PayTR Callback: Ödeme kaydı bulunamadı - " . $post['merchant_oid']);
        file_put_contents($logFile, "ERROR: Ödeme kaydı bulunamadı - " . $post['merchant_oid'] . "\n", FILE_APPEND | LOCK_EX);
        echo "FAIL";
        exit;
    }

    // Eğer sipariş zaten daha önceden onaylandıysa veya iptal edildiyse
    if ($payment['status'] === 'approved' && $post['status'] === 'success') {
        error_log("PayTR Callback: Ödeme zaten onaylanmış - " . $post['merchant_oid']);
        file_put_contents($logFile, "INFO: Ödeme zaten onaylanmış - " . $post['merchant_oid'] . "\n", FILE_APPEND | LOCK_EX);
        echo "OK";
        exit;
    }

    if ($post['status'] == 'success') {
        // Ödeme Onaylandı
        
        // Ödeme durumunu güncelle (paytr_status kolonu varsa)
        try {
            $stmt = $pdo->prepare("UPDATE payments SET status = 'approved', paytr_status = ?, updated_at = NOW() WHERE merchant_oid = ?");
            $stmt->execute([$post['status'], $post['merchant_oid']]);
        } catch (Exception $e) {
            // paytr_status kolonu yoksa sadece status güncelle
            $stmt = $pdo->prepare("UPDATE payments SET status = 'approved', updated_at = NOW() WHERE merchant_oid = ?");
            $stmt->execute([$post['merchant_oid']]);
        }

        // Kullanıcı durumunu güncelle
        if ($payment['payment_type'] === 'education') {
            $stmt = $pdo->prepare("UPDATE users SET education_access = 1, payment_confirmed = 1 WHERE id = ?");
            $stmt->execute([$payment['user_id']]);
            error_log("PayTR Callback: Eğitim erişimi açıldı - User ID: " . $payment['user_id']);
            
        } elseif ($payment['payment_type'] === 'device') {
            $stmt = $pdo->prepare("UPDATE users SET payment_confirmed = 1 WHERE id = ?");
            $stmt->execute([$payment['user_id']]);
            error_log("PayTR Callback: Cihaz ödemesi tamamlandı - User ID: " . $payment['user_id']);
            
        } elseif ($payment['payment_type'] === 'franchise' && !empty($payment['partner_id'])) {
            $stmt = $pdo->prepare("UPDATE business_partners SET payment_status = 'completed', status = 'active' WHERE id = ?");
            $stmt->execute([$payment['partner_id']]);
            error_log("PayTR Callback: İş ortağı aktif edildi - Partner ID: " . $payment['partner_id']);
        }

        file_put_contents($logFile, "SUCCESS: " . $post['merchant_oid'] . " - " . $post['status'] . " - " . $post['total_amount'] . "\n", FILE_APPEND | LOCK_EX);

    } else {
        // Ödemeye Onay Verilmedi
        
        // Ödeme durumunu güncelle (paytr_status kolonu varsa)
        try {
            $stmt = $pdo->prepare("UPDATE payments SET status = 'failed', paytr_status = ?, updated_at = NOW() WHERE merchant_oid = ?");
            $stmt->execute([$post['status'], $post['merchant_oid']]);
        } catch (Exception $e) {
            // paytr_status kolonu yoksa sadece status güncelle
            $stmt = $pdo->prepare("UPDATE payments SET status = 'failed', updated_at = NOW() WHERE merchant_oid = ?");
            $stmt->execute([$post['merchant_oid']]);
        }

        // Hata bilgilerini logla
        $failed_reason = isset($post['failed_reason_msg']) ? $post['failed_reason_msg'] : 'Bilinmeyen hata';
        error_log("PayTR Callback: Ödeme başarısız - " . $post['merchant_oid'] . " - Sebep: " . $failed_reason);
        file_put_contents($logFile, "FAILED: " . $post['merchant_oid'] . " - " . $post['status'] . " - Sebep: " . $failed_reason . "\n", FILE_APPEND | LOCK_EX);
    }

    // Bildirimin alındığını PayTR sistemine bildir
    echo "OK";
    exit;

} catch (Exception $e) {
    error_log("PayTR Callback Error: " . $e->getMessage());
    file_put_contents($logFile, "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n" . str_repeat('=', 50) . "\n", FILE_APPEND | LOCK_EX);
    echo "FAIL";
    exit;
}
?>