<?php
defined('ABSPATH') || exit;

global $product;

if (!$product instanceof WC_Product) {
    return;
}

$ids = array_filter([$product->get_image_id(), ...$product->get_gallery_image_ids()]);

$imagens = [];
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

if (empty($imagens)) {
    return;
}

block_render('produto-galeria-principal', [
    'imagens' => $imagens,
]);
