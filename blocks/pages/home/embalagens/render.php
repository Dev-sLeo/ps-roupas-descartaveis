<?php
defined('ABSPATH') || exit;

$group = get_field('embalagens_secao') ?: [];

block_render('home-embalagens', [
    'eyebrow'   => $group['eyebrow'] ?? '',
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    'imagem'    => acf_image($group['imagem'] ?? null),
    'destaques' => acf_repeater($group['destaques'] ?? null, fn($item) => [
        'titulo' => $item['titulo'] ?? '',
        'texto'  => $item['texto'] ?? '',
    ]),
    'botao'     => acf_link($group['botao'] ?? null),
]);
