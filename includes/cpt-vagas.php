<?php
defined('ABSPATH') || exit;

/**
 * CPT "Vaga" — sem URL pública, usado apenas para cadastrar vagas
 * e popular dinamicamente o select "Vaga" do formulário CF7
 * de candidatura em Trabalhe Conosco.
 */
add_action('init', function () {
    register_post_type('vaga', [
        'labels' => [
            'name'               => 'Vagas',
            'singular_name'      => 'Vaga',
            'add_new'            => 'Adicionar vaga',
            'add_new_item'       => 'Adicionar nova vaga',
            'edit_item'          => 'Editar vaga',
            'new_item'           => 'Nova vaga',
            'view_item'          => 'Ver vaga',
            'search_items'       => 'Buscar vagas',
            'not_found'          => 'Nenhuma vaga encontrada',
            'not_found_in_trash' => 'Nenhuma vaga na lixeira',
            'all_items'          => 'Todas as vagas',
            'menu_name'          => 'Vagas',
        ],
        'public'              => false,
        'publicly_queryable'  => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => false,
        'has_archive'         => false,
        'rewrite'             => false,
        'query_var'           => false,
        'exclude_from_search' => true,
        'capability_type'     => 'post',
        'supports'            => ['title'],
        'menu_icon'           => 'dashicons-businessman',
        'menu_position'       => 26,
    ]);
});

/**
 * Popula dinamicamente as opções do select "vaga" no formulário CF7
 * de candidatura com as vagas cadastradas (CPT "vaga", publicadas).
 */
add_filter('wpcf7_form_tag', function ($tag) {
    if (!is_object($tag) || $tag->name !== 'vaga' || !in_array($tag->basetype, ['select', 'checkbox', 'radio'], true)) {
        return $tag;
    }

    $vagas = get_posts([
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

    if (empty($vagas)) {
        return $tag;
    }

    $values  = [];
    $labels  = [];

    foreach ($vagas as $vaga) {
        $values[]  = $vaga->post_title;
        $labels[]  = $vaga->post_title;
    }

    $tag->raw_values = $values;
    $tag->values      = $values;
    $tag->labels      = $labels;

    return $tag;
}, 10, 1);
