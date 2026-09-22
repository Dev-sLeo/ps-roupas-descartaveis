<?php
/**
 * Override do template de produto único do WooCommerce.
 * Substitui as seções padrão que vêm depois do resumo (abas, upsells,
 * relacionados) pelas seções próprias da página (ver blocks/pages/produto).
 */
defined('ABSPATH') || exit;

get_header();

remove_action('woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs', 10);
remove_action('woocommerce_after_single_product_summary', 'woocommerce_upsell_display', 15);
remove_action('woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20);
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40);

while (have_posts()) {
    the_post();
    include THEME_DIR . '/blocks/pages/produto/produto.php';
}

get_footer();
