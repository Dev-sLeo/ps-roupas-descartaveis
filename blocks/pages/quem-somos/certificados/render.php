<?php
defined('ABSPATH') || exit;

$group = get_field('certificados_secao') ?: [];

block_render('quem-somos-certificados', [
    'eyebrow'   => $group['eyebrow'] ?? '',
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    // Campo ACF "gallery" retorna um array plano de imagens (não repeater).
    'imagens'   => acf_repeater($group['imagens'] ?? null, fn($img) => [
        'imagem' => acf_image($img),
    ]),
    // Decorativo fixo do tema (não é campo ACF) — só aparece no desktop.
    'background' => THEME_URI . '/images/background-certificados.webp',
]);
