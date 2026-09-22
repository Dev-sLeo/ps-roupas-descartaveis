<?php
/**
 * Resultados de busca — reaproveita o mesmo layout do Blog (hero + listagem),
 * já que a busca aciona `is_search()` e o WordPress sai do template `home.php`
 * independente da URL de onde o formulário foi enviado.
 */
defined('ABSPATH') || exit;

get_header();
include THEME_DIR . '/blocks/pages/blog/blog.php';
get_footer();
