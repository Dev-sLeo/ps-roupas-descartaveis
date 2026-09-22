<?php
defined('ABSPATH') || exit;

$product_id = get_the_ID();
$video_url  = get_field('instrucoes_video', $product_id) ?: '';

$capa = get_field('instrucoes_video_capa', $product_id);
$capa_imagem = acf_image($capa ?: null);

if (!$capa_imagem) {
    $thumb_id = get_post_thumbnail_id($product_id);
    $capa_imagem = $thumb_id ? [
        'url' => wp_get_attachment_image_url($thumb_id, 'large'),
        'alt' => get_the_title($product_id),
    ] : null;
}

block_render('produto-instrucoes', [
    'videoUrl' => $video_url,
    'capa'     => $capa_imagem,
]);
