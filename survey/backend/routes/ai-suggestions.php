<?php
function getAiSuggestions(): void {
    $db = getDB();
    $cfg = require __DIR__ . '/../config.php';
    $formSlug = preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['form'] ?? '');

    if (empty($cfg['ai']['anthropic_api_key'])) {
        http_response_code(500);
        echo json_encode(['error' => 'AI not configured']);
        return;
    }

    $stmt = $db->prepare('SELECT id, title, event, edition FROM forms WHERE slug = ?');
    $stmt->execute([$formSlug]);
    $form = $stmt->fetch();
    if (!$form) {
        http_response_code(404);
        echo json_encode(['error' => 'Form not found']);
        return;
    }

    // Get rating stats
    $rStmt = $db->prepare("
        SELECT a.question_key, a.question_text,
               AVG(a.answer_rating) as avg_rating, COUNT(*) as count,
               SUM(CASE WHEN a.answer_rating = 1 THEN 1 ELSE 0 END) as bad,
               SUM(CASE WHEN a.answer_rating = 2 THEN 1 ELSE 0 END) as average,
               SUM(CASE WHEN a.answer_rating = 3 THEN 1 ELSE 0 END) as good,
               SUM(CASE WHEN a.answer_rating = 4 THEN 1 ELSE 0 END) as outstanding
        FROM answers a JOIN submissions s ON s.id = a.submission_id
        WHERE s.form_id = ? AND a.answer_type = 'rating'
        GROUP BY a.question_key, a.question_text ORDER BY a.question_key
    ");
    $rStmt->execute([$form['id']]);
    $ratings = $rStmt->fetchAll();

    // Get text answers
    $tStmt = $db->prepare("
        SELECT a.question_key, a.question_text, a.answer_text
        FROM answers a JOIN submissions s ON s.id = a.submission_id
        WHERE s.form_id = ? AND a.answer_type = 'text' AND a.answer_text != ''
        ORDER BY a.question_key
    ");
    $tStmt->execute([$form['id']]);
    $texts = $tStmt->fetchAll();

    // Total submissions
    $cStmt = $db->prepare('SELECT COUNT(*) FROM submissions WHERE form_id = ?');
    $cStmt->execute([$form['id']]);
    $total = $cStmt->fetchColumn();

    // Build prompt
    $ratingBlock = "";
    foreach ($ratings as $r) {
        $ratingBlock .= "- {$r['question_text']}: avg {$r['avg_rating']}/4 (Bad: {$r['bad']}, Average: {$r['average']}, Good: {$r['good']}, Outstanding: {$r['outstanding']})\n";
    }

    $textBlock = "";
    $currentQ = "";
    foreach ($texts as $t) {
        if ($t['question_key'] !== $currentQ) {
            $currentQ = $t['question_key'];
            $textBlock .= "\n### {$t['question_text']}\n";
        }
        $textBlock .= "- " . mb_substr($t['answer_text'], 0, 500) . "\n";
    }

    $prompt = "You are an expert event consultant analyzing post-event feedback for TRUE {$form['event']} {$form['edition']}, a luxury B2B travel event held in Italy. TRUE connects Italy's finest hospitality brands with the world's most influential travel advisors through curated, immersive experiences.

Total responses: {$total}

## Rating Questions (scale 1-4)
{$ratingBlock}

## Open Text Responses
{$textBlock}

Based on this feedback data, provide a structured analysis in the following format:

## 🏆 TOP STRENGTHS
Identify the 3-5 strongest aspects of the event based on both ratings and text feedback. Be specific.

## ⚠️ AREAS FOR IMPROVEMENT
Identify the 3-5 areas where the event fell short or could be enhanced. Reference specific feedback.

## 💡 ACTIONABLE RECOMMENDATIONS
Provide 5-7 specific, practical recommendations for the next edition. Each should be concrete and implementable.

## 📊 SENTIMENT OVERVIEW
A brief 2-3 sentence overall sentiment summary.

## 🎯 PRIORITY ACTIONS
List the top 3 things the team should address FIRST, ranked by impact and urgency.

Write in a professional but direct tone. Be honest about weaknesses — the team needs candid feedback to improve. Use the actual quotes from respondents where relevant.";

    // Call Claude API
    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'x-api-key: ' . $cfg['ai']['anthropic_api_key'],
            'anthropic-version: 2023-06-01',
        ],
        CURLOPT_POSTFIELDS => json_encode([
            'model' => 'claude-sonnet-4-20250514',
            'max_tokens' => 2000,
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
        ]),
        CURLOPT_TIMEOUT => 60,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error || $httpCode !== 200) {
        http_response_code(500);
        $apiResponse = json_decode($response, true);
        $apiError = $apiResponse['error']['message'] ?? ($error ?: "HTTP $httpCode");
        echo json_encode(['error' => "AI request failed: $apiError"]);
        return;
    }

    $data = json_decode($response, true);
    $text = $data['content'][0]['text'] ?? '';

    echo json_encode([
        'analysis' => $text,
        'total_responses' => $total,
        'generated_at' => date('Y-m-d H:i:s'),
    ]);
}
