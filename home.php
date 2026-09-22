<?php
/**
 * Template para a página de listagem do Blog (Posts Page).
 * Usado automaticamente pelo WordPress quando uma página estática é definida
 * como front page e outra página é escolhida em Ajustes → Leitura como "Posts page"
 * (no caso, a page "Blog").
 */
defined('ABSPATH') || exit;

get_header();
include THEME_DIR . '/blocks/pages/blog/blog.php';
get_footer();
