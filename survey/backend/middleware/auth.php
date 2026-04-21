<?php
function requireAdmin(): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    // Session timeout: 2 hours
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > 7200) {
        session_unset();
        session_destroy();
        http_response_code(401);
        echo json_encode(['error' => 'Session expired']);
        exit;
    }
    $_SESSION['last_activity'] = time();
}
