<?php
function getDB(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;

    $cfg = require __DIR__ . '/config.php';
    $dsn = "mysql:host={$cfg['db']['host']};dbname={$cfg['db']['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $cfg['db']['user'], $cfg['db']['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
