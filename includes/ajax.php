<?php
defined('ABSPATH') || exit;

/**
 * Filtro/busca/paginação AJAX do arquivo de produtos (WooCommerce).
 * Espelha exatamente a mesma query do SSR (ver `pre_get_posts` em
 * includes/setup.php e `proseg_produtos_query()` em includes/helpers.php),
 * lida a partir do próprio $_GET — o JS (src/utils/ajaxFiltro.ts) já
 * atualiza a URL via history.pushState antes de disparar essa requisição,
 * então os mesmos parâmetros continuam lá se a página for recarregada.
 */
function proseg_ajax_filtrar_produtos(): void {
    check_ajax_referer('proseg_ajax', 'nonce');

    $filtros = proseg_produtos_filtros($_GET);

    wp_send_json_success(proseg_produtos_query($filtros));
}
add_action('wp_ajax_filtrar_produtos', 'proseg_ajax_filtrar_produtos');
add_action('wp_ajax_nopriv_filtrar_produtos', 'proseg_ajax_filtrar_produtos');

/**
 * Filtro/busca/paginação AJAX do blog (Posts Page + resultados de busca).
 * Mesmo padrão de proseg_ajax_filtrar_produtos() — espelha o SSR
 * (proseg_blog_query() em includes/helpers.php) a partir do próprio $_GET.
 */
function proseg_ajax_filtrar_blog(): void {
    check_ajax_referer('proseg_ajax', 'nonce');

    $filtros = proseg_blog_filtros($_GET);

    wp_send_json_success(proseg_blog_query($filtros));
}
add_action('wp_ajax_filtrar_blog', 'proseg_ajax_filtrar_blog');
add_action('wp_ajax_nopriv_filtrar_blog', 'proseg_ajax_filtrar_blog');

/**
 * Altera a quantidade de um item do carrinho (página "Carrinho de Compras" —
 * ver blocks/pages/carrinho/itens). Carrinho de cotação, sem preço — só
 * atualiza a quantidade na sessão do WC mesmo, nada de totais.
 */
function proseg_ajax_carrinho_atualizar_item(): void {
    check_ajax_referer('proseg_ajax', 'nonce');

    $key    = sanitize_text_field((string) ($_POST['cart_item_key'] ?? ''));
    $qty    = max(1, (int) ($_POST['quantidade'] ?? 1));

    if ($key === '' || !function_exists('WC') || !WC()->cart || !WC()->cart->get_cart_item($key)) {
        wp_send_json_error();
    }

    WC()->cart->set_quantity($key, $qty, true);

    wp_send_json_success(['quantidade' => $qty]);
}
add_action('wp_ajax_carrinho_atualizar_item', 'proseg_ajax_carrinho_atualizar_item');
add_action('wp_ajax_nopriv_carrinho_atualizar_item', 'proseg_ajax_carrinho_atualizar_item');

/**
 * Remove um item do carrinho (ícone de lixeira em blocks/pages/carrinho/itens).
 */
function proseg_ajax_carrinho_remover_item(): void {
    check_ajax_referer('proseg_ajax', 'nonce');

    $key = sanitize_text_field((string) ($_POST['cart_item_key'] ?? ''));

    if ($key === '' || !function_exists('WC') || !WC()->cart || !WC()->cart->get_cart_item($key)) {
        wp_send_json_error();
    }

    WC()->cart->remove_cart_item($key);

    wp_send_json_success();
}
add_action('wp_ajax_carrinho_remover_item', 'proseg_ajax_carrinho_remover_item');
add_action('wp_ajax_nopriv_carrinho_remover_item', 'proseg_ajax_carrinho_remover_item');
