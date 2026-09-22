<?php
defined('ABSPATH') || exit;

$group = get_field('documentos_secao') ?: [];

block_render('ouvidoria-documentos', [
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    'itens'     => acf_repeater($group['itens'] ?? null, fn($item) => [
        'categoria' => $item['categoria'] ?? '',
        'nome'      => $item['nome'] ?? '',
        'descricao' => $item['descricao'] ?? '',
        'arquivo'   => !empty($item['arquivo']['url']) ? [
            'url'  => $item['arquivo']['url'],
            'nome' => $item['arquivo']['filename'] ?? '',
        ] : null,
    ]),
]);
