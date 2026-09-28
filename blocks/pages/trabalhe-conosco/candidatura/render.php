<?php
defined('ABSPATH') || exit;

$group = get_field('candidatura_secao') ?: [];

// Campo ACF "cf7_form" (plugin acf-cf7-field, return_format "shortcode") — já vem
// pronto como "[contact-form-7 id="..."]". do_shortcode() aqui, ainda dentro do
// corpo da página (antes de wp_footer), garante que o CF7 enfileira seu JS/CSS.
$formHtml = !empty($group['formulario']) ? do_shortcode($group['formulario']) : '';

// Vagas ativas do CPT "vaga" para popular o menu customizado do campo
// `sua-vaga` do formulário (mesma query de trabalhe-conosco/vagas/render.php —
// ver comentário em includes/cpt-vagas.php sobre o <select> nativo do CF7).
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

block_render('trabalhe-conosco-candidatura', [
    'titulo'     => $group['titulo'] ?? '',
    'descricao'  => $group['descricao'] ?? '',
    'imagem'     => acf_image($group['imagem'] ?? null),
    'formTitulo' => $group['form_titulo'] ?? '',
    'formHtml'   => $formHtml,
    'vagas'      => array_map(fn($post) => ['titulo' => $post->post_title], $vagas_posts),
]);
