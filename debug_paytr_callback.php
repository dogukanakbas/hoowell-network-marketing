<?php
/**
 * PayTR Callback Debug Script
 * Bu script PayTR callback'ini test etmek için kullanılır
 */

// Debug modu açık
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>PayTR Callback Debug</h2>";

// Gelen veriyi göster
echo "<h3>Gelen POST Verisi:</h3>";
echo "<pre>";
print_r($_POST);
echo "</pre>";

// Server bilgilerini göster
echo "<h3>Server Bilgileri:</h3>";
echo "<pre>";
echo "REMOTE_ADDR: " . ($_SERVER['REMOTE_ADDR'] ?? 'Yok') . "\n";
echo "HTTP_USER_AGENT: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Yok') . "\n";
echo "REQUEST_METHOD: " . ($_SERVER['REQUEST_METHOD'] ?? 'Yok') . "\n";
echo "CONTENT_TYPE: " . ($_SERVER['CONTENT_TYPE'] ?? 'Yok') . "\n";
echo "</pre>";

// Raw input'u göster
echo "<h3>Raw Input:</h3>";
echo "<pre>";
echo file_get_contents('php://input');
echo "</pre>";

// PayTR merchant bilgileri
$merchant_key = 'tMCPPznCxw8sb8b8';
$merchant_salt = 'bF1uwkXPAhDw5yok';

// Hash hesaplama testi
if (isset($_POST['merchant_oid']) && isset($_POST['status']) && isset($_POST['total_amount'])) {
    echo "<h3>Hash Hesaplama Testi:</h3>";
    
    $hash_str = $_POST['merchant_oid'] . $merchant_salt . $_POST['status'] . $_POST['total_amount'];
    $calculated_hash = base64_encode(hash_hmac('sha256', $hash_str, $merchant_key, true));
    
    echo "<pre>";
    echo "Hash String: " . $hash_str . "\n";
    echo "Hesaplanan Hash: " . $calculated_hash . "\n";
    echo "Gelen Hash: " . ($_POST['hash'] ?? 'Yok') . "\n";
    echo "Hash Doğru mu: " . (($calculated_hash === ($_POST['hash'] ?? '')) ? 'EVET' : 'HAYIR') . "\n";
    echo "</pre>";
}

// Database bağlantı testi
echo "<h3>Database Bağlantı Testi:</h3>";
try {
    $host = 'localhost';
    $dbname = 'hoowell_network';
    $username = 'hoowell_user';
    $password = 'HoowellDB_2025'; // Güncellenmiş şifre

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color: green;'>✅ Database bağlantısı başarılı</p>";
    
    // Ödeme kaydı testi
    if (isset($_POST['merchant_oid'])) {
        $stmt = $pdo->prepare("SELECT * FROM payments WHERE merchant_oid = ?");
        $stmt->execute([$_POST['merchant_oid']]);
        $payment = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($payment) {
            echo "<p style='color: green;'>✅ Ödeme kaydı bulundu</p>";
            echo "<pre>";
            print_r($payment);
            echo "</pre>";
        } else {
            echo "<p style='color: red;'>❌ Ödeme kaydı bulunamadı</p>";
        }
    }
    
    // Son ödemeleri listele
    echo "<h3>Son 5 Ödeme Kaydı:</h3>";
    $stmt = $pdo->query("SELECT merchant_oid, payment_type, status, total_amount, created_at FROM payments ORDER BY created_at DESC LIMIT 5");
    $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($payments) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>Merchant OID</th><th>Tip</th><th>Durum</th><th>Tutar</th><th>Tarih</th></tr>";
        foreach ($payments as $payment) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($payment['merchant_oid']) . "</td>";
            echo "<td>" . htmlspecialchars($payment['payment_type']) . "</td>";
            echo "<td>" . htmlspecialchars($payment['status']) . "</td>";
            echo "<td>" . htmlspecialchars($payment['total_amount']) . "</td>";
            echo "<td>" . htmlspecialchars($payment['created_at']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p style='color: orange;'>⚠️ Henüz ödeme kaydı yok</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database hatası: " . $e->getMessage() . "</p>";
}

// Log dosyası testi
echo "<h3>Log Dosyası Testi:</h3>";
$logFile = '/var/log/hoowell/paytr_callback.log';
$logDir = '/var/log/hoowell';

if (!is_dir($logDir)) {
    echo "<p style='color: orange;'>⚠️ Log dizini yok: $logDir</p>";
} else {
    echo "<p style='color: green;'>✅ Log dizini mevcut</p>";
}

if (is_writable($logDir)) {
    echo "<p style='color: green;'>✅ Log dizini yazılabilir</p>";
} else {
    echo "<p style='color: red;'>❌ Log dizini yazılamıyor</p>";
}

if (file_exists($logFile)) {
    echo "<p style='color: green;'>✅ Log dosyası mevcut</p>";
    echo "<p>Log dosyası boyutu: " . filesize($logFile) . " bytes</p>";
    
    // Son 10 log satırını göster
    echo "<h4>Son 10 Log Satırı:</h4>";
    $lines = file($logFile);
    $lastLines = array_slice($lines, -10);
    echo "<pre style='background: #f5f5f5; padding: 10px; max-height: 200px; overflow-y: auto;'>";
    foreach ($lastLines as $line) {
        echo htmlspecialchars($line);
    }
    echo "</pre>";
} else {
    echo "<p style='color: orange;'>⚠️ Log dosyası yok: $logFile</p>";
}

// Test callback simülasyonu
echo "<h3>Test Callback Simülasyonu:</h3>";
echo "<form method='post' action='paytr_callback.php'>";
echo "<input type='hidden' name='merchant_oid' value='TEST" . time() . "'>";
echo "<input type='hidden' name='status' value='success'>";
echo "<input type='hidden' name='total_amount' value='100'>";
echo "<input type='hidden' name='hash' value='test_hash'>";
echo "<button type='submit'>Test Callback Gönder</button>";
echo "</form>";

// Gerçek hash ile test
echo "<h3>Gerçek Hash ile Test:</h3>";
$test_merchant_oid = 'TEST' . time();
$test_status = 'success';
$test_total_amount = '100';
$test_hash_str = $test_merchant_oid . $merchant_salt . $test_status . $test_total_amount;
$test_hash = base64_encode(hash_hmac('sha256', $test_hash_str, $merchant_key, true));

echo "<form method='post' action='paytr_callback.php'>";
echo "<input type='hidden' name='merchant_oid' value='$test_merchant_oid'>";
echo "<input type='hidden' name='status' value='$test_status'>";
echo "<input type='hidden' name='total_amount' value='$test_total_amount'>";
echo "<input type='hidden' name='hash' value='$test_hash'>";
echo "<button type='submit'>Gerçek Hash ile Test Gönder</button>";
echo "</form>";

echo "<hr>";
echo "<p><small>Debug script'i - " . date('Y-m-d H:i:s') . "</small></p>";
?>
