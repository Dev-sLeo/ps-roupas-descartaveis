<?php
defined('ABSPATH') || exit;

$produtos_page = get_page_by_path('produtos');
$group = $produtos_page ? (get_field('produtos_arquivo', $produtos_page->ID) ?: []) : [];

block_render('produtos-hero', [
    'eyebrow'         => $group['eyebrow'] ?? '',
    'titulo'          => $group['titulo'] ?? '',
    'descricao'       => $group['descricao'] ?? '',
    'buscaPlaceholder' => $group['busca_placeholder'] ?? '',
    'buscaValue'      => sanitize_text_field((string) get_query_var('produto_busca')),
    'arquivoUrl'      => get_post_type_archive_link('product'),
    // Mesmos decorativos fixos do tema usados em pages/contato, ouvidoria e
    // trabalhe-conosco (Hero) — não são campo ACF, só aparecem no desktop.
    'patternLeft'     => THEME_URI . '/images/pattern-left-header-alternative.webp',
    'patternRight'    => THEME_URI . '/images/pattern-right-header-alternative.webp',
]);
