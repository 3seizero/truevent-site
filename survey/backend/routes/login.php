<?php
function adminLogin(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['username']) || empty($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password required']);
        return;
    }

    $db = getDB();

    // Rate limiting: max 5 login attempts per IP per 15 minutes
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $stmt = $db->prepare("SELECT COUNT(*) FROM email_log WHERE recipient = 'login_attempt' AND error_message = ? AND sent_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
    $stmt->execute([$ip]);
    if ($stmt->fetchColumn() >= 5) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many login attempts. Try again in 15 minutes.']);
        return;
    }

    // Log attempt (reuse email_log table for simplicity)
    $db->prepare("INSERT INTO email_log (submission_id, recipient, email_type, status, error_message) VALUES (NULL, 'login_attempt', 'admin_notification', 'sent', ?)")->execute([$ip]);

    $stmt = $db->prepare('SELECT id, password_hash FROM admin_users WHERE username = ?');
    $stmt->execute([$input['username']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($input['password'], $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        return;
    }

    if (session_status() === PHP_SESSION_NONE) session_start();
    session_regenerate_id(true);
    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['last_activity'] = time();

    echo json_encode(['success' => true]);
}
