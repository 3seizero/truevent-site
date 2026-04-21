<?php
require_once __DIR__ . '/../vendor/phpmailer/Exception.php';
require_once __DIR__ . '/../vendor/phpmailer/PHPMailer.php';
require_once __DIR__ . '/../vendor/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function getMailAccount(string $formSlug): array {
    $cfg = require __DIR__ . '/../config.php';
    $accounts = $cfg['mail_accounts'];
    return $accounts[$formSlug] ?? $accounts['default'];
}

function sendMail(string $to, string $subject, string $htmlBody, int $submissionId, string $type, string $formSlug = 'default'): void {
    $cfg = require __DIR__ . '/../config.php';
    $db = getDB();
    $account = getMailAccount($formSlug);

    $errorMsg = null;
    $sent = false;

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = $cfg['smtp']['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $account['username'];
        $mail->Password   = $account['password'];
        $mail->SMTPSecure = $cfg['smtp']['encryption'];
        $mail->Port       = $cfg['smtp']['port'];
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($account['username'], $account['from_name']);
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;

        $mail->send();
        $sent = true;
    } catch (Exception $e) {
        $errorMsg = $mail->ErrorInfo ?? $e->getMessage();
    }

    // Log email
    $stmt = $db->prepare('
        INSERT INTO email_log (submission_id, recipient, email_type, status, error_message)
        VALUES (?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $submissionId,
        $to,
        $type,
        $sent ? 'sent' : 'failed',
        $errorMsg,
    ]);
}
