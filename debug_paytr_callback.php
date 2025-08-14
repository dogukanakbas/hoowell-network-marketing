<?php
/**
 * PayTR Callback Debug Sayfası
 * HOOWELL Payment System
 * Tarih: 08.01.2025
 */

// Error reporting açık
error_reporting(E_ALL);
ini_set('display_errors', 1);

?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayTR Callback Debug - HOOWELL</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
        .error { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .warning { background: #fff3cd; border-color: #ffeaa7; color: #856404; }
        .info { background: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .btn { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-warning { background: #ffc107; color: black; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 PayTR Callback Debug Sayfası</h1>
        <p><strong>HOOWELL Payment System</strong> - PayTR Callback Test ve Debug</p>
        
        <!-- POST Verileri -->
        <div class="section info">
            <h3>📨 Gelen POST Verileri</h3>
            <?php if (!empty($_POST)): ?>
                <pre><?php print_r($_POST); ?></pre>
            <?php else: ?>
                <p>Henüz POST verisi gelmedi.</p>
            <?php endif; ?>
        </div>

        <!-- Server Bilgileri -->
        <div class="section info">
            <h3>🖥️ Server Bilgileri</h3>
            <table>
                <tr><th>Özellik</th><th>Değer</th></tr>
                <tr><td>PHP Version</td><td><?php echo phpversion(); ?></td></tr>
                <tr><td>Server Software</td><td><?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Bilinmiyor'; ?></td></tr>
                <tr><td>Remote IP</td><td><?php echo $_SERVER['REMOTE_ADDR'] ?? 'Bilinmiyor'; ?></td></tr>
                <tr><td>User Agent</td><td><?php echo $_SERVER['HTTP_USER_AGENT'] ?? 'Bilinmiyor'; ?></td></tr>
                <tr><td>Request Method</td><td><?php echo $_SERVER['REQUEST_METHOD'] ?? 'Bilinmiyor'; ?></td></tr>
            </table>
        </div>

        <!-- Raw Input -->
        <div class="section info">
            <h3>📥 Raw Input</h3>
            <pre><?php echo file_get_contents('php://input') ?: 'Boş'; ?></pre>
        </div>

        <!-- Hash Test -->
        <div class="section info">
            <h3>🔐 Hash Hesaplama Testi</h3>
            <?php
            $merchant_key = 'tMCPPznCxw8sb8b8';
            $merchant_salt = 'bF1uwkXPAhDw5yok';
            
            if (!empty($_POST['merchant_oid']) && !empty($_POST['status']) && !empty($_POST['total_amount'])) {
                $hash_str = $_POST['merchant_oid'] . $merchant_salt . $_POST['status'] . $_POST['total_amount'];
                $calculated_hash = base64_encode(hash_hmac('sha256', $hash_str, $merchant_key, true));
                $received_hash = $_POST['hash'] ?? 'Yok';
                
                echo "<p><strong>Hash String:</strong> $hash_str</p>";
                echo "<p><strong>Hesaplanan Hash:</strong> $calculated_hash</p>";
                echo "<p><strong>Gelen Hash:</strong> $received_hash</p>";
                echo "<p><strong>Eşleşme:</strong> " . ($calculated_hash === $received_hash ? '✅ Başarılı' : '❌ Başarısız') . "</p>";
            } else {
                echo "<p>Hash hesaplama için gerekli veriler eksik.</p>";
            }
            ?>
        </div>

        <!-- Database Test -->
        <div class="section <?php 
            try {
                $pdo = new PDO("mysql:host=localhost;dbname=hoowell_network;charset=utf8mb4", 'root', 'HoowellDB_2025');
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                echo 'success';
            } catch (Exception $e) {
                echo 'error';
            }
        ?>">
            <h3>🗄️ Database Bağlantı Testi</h3>
            <?php
            try {
                $pdo = new PDO("mysql:host=localhost;dbname=hoowell_network;charset=utf8mb4", 'root', 'HoowellDB_2025');
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                echo "<p>✅ Database bağlantısı başarılı!</p>";
                
                // Son 5 ödeme kaydını göster
                $stmt = $pdo->query("SELECT merchant_oid, payment_type, amount, status, created_at FROM payments ORDER BY created_at DESC LIMIT 5");
                $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                if (!empty($payments)) {
                    echo "<h4>Son 5 Ödeme Kaydı:</h4>";
                    echo "<table>";
                    echo "<tr><th>Merchant OID</th><th>Tür</th><th>Tutar</th><th>Durum</th><th>Tarih</th></tr>";
                    foreach ($payments as $payment) {
                        echo "<tr>";
                        echo "<td>{$payment['merchant_oid']}</td>";
                        echo "<td>{$payment['payment_type']}</td>";
                        echo "<td>{$payment['amount']}</td>";
                        echo "<td>{$payment['status']}</td>";
                        echo "<td>{$payment['created_at']}</td>";
                        echo "</tr>";
                    }
                    echo "</table>";
                } else {
                    echo "<p>Henüz ödeme kaydı yok.</p>";
                }
                
            } catch (Exception $e) {
                echo "<p>❌ Database bağlantı hatası: " . $e->getMessage() . "</p>";
            }
            ?>
        </div>

        <!-- Log Test -->
        <div class="section <?php 
            $logDir = '/var/log/hoowell';
            $logFile = $logDir . '/paytr_callback.log';
            if (is_dir($logDir) && is_writable($logDir)) {
                echo 'success';
            } else {
                echo 'error';
            }
        ?>">
            <h3>📝 Log Dizini Testi</h3>
            <?php
            $logDir = '/var/log/hoowell';
            $logFile = $logDir . '/paytr_callback.log';
            
            if (is_dir($logDir)) {
                echo "<p>✅ Log dizini mevcut: $logDir</p>";
                
                if (is_writable($logDir)) {
                    echo "<p>✅ Log dizini yazılabilir</p>";
                    
                    // Test yazma
                    $testContent = "Debug test - " . date('Y-m-d H:i:s') . "\n";
                    if (file_put_contents($logFile, $testContent, FILE_APPEND | LOCK_EX)) {
                        echo "<p>✅ Log dosyasına yazma başarılı</p>";
                    } else {
                        echo "<p>❌ Log dosyasına yazma başarısız</p>";
                    }
                    
                    // Son 10 log satırını göster
                    if (file_exists($logFile)) {
                        $lines = file($logFile);
                        $lastLines = array_slice($lines, -10);
                        
                        echo "<h4>Son 10 Log Satırı:</h4>";
                        echo "<pre>";
                        foreach ($lastLines as $line) {
                            echo htmlspecialchars($line);
                        }
                        echo "</pre>";
                    }
                    
                } else {
                    echo "<p>❌ Log dizini yazılamıyor</p>";
                }
            } else {
                echo "<p>❌ Log dizini mevcut değil: $logDir</p>";
            }
            ?>
        </div>

        <!-- Test Butonları -->
        <div class="section info">
            <h3>🧪 Test İşlemleri</h3>
            <form method="post" style="display: inline;">
                <input type="hidden" name="test" value="1">
                <input type="hidden" name="merchant_oid" value="TEST_<?php echo time(); ?>">
                <input type="hidden" name="status" value="success">
                <input type="hidden" name="total_amount" value="10000">
                <input type="hidden" name="hash" value="test_hash">
                <button type="submit" class="btn btn-primary">🔄 Sayfayı Yenile</button>
            </form>
            
            <form method="post" style="display: inline;">
                <input type="hidden" name="test" value="1">
                <input type="hidden" name="merchant_oid" value="TEST_<?php echo time(); ?>">
                <input type="hidden" name="status" value="success">
                <input type="hidden" name="total_amount" value="10000">
                <input type="hidden" name="hash" value="<?php 
                    $hash_str = 'TEST_' . time() . $merchant_salt . 'success' . '10000';
                    echo base64_encode(hash_hmac('sha256', $hash_str, $merchant_key, true));
                ?>">
                <button type="submit" class="btn btn-success">✅ Gerçek Hash ile Test</button>
            </form>
            
            <a href="paytr_callback.php" class="btn btn-warning">📡 Callback URL Test</a>
        </div>

        <!-- Bilgi -->
        <div class="section warning">
            <h3>ℹ️ Bilgi</h3>
            <p><strong>Callback URL:</strong> <code>https://hoowell.net/paytr_callback.php</code></p>
            <p><strong>Debug URL:</strong> <code>https://hoowell.net/debug_paytr_callback.php</code></p>
            <p><strong>Log Dosyası:</strong> <code>/var/log/hoowell/paytr_callback.log</code></p>
            <p><strong>Database:</strong> <code>hoowell_network</code> (root kullanıcısı)</p>
        </div>
    </div>
</body>
</html>
