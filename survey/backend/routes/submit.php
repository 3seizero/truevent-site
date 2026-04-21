<?php
require_once __DIR__ . '/../services/mailer.php';

function submitForm(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || empty($input['form_slug']) || empty($input['respondent']) || empty($input['answers'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }

    // Sanitize form slug
    $formSlug = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['form_slug']);

    $db = getDB();

    // Verify form exists
    $stmt = $db->prepare('SELECT id, title, event, edition FROM forms WHERE slug = ? AND is_active = 1');
    $stmt->execute([$formSlug]);
    $form = $stmt->fetch();

    if (!$form) {
        http_response_code(404);
        echo json_encode(['error' => 'Form not found']);
        return;
    }

    // Rate limiting: max 3 submissions per IP per hour
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    if (!filter_var($ip, FILTER_VALIDATE_IP)) $ip = '0.0.0.0';

    $stmt = $db->prepare('SELECT COUNT(*) FROM submissions WHERE ip_address = ? AND submitted_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)');
    $stmt->execute([$ip]);
    if ($stmt->fetchColumn() >= 3) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many submissions. Please try again later.']);
        return;
    }

    $r = $input['respondent'];

    // Validate required fields
    $name = trim($r['name'] ?? '');
    $email = trim($r['email'] ?? '');
    if ($name === '' || $email === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Name and email are required']);
        return;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        return;
    }

    // Sanitize name (remove newlines to prevent email header injection)
    $name = preg_replace('/[\r\n]/', '', $name);
    $company = preg_replace('/[\r\n]/', '', trim($r['company'] ?? ''));

    // Validate role
    $validRoles = ['buyer', 'exhibitor', 'partner', 'other'];
    $role = in_array($r['role'] ?? '', $validRoles) ? $r['role'] : 'other';

    // Limit user agent length
    $ua = mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500);

    // Insert submission
    $stmt = $db->prepare('
        INSERT INTO submissions (form_id, respondent_name, respondent_email, respondent_company, respondent_role, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([$form['id'], $name, $email, $company, $role, $ip, $ua]);
    $submissionId = $db->lastInsertId();

    // Insert answers with validation
    $stmtA = $db->prepare('
        INSERT INTO answers (submission_id, question_key, question_text, answer_type, answer_rating, answer_text)
        VALUES (?, ?, ?, ?, ?, ?)
    ');
    foreach ($input['answers'] as $a) {
        $type = ($a['type'] ?? '') === 'rating' ? 'rating' : 'text';
        $qKey = preg_replace('/[^a-zA-Z0-9_]/', '', $a['key'] ?? '');
        $qText = mb_substr($a['question_text'] ?? '', 0, 1000);

        if ($type === 'rating') {
            $rating = (int)($a['value'] ?? 0);
            if ($rating < 1 || $rating > 4) $rating = null;
            $stmtA->execute([$submissionId, $qKey, $qText, 'rating', $rating, null]);
        } else {
            $text = mb_substr($a['value'] ?? '', 0, 5000);
            $stmtA->execute([$submissionId, $qKey, $qText, 'text', null, $text]);
        }
    }

    // Send emails
    $cfg = require __DIR__ . '/../config.php';
    $respondent = ['name' => $name, 'email' => $email, 'company' => $company, 'role' => $role];

    // Admin notification
    $adminHtml = buildAdminEmail($form, $respondent, $input['answers']);
    foreach ($cfg['admin_recipients'] as $to) {
        sendMail($to, "[TRUE Survey] New feedback: {$form['title']} — {$name}", $adminHtml, $submissionId, 'admin_notification', $formSlug);
    }

    // Autoresponder
    $autoHtml = buildAutoresponderEmail($form, $respondent, $input['answers']);
    sendMail($email, "Thank you for your feedback — {$form['title']}", $autoHtml, $submissionId, 'autoresponder', $formSlug);

    echo json_encode(['success' => true, 'submission_id' => $submissionId]);
}

function buildAdminEmail(array $form, array $r, array $answers): string {
    $rows = '';
    foreach ($answers as $a) {
        $val = $a['type'] === 'rating' ? ratingLabel((int)$a['value']) : htmlspecialchars($a['value'] ?? '');
        $rows .= "<tr><td style='padding:10px 12px;border-bottom:1px solid #1a1920;color:#78706A;font-size:11px;vertical-align:top;width:40%;'>"
            . htmlspecialchars($a['question_text'] ?? $a['key'])
            . "</td><td style='padding:10px 12px;border-bottom:1px solid #1a1920;color:#F5F0E8;font-size:13px;'>{$val}</td></tr>";
    }

    return "
    <div style='background:#09080C;padding:40px 20px;font-family:Roboto,Arial,sans-serif;'>
        <div style='max-width:600px;margin:0 auto;'>
            <div style='color:#C8A96E;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;'>New Survey Response</div>
            <div style='color:#F5F0E8;font-size:24px;font-weight:900;text-transform:uppercase;margin-bottom:24px;'>{$form['title']}</div>
            <div style='background:#101018;border:1px solid rgba(200,169,110,.15);padding:20px;margin-bottom:20px;'>
                <div style='color:#C8A96E;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;'>Respondent</div>
                <div style='color:#F5F0E8;font-size:14px;font-weight:700;'>" . htmlspecialchars($r['name']) . "</div>
                <div style='color:#78706A;font-size:12px;'>" . htmlspecialchars($r['email']) . "</div>
                <div style='color:#78706A;font-size:12px;'>" . htmlspecialchars($r['company'] ?? '') . " — " . htmlspecialchars($r['role'] ?? '') . "</div>
            </div>
            <table style='width:100%;border-collapse:collapse;background:#101018;border:1px solid rgba(200,169,110,.15);'>{$rows}</table>
        </div>
    </div>";
}

function buildAutoresponderEmail(array $form, array $r, array $answers): string {
    $rows = '';
    foreach ($answers as $a) {
        $val = $a['type'] === 'rating' ? ratingLabel((int)$a['value']) : htmlspecialchars($a['value'] ?? '');
        $rows .= "<tr><td style='padding:10px 12px;border-bottom:1px solid #1a1920;color:#78706A;font-size:11px;vertical-align:top;width:40%;'>"
            . htmlspecialchars($a['question_text'] ?? $a['key'])
            . "</td><td style='padding:10px 12px;border-bottom:1px solid #1a1920;color:#F5F0E8;font-size:13px;'>{$val}</td></tr>";
    }

    return "
    <div style='background:#09080C;padding:40px 20px;font-family:Roboto,Arial,sans-serif;'>
        <div style='max-width:600px;margin:0 auto;'>
            <div style='text-align:center;margin-bottom:32px;'>
                <div style='color:#F5F0E8;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;'>TRUE</div>
                <div style='width:40px;height:2px;background:#C8A96E;margin:12px auto;'></div>
                <div style='color:#F5F0E8;font-size:16px;font-weight:700;margin-bottom:12px;'>Thank you, " . htmlspecialchars($r['name']) . "</div>
                <div style='color:#78706A;font-size:11px;line-height:1.8;text-transform:uppercase;letter-spacing:.05em;'>
                    Your feedback for {$form['title']} has been received.<br>
                    Below is a summary of your responses.
                </div>
            </div>
            <div style='background:#101018;border:1px solid rgba(200,169,110,.15);padding:20px;margin-bottom:20px;'>
                <div style='color:#C8A96E;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;'>Your Details</div>
                <div style='color:#F5F0E8;font-size:14px;font-weight:700;'>" . htmlspecialchars($r['name']) . "</div>
                <div style='color:#78706A;font-size:12px;'>" . htmlspecialchars($r['email']) . "</div>
                <div style='color:#78706A;font-size:12px;'>" . htmlspecialchars($r['company'] ?? '') . (!empty($r['role']) ? " — " . htmlspecialchars($r['role']) : '') . "</div>
            </div>
            <div style='color:#C8A96E;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;'>Your Responses</div>
            <table style='width:100%;border-collapse:collapse;background:#101018;border:1px solid rgba(200,169,110,.15);'>{$rows}</table>
            <div style='text-align:center;margin-top:32px;'>
                <div style='color:#78706A;font-size:11px;line-height:1.8;text-transform:uppercase;letter-spacing:.05em;'>
                    Your insights are invaluable in helping us shape future editions of TRUE.<br>
                    We look forward to welcoming you again.
                </div>
                <div style='margin-top:24px;color:rgba(200,169,110,.4);font-size:9px;letter-spacing:2px;text-transform:uppercase;'>truevent.eu</div>
            </div>
        </div>
    </div>";
}

function ratingLabel(int $val): string {
    $colors = [1 => '#e74c3c', 2 => '#f39c12', 3 => '#27ae60', 4 => '#C8A96E'];
    $labels = [1 => 'BAD', 2 => 'AVERAGE', 3 => 'GOOD', 4 => 'OUTSTANDING'];
    $c = $colors[$val] ?? '#78706A';
    $l = $labels[$val] ?? '—';
    return "<span style='color:{$c};font-weight:700;'>{$l}</span>";
}
