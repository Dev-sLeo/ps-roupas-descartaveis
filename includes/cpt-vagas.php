<?php
defined('ABSPATH') || exit;

/**
 * CPT "Vaga" — sem URL pública, usado apenas para cadastrar vagas exibidas
 * em `pages/trabalhe-conosco/vagas`. Ao clicar em "Candidatar a vaga" o título
 * é escrito direto no campo de texto `sua-vaga` do formulário CF7 de
 * candidatura (ver `src/blocks/pages/trabalhe-conosco/Vagas/index.tsx`) — não
 * populamos mais um <select> do CF7 via `wpcf7_form_tag`, porque um <select>
 * com opções geradas/alteradas via script tem bug de renderização no CF7.
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
