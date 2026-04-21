<?php
function getForm(string $slug): void {
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM forms WHERE slug = ? AND is_active = 1');
    $stmt->execute([$slug]);
    $form = $stmt->fetch();

    if (!$form) {
        http_response_code(404);
        echo json_encode(['error' => 'Form not found']);
        return;
    }

    echo json_encode($form);
}

function listForms(): void {
    $db = getDB();
    $rows = $db->query('
        SELECT f.*, COUNT(s.id) as submission_count
        FROM forms f
        LEFT JOIN submissions s ON s.form_id = f.id
        GROUP BY f.id
        ORDER BY f.event, f.edition DESC
    ')->fetchAll();

    echo json_encode($rows);
}
