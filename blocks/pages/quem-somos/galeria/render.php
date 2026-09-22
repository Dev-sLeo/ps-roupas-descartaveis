<?php
defined('ABSPATH') || exit;

$group = get_field('galeria_secao') ?: [];

block_render('quem-somos-galeria', [
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    // Campo ACF "gallery" retorna um array plano de imagens (não repeater).
    'imagens'   => acf_repeater($group['imagens'] ?? null, fn($img) => [
        'imagem' => acf_image($img),
    ]),
]);
