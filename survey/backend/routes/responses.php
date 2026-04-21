<?php
function listResponses(): void {
    $db = getDB();
    $formSlug = $_GET['form'] ?? '';
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = 20;
    $offset = ($page - 1) * $limit;

    if (!$formSlug) {
        http_response_code(400);
        echo json_encode(['error' => 'form parameter required']);
        return;
    }

    $stmt = $db->prepare('SELECT id FROM forms WHERE slug = ?');
    $stmt->execute([$formSlug]);
    $form = $stmt->fetch();
    if (!$form) {
        http_response_code(404);
        echo json_encode(['error' => 'Form not found']);
        return;
    }

    $countStmt = $db->prepare('SELECT COUNT(*) FROM submissions WHERE form_id = ?');
    $countStmt->execute([$form['id']]);
    $total = (int)$countStmt->fetchColumn();

    $stmt = $db->prepare('
        SELECT id, respondent_name, respondent_email, respondent_company, respondent_role, submitted_at
        FROM submissions WHERE form_id = ?
        ORDER BY submitted_at DESC
        LIMIT ? OFFSET ?
    ');
    $stmt->execute([$form['id'], $limit, $offset]);
    $rows = $stmt->fetchAll();

    echo json_encode([
        'submissions' => $rows,
        'total' => $total,
        'page' => $page,
        'pages' => ceil($total / $limit),
    ]);
}

function getResponse(int $id): void {
    $db = getDB();

    $stmt = $db->prepare('
        SELECT s.*, f.title as form_title, f.slug as form_slug
        FROM submissions s JOIN forms f ON f.id = s.form_id
        WHERE s.id = ?
    ');
    $stmt->execute([$id]);
    $sub = $stmt->fetch();

    if (!$sub) {
        http_response_code(404);
        echo json_encode(['error' => 'Submission not found']);
        return;
    }

    $stmt = $db->prepare('SELECT question_key, question_text, answer_type, answer_rating, answer_text FROM answers WHERE submission_id = ?');
    $stmt->execute([$id]);
    $sub['answers'] = $stmt->fetchAll();

    echo json_encode($sub);
}
