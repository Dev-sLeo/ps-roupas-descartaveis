<?php
defined('ABSPATH') || exit;

$group = get_field('produtos_arquivo', 'tema') ?: [];

block_render('produtos-hero', [
    'eyebrow'         => $group['eyebrow'] ?? '',
    'titulo'          => $group['titulo'] ?? '',
    'descricao'       => $group['descricao'] ?? '',
    'buscaPlaceholder' => $group['busca_placeholder'] ?? '',
    'buscaValue'      => sanitize_text_field((string) get_query_var('produto_busca')),
    'arquivoUrl'      => get_post_type_archive_link('product'),
]);
