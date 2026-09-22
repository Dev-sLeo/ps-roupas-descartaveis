<?php
defined('ABSPATH') || exit;

// A "Posts page" não é o objeto de query principal no Loop do blog (que itera os
// posts) — os campos do hero ficam na própria página estática escolhida em
// Ajustes → Leitura, então precisam do ID explícito em vez do post atual.
$posts_page_id = (int) get_option('page_for_posts');
$hero          = $posts_page_id ? (get_field('hero', $posts_page_id) ?: []) : [];

block_render('blog-hero', [
    'eyebrow'     => $hero['eyebrow'] ?? '',
    'titulo'      => $hero['titulo'] ?? '',
    'searchValue' => get_search_query(),
    'searchUrl'   => home_url('/'),
]);
