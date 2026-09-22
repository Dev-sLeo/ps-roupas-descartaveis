<?php
defined('ABSPATH') || exit;

$group  = get_field('formulario_secao') ?: [];
$footer = get_field('footer', 'tema') ?: [];

// Campo ACF "cf7_form" (plugin acf-cf7-field, return_format "shortcode") — já vem
// pronto como "[contact-form-7 id="..."]". do_shortcode() aqui, ainda dentro do
// corpo da página (antes de wp_footer), garante que o CF7 enfileira seu JS/CSS.
$formHtml = !empty($group['formulario']) ? do_shortcode($group['formulario']) : '';

block_render('contato-formulario', [
    'titulo'     => $group['titulo'] ?? '',
    'descricao'  => $group['descricao'] ?? '',
    'telefone'   => $footer['telefone'] ?? '',
    'whatsapp'   => $footer['whatsapp'] ?? '',
    'email'      => $footer['email'] ?? '',
    'endereco'   => $group['endereco'] ?? '',
    'horario'    => $group['horario'] ?? '',
    'formTitulo' => $group['form_titulo'] ?? '',
    'formHtml'   => $formHtml,
]);
