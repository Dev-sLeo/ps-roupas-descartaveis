<?php
/**
 * Template para posts individuais do Blog.
 * Não existe CPT `noticia` — os posts são do tipo padrão `post`, então reaproveita
 * o mesmo layout (hero/conteúdo/relacionadas) usado antes em single-noticia.php.
 */
defined('ABSPATH') || exit;

get_header();

while (have_posts()) {
    the_post();
    include THEME_DIR . '/blocks/pages/single-noticia/single-noticia.php';
}

get_footer();
