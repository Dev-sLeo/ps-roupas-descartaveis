<?php
defined('ABSPATH') || exit;

$group = get_field('clientes_secao') ?: [];

block_render('home-clientes', [
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    'logos'     => acf_repeater($group['logos'] ?? null, fn($item) => [
        'logo' => acf_image($item['logo'] ?? null),
    ]),
]);
