<?php
function getStats(): void {
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

    // Total submissions
    $countStmt = $db->prepare('SELECT COUNT(*) FROM submissions WHERE form_id = ?');
    $countStmt->execute([$form['id']]);
    $total = (int)$countStmt->fetchColumn();

    // Rating stats per question
    $ratingStmt = $db->prepare("
        SELECT a.question_key, a.question_text,
               AVG(a.answer_rating) as avg_rating,
               COUNT(*) as response_count,
               SUM(CASE WHEN a.answer_rating = 1 THEN 1 ELSE 0 END) as count_1,
               SUM(CASE WHEN a.answer_rating = 2 THEN 1 ELSE 0 END) as count_2,
               SUM(CASE WHEN a.answer_rating = 3 THEN 1 ELSE 0 END) as count_3,
               SUM(CASE WHEN a.answer_rating = 4 THEN 1 ELSE 0 END) as count_4
        FROM answers a
        JOIN submissions s ON s.id = a.submission_id
        WHERE s.form_id = ? AND a.answer_type = 'rating'
        GROUP BY a.question_key, a.question_text
        ORDER BY a.question_key
    ");
    $ratingStmt->execute([$form['id']]);
    $ratings = $ratingStmt->fetchAll();

    // Role distribution
    $roleStmt = $db->prepare("
        SELECT respondent_role, COUNT(*) as count
        FROM submissions WHERE form_id = ?
        GROUP BY respondent_role
    ");
    $roleStmt->execute([$form['id']]);
    $roles = $roleStmt->fetchAll();

    // Submissions per day (last 30 days)
    $timeStmt = $db->prepare("
        SELECT DATE(submitted_at) as date, COUNT(*) as count
        FROM submissions WHERE form_id = ?
        GROUP BY DATE(submitted_at)
        ORDER BY date DESC LIMIT 30
    ");
    $timeStmt->execute([$form['id']]);
    $timeline = $timeStmt->fetchAll();

    // Text answers grouped by question
    $textStmt = $db->prepare("
        SELECT a.question_key, a.question_text, a.answer_text
        FROM answers a
        JOIN submissions s ON s.id = a.submission_id
        WHERE s.form_id = ? AND a.answer_type = 'text' AND a.answer_text IS NOT NULL AND a.answer_text != ''
        ORDER BY a.question_key
    ");
    $textStmt->execute([$form['id']]);
    $textRows = $textStmt->fetchAll();

    $textByQuestion = [];
    foreach ($textRows as $row) {
        $key = $row['question_key'];
        if (!isset($textByQuestion[$key])) {
            $textByQuestion[$key] = [
                'question_key' => $key,
                'question_text' => $row['question_text'],
                'answers' => [],
            ];
        }
        $textByQuestion[$key]['answers'][] = $row['answer_text'];
    }

    // Extract keywords from text answers
    $stopWords = ['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','it','was','are','be','has','have','had','do','does','did','will','would','could','should','can','may','this','that','these','those','i','we','you','they','he','she','my','our','your','their','me','us','very','really','also','just','more','most','much','many','some','all','not','no','so','than','too','what','which','who','how','when','where','about','into','through','during','before','after','above','below','between','up','down','out','off','over','under','again','further','then','once','here','there','each','every','both','few','other','been','being','having','doing','would','could','should','might','must','shall','if','while','because','as','until','although','since','unless','were','am','its','own','such'];

    foreach ($textByQuestion as &$group) {
        $wordFreq = [];
        foreach ($group['answers'] as $text) {
            $words = preg_split('/[\s,.\-;:!?()\/\[\]"\']+/', mb_strtolower($text));
            $seen = [];
            foreach ($words as $w) {
                $w = trim($w);
                if (mb_strlen($w) < 3 || in_array($w, $stopWords) || is_numeric($w)) continue;
                if (isset($seen[$w])) continue;
                $seen[$w] = true;
                $wordFreq[$w] = ($wordFreq[$w] ?? 0) + 1;
            }
        }
        arsort($wordFreq);
        $group['keywords'] = array_slice($wordFreq, 0, 15, true);
    }
    unset($group);

    echo json_encode([
        'total_submissions' => $total,
        'ratings' => $ratings,
        'roles' => $roles,
        'timeline' => $timeline,
        'text_answers' => array_values($textByQuestion),
    ]);
}
