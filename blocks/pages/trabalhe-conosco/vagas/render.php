<?php
defined('ABSPATH') || exit;

$group = get_field('vagas_secao') ?: [];

$vagas_posts = get_posts([
    'post_type'      => 'vaga',
    'post_status'    => 'publish',
    'posts_per_page' => -1,
    'orderby'        => 'title',
    'order'          => 'ASC',
    'meta_query'     => [
        'relation' => 'OR',
        [
            'key'     => 'ativa',
            'value'   => '1',
            'compare' => '=',
        ],
        [
            'key'     => 'ativa',
            'compare' => 'NOT EXISTS',
        ],
    ],
]);

block_render('trabalhe-conosco-vagas', [
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    'vagas'     => array_map(fn($post) => [
        'titulo'    => $post->post_title,
        'descricao' => get_field('descricao', $post->ID) ?: '',
        // Cadastro de vaga não tem link próprio: sempre aponta pra âncora do formulário de candidatura.
        'link'      => [
            'label'  => 'Candidatar a vaga',
            'url'    => '#candidatura',
            'target' => '',
        ],
    ], $vagas_posts),
]);
