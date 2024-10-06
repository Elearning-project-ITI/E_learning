<?php
return [
    'paths' => ['api/*', 'broadcasting/auth', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://172.20.0.4:4200'],  // Replace with your Angular URL
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];