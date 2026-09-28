<?php
defined('ABSPATH') || exit;

$group = get_field('cotacao_secao') ?: [];

// Campo ACF "cf7_form" (plugin acf-cf7-field, return_format "shortcode") — já vem
// pronto como "[contact-form-7 id="..."]". do_shortcode() aqui, ainda dentro do
// corpo da página (antes de wp_footer), garante que o CF7 enfileira seu JS/CSS.
$formHtml = !empty($group['formulario']) ? do_shortcode($group['formulario']) : '';

block_render('carrinho-formulario', [
    'titulo'      => $group['titulo'] ?? '',
    'descricao'   => $group['descricao'] ?? '',
    'formHtml'    => $formHtml,
    'produtosUrl' => function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/produtos/'),
]);
