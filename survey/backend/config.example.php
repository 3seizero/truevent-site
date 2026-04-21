<?php
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'truevent_survey',
        'user' => 'Admin_Survey',
        'pass' => 'YOUR_PASSWORD_HERE',
    ],
    'smtp' => [
        'host' => 'mail.truevent.eu',
        'port' => 465,
        'encryption' => 'ssl',  // 'ssl' per 465, 'tls' per 587
    ],
    'mail_accounts' => [
        // Account di default
        'default' => [
            'username' => 'customer@truevent.eu',
            'password' => 'YOUR_EMAIL_PASSWORD',
            'from_name' => 'Customer Service',
        ],
        // Account per form specifici (il slug del form come chiave)
        'puglia-2026-feedback' => [
            'username' => 'customer@truevent.eu',
            'password' => 'YOUR_EMAIL_PASSWORD',
            'from_name' => 'Customer Service',
        ],
        // Esempio per form futuri:
        // 'dolomites-2026-feedback' => [
        //     'username' => 'dolomites@truevent.eu',
        //     'password' => 'PASSWORD',
        //     'from_name' => 'TRUE Dolomites',
        // ],
    ],
    'admin_recipients' => [
        'admin@truevent.eu',
        'customer@truevent.eu',
    ],
    'admin' => [
        'session_secret' => 'CHANGE_THIS_TO_RANDOM_STRING',
    ],
    'ai' => [
        'anthropic_api_key' => '',
    ],
];
