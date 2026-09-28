<?php
defined('ABSPATH') || exit;

$group = get_field('certificados_secao', 'tema') ?: [];

block_render('ouvidoria-documentos', [
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    'itens'     => acf_repeater($group['documentos'] ?? null, fn($item) => [
        'categoria' => $item['categoria'] ?? '',
        'nome'      => $item['titulo'] ?? '',
        'descricao' => $item['descricao'] ?? '',
        'arquivo'   => !empty($item['arquivo']['url']) ? [
            'url'  => $item['arquivo']['url'],
            'nome' => $item['arquivo']['filename'] ?? '',
        ] : null,
    ]),
]);
