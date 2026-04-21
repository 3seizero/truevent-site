<?php
// Security headers
header('Content-Type: application/json; charset=utf-8');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Referrer-Policy: strict-origin-when-cross-origin');

// CORS — same origin, allow credentials for session cookies
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['https://survey.truevent.eu'];
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Secure session config
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);

// Hide PHP version
header_remove('X-Powered-By');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'];

require_once __DIR__ . '/db.php';

// Public routes
if ($method === 'GET' && preg_match('#^/forms/([a-zA-Z0-9_-]+)$#', $uri, $m)) {
    require __DIR__ . '/routes/forms.php';
    getForm($m[1]);
    exit;
}

if ($method === 'POST' && $uri === '/submit') {
    try {
        require __DIR__ . '/routes/submit.php';
        submitForm();
    } catch (\Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Server error', 'detail' => $e->getMessage(), 'line' => $e->getLine(), 'file' => basename($e->getFile())]);
    }
    exit;
}

// Admin routes
if ($method === 'POST' && $uri === '/login') {
    require __DIR__ . '/routes/login.php';
    adminLogin();
    exit;
}

require_once __DIR__ . '/middleware/auth.php';

if ($method === 'GET' && $uri === '/admin/forms') {
    requireAdmin();
    require __DIR__ . '/routes/forms.php';
    listForms();
    exit;
}

if ($method === 'GET' && preg_match('#^/admin/responses(?:/(\d+))?$#', $uri, $m)) {
    requireAdmin();
    require __DIR__ . '/routes/responses.php';
    if (isset($m[1])) {
        getResponse((int)$m[1]);
    } else {
        listResponses();
    }
    exit;
}

if ($method === 'GET' && $uri === '/admin/stats') {
    requireAdmin();
    require __DIR__ . '/routes/stats.php';
    getStats();
    exit;
}

if ($method === 'GET' && $uri === '/admin/ai-suggestions') {
    requireAdmin();
    require __DIR__ . '/routes/ai-suggestions.php';
    getAiSuggestions();
    exit;
}

if ($method === 'GET' && $uri === '/admin/export') {
    requireAdmin();
    require __DIR__ . '/routes/export.php';
    exportCSV();
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
