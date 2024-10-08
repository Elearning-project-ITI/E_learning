<?php
return [
    'paths' => ['api/*', 'broadcasting/auth', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL')],  // Replace with your Angular URL
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];