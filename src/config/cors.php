<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // AQUÍ PONES LA URL DE TU FRONTEND. En desarrollo pon 'http://localhost:5173'
    // En producción pondrás algo como 'https://agrupacionafaselda.com'
    'allowed_origins' => ['http://localhost:5173'], 

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],
    'allowed_origins'=> ['*'],

    'max_age' => 0,

    'supports_credentials' => true,

];