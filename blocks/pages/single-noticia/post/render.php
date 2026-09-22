<?php
defined('ABSPATH') || exit;

$post_id    = get_the_ID();
$categorias = get_the_category($post_id);
$thumb_id   = get_post_thumbnail_id($post_id);
$url        = get_permalink($post_id);
$titulo     = get_the_title($post_id);

block_render('single-post', [
    'data'      => get_the_date('j \d\e F \d\e Y', $post_id),
    'categoria' => $categorias ? $categorias[0]->name : '',
    'titulo'    => $titulo,
    'imagem'    => $thumb_id ? [
        'url' => wp_get_attachment_image_url($thumb_id, 'large'),
        'alt' => get_post_meta($thumb_id, '_wp_attachment_image_alt', true) ?: $titulo,
    ] : null,
    'conteudo'  => apply_filters('the_content', get_the_content(null, false, $post_id)),
    'compartilhar' => [
        'email'    => 'mailto:?subject=' . rawurlencode($titulo) . '&body=' . rawurlencode($url),
        'linkedin' => 'https://www.linkedin.com/sharing/share-offsite/?url=' . rawurlencode($url),
        'whatsapp' => 'https://wa.me/?text=' . rawurlencode($titulo . ' ' . $url),
        'facebook' => 'https://www.facebook.com/sharer/sharer.php?u=' . rawurlencode($url),
    ],
]);
