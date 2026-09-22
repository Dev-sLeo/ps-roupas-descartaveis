<?php
defined('ABSPATH') || exit;

block_render('beneficios', [
    'items' => acf_repeater(get_field('beneficios'), fn($item) => [
        'icone' => acf_image($item['icone'] ?? null),
        'titulo' => $item['titulo'] ?? '',
        'texto' => $item['texto'] ?? '',
    ]),
]);
