<?php
defined('ABSPATH') || exit;

$filtros = proseg_produtos_filtros($_GET);
$dados   = proseg_produtos_query($filtros);

$categorias = [];

if (taxonomy_exists('product_cat')) {
    $termos = get_terms([
        'taxonomy'   => 'product_cat',
        'hide_empty' => false,
        'exclude'    => [(int) get_option('default_product_cat')],
        'orderby'    => 'name',
        'order'      => 'ASC',
    ]);

    if (!is_wp_error($termos)) {
        $selecionadas = array_filter(explode(',', $filtros['categoria']));

        $categorias = array_map(fn($termo) => [
            'slug'      => $termo->slug,
            'nome'      => $termo->name,
            'checked'   => in_array($termo->slug, $selecionadas, true),
        ], $termos);
    }
}

block_render('produtos-catalogo', [
    'categorias' => $categorias,
    'destaque'   => $filtros['destaque'],
    'busca'      => $filtros['busca'],
    'produtos'   => $dados['produtos'],
    'paginacao'  => $dados['paginacao'],
    'total'      => $dados['total'],
    'arquivoUrl' => get_post_type_archive_link('product'),
]);
