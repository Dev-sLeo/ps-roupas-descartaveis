<?php
defined('ABSPATH') || exit;

$group = get_field('projetos_especiais') ?: [];

block_render('home-projetos-especiais', [
    'eyebrow'   => $group['eyebrow'] ?? '',
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    // Campo ACF "gallery" retorna um array plano de imagens (não repeater).
    'galeria'   => acf_repeater($group['galeria'] ?? null, fn($img) => [
        'imagem' => acf_image($img),
    ]),
]);
