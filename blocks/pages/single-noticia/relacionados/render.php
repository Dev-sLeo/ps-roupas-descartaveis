<?php
defined('ABSPATH') || exit;

$post_id = get_the_ID();

$query = new WP_Query([
    'post_type'           => 'post',
    'posts_per_page'      => 3,
    'post__not_in'        => [$post_id],
    'orderby'             => 'date',
    'order'               => 'DESC',
    'ignore_sticky_posts' => true,
    'no_found_rows'       => true,
]);

$relacionados = acf_repeater($query->posts, fn($p) => blog_post_card($p, 90));

wp_reset_postdata();

block_render('single-relacionados', [
    'titulo' => 'Artigos relacionados',
    'posts'  => $relacionados,
]);
