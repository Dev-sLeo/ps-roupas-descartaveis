<?php
defined('ABSPATH') || exit;

$product_id = get_the_ID();
$ficha      = get_field('ficha_tecnica', $product_id);

block_render('produto-especificacoes', [
    'especificacoes'   => acf_wysiwyg(get_field('especificacoes', $product_id)),
    'caracteristicas'  => acf_wysiwyg(get_field('caracteristica_produto', $product_id)),
    'fichaTecnicaUrl'  => $ficha['url'] ?? '',
    'fichaTecnicaNome' => $ficha['filename'] ?? '',
]);
