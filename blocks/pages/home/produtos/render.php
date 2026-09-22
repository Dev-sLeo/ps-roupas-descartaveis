<?php
defined('ABSPATH') || exit;

$group = get_field('produtos_secao') ?: [];

$categorias = [];

if (class_exists('WC_Product') && taxonomy_exists('product_cat')) {
    $terms = get_terms([
        'taxonomy'   => 'product_cat',
        'hide_empty' => false,
        'exclude'    => [(int) get_option('default_product_cat')],
        'orderby'    => 'name',
        'order'      => 'ASC',
    ]);

    if (!is_wp_error($terms)) {
        $categorias = array_map('wc_category_card', $terms);
    }
}

block_render('home-produtos', [
    'eyebrow'   => $group['eyebrow'] ?? '',
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    'produtos'  => $categorias,
    'botao'     => acf_link($group['botao'] ?? null),
]);
