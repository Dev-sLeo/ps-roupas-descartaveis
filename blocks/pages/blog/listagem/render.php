<?php
defined('ABSPATH') || exit;

global $wp_query;

$categoria_ativa = sanitize_title(get_query_var('blog_categoria'));

$categorias = [
    [
        'nome'   => 'Em destaque',
        'slug'   => '',
        'url'    => remove_query_arg(['blog_categoria', 'paged']),
        'ativa'  => $categoria_ativa === '',
    ],
];

foreach (get_categories(['hide_empty' => false]) as $termo) {
    $categorias[] = [
        'nome'  => $termo->name,
        'slug'  => $termo->slug,
        'url'   => add_query_arg('blog_categoria', $termo->slug, remove_query_arg('paged')),
        'ativa' => $categoria_ativa === $termo->slug,
    ];
}

$posts = acf_repeater($wp_query->posts, fn($post) => blog_post_card($post, 90));

$pagina_atual = max(1, (int) get_query_var('paged'));
$total_paginas = (int) $wp_query->max_num_pages;

$paginacao = [];
for ($i = 1; $i <= $total_paginas; $i++) {
    $link = get_pagenum_link($i);
    if ($categoria_ativa !== '') {
        $link = add_query_arg('blog_categoria', $categoria_ativa, $link);
    }

    $paginacao[] = [
        'numero' => $i,
        'url'    => $link,
        'ativa'  => $i === $pagina_atual,
    ];
}

block_render('blog-listagem', [
    'categorias' => $categorias,
    'posts'      => $posts,
    'paginacao'  => $paginacao,
]);
