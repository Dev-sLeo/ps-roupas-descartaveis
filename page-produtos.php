<?php
/**
 * Template Name: Produtos
 *
 * Não é a rota real do arquivo de produtos (isso é woocommerce/archive-product.php,
 * que atende /produto/). Esta página só existe para hospedar os campos ACF da
 * aba "Produtos (arquivo)" — o admin edita aqui, o archive-product.php lê os
 * campos por essa página via get_page_by_path('produtos').
 */
defined('ABSPATH') || exit;

get_header();
include THEME_DIR . '/blocks/pages/produtos/produtos.php';
get_footer();
