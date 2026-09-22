<?php
/**
 * Override do arquivo de produtos do WooCommerce (shop + qualquer archive de
 * post_type "product"). Substitui a UI padrão do WooCommerce (loop/sidebar)
 * pelas seções próprias da página (ver blocks/pages/produtos).
 */
defined('ABSPATH') || exit;

get_header();
include THEME_DIR . '/blocks/pages/produtos/produtos.php';
get_footer();
