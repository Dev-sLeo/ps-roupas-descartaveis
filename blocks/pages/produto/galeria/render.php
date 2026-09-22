<?php
defined('ABSPATH') || exit;

global $product;

$imagens = [];

if ($product instanceof WC_Product) {
    // Só as imagens extras da galeria do WooCommerce (sem repetir a imagem
    // principal, que já aparece na visualização do topo).
    $ids = $product->get_gallery_image_ids();

    foreach ($ids as $attachment_id) {
        $src = wp_get_attachment_image_src($attachment_id, 'large');
        if (!$src) {
            continue;
        }

        $imagens[] = [
            'url'    => $src[0],
            'alt'    => get_post_meta($attachment_id, '_wp_attachment_image_alt', true) ?: get_the_title($product->get_id()),
            'width'  => (int) $src[1],
            'height' => (int) $src[2],
        ];
    }
}

block_render('produto-galeria', [
    'imagens' => $imagens,
]);
