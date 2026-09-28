<?php
defined('ABSPATH') || exit;

$filtros = proseg_blog_filtros($_GET);
$dados   = proseg_blog_query($filtros);

$categorias = [
    [
        'nome'  => 'Em destaque',
        'slug'  => '',
        'ativa' => $filtros['categoria'] === '',
    ],
];

foreach (get_categories(['hide_empty' => false]) as $termo) {
    $categorias[] = [
        'nome'  => $termo->name,
        'slug'  => $termo->slug,
        'ativa' => $filtros['categoria'] === $termo->slug,
    ];
}

$posts_page_id = (int) get_option('page_for_posts');

// Mesma lógica de blocks/pages/blog/hero/render.php: se a Posts Page não for
// a home, o link precisa manter a slug dela (ex: /blog/) — senão o filtro/
// paginação leva pra home num F5.
$arquivo_url = $posts_page_id ? get_permalink($posts_page_id) : home_url('/');

block_render('blog-listagem', [
    'categorias' => $categorias,
    'posts'      => $dados['posts'],
    'paginacao'  => $dados['paginacao'],
    'total'      => $dados['total'],
    'arquivoUrl' => $arquivo_url,
]);
