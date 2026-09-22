<?php
defined('ABSPATH') || exit;

block_render('beneficios', [
    'titulo'    => get_field('beneficios_titulo') ?: '',
    'descricao' => get_field('beneficios_descricao') ?: '',
    'items'     => acf_repeater(get_field('beneficios'), fn($item) => [
        'icone' => acf_image($item['icone'] ?? null),
        'titulo' => $item['titulo'] ?? '',
        'texto' => $item['texto'] ?? '',
    ]),
]);
