<?php
defined('ABSPATH') || exit;

$group = get_field('certificados_secao') ?: [];

block_render('contato-certificados', [
    'titulo'     => $group['titulo'] ?? '',
    'descricao'  => $group['descricao'] ?? '',
    'categorias' => acf_repeater($group['categorias'] ?? null, fn($item) => [
        'nome' => $item['nome'] ?? '',
    ]),
    'documentos' => acf_repeater($group['documentos'] ?? null, fn($item) => [
        'titulo'    => $item['titulo'] ?? '',
        'categoria' => $item['categoria'] ?? '',
        'descricao' => $item['descricao'] ?? '',
        'arquivo'   => !empty($item['arquivo']['url']) ? $item['arquivo']['url'] : '',
    ]),
]);
