<?php
function exportCSV(): void {
    $db = getDB();
    $formSlug = $_GET['form'] ?? '';

    $stmt = $db->prepare('SELECT id FROM forms WHERE slug = ?');
    $stmt->execute([$formSlug]);
    $form = $stmt->fetch();
    if (!$form) {
        http_response_code(404);
        echo json_encode(['error' => 'Form not found']);
        return;
    }

    $stmt = $db->prepare('
        SELECT s.id, s.respondent_name, s.respondent_email, s.respondent_company, s.respondent_role, s.submitted_at,
               a.question_key, a.question_text, a.answer_type, a.answer_rating, a.answer_text
        FROM submissions s
        JOIN answers a ON a.submission_id = s.id
        WHERE s.form_id = ?
        ORDER BY s.submitted_at DESC, a.question_key
    ');
    $stmt->execute([$form['id']]);
    $rows = $stmt->fetchAll();

    // Group by submission
    $subs = [];
    $questionKeys = [];
    foreach ($rows as $row) {
        $sid = $row['id'];
        if (!isset($subs[$sid])) {
            $subs[$sid] = [
                'Name' => $row['respondent_name'],
                'Email' => $row['respondent_email'],
                'Company' => $row['respondent_company'],
                'Role' => $row['respondent_role'],
                'Date' => $row['submitted_at'],
            ];
        }
        $qk = $row['question_key'];
        if (!in_array($qk, $questionKeys)) $questionKeys[] = $qk;
        $subs[$sid][$qk] = $row['answer_type'] === 'rating'
            ? ['BAD','AVERAGE','GOOD','OUTSTANDING'][$row['answer_rating'] - 1] ?? ''
            : $row['answer_text'];
    }

    $filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $formSlug) . '-export.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $out = fopen('php://output', 'w');
    $headers = ['Name', 'Email', 'Company', 'Role', 'Date', ...$questionKeys];
    fputcsv($out, $headers);

    foreach ($subs as $s) {
        $line = [];
        foreach ($headers as $h) $line[] = $s[$h] ?? '';
        fputcsv($out, $line);
    }
    fclose($out);
    exit;
}
