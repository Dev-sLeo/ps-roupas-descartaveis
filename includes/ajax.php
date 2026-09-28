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
 * Adiciona um produto ao carrinho via AJAX, sem reload — usado tanto pelo
 * form.cart nativo do WooCommerce (produto simples, interceptado por
 * src/utils/ajaxAddToCart.ts) quanto pelo form do bloco React
 * `produto-variacoes` (produto variável). Os nomes de campo batem com o
 * padrão nativo do WC: product_id, quantity, variation_id e attribute_*
 * (ver blocks/pages/produto/variacoes/render.php, que já monta `attr.key`
 * como `attribute_{slug}`).
 *
 * IMPORTANTE: nunca ler/aceitar uma chave "add-to-cart" aqui (nem no JS que
 * chama este endpoint) — `WC_Form_Handler::add_to_cart_action()` fica de olho
 * em `$_REQUEST['add-to-cart']` em QUALQUER request, inclusive admin-ajax.php
 * (o hook `wp_loaded` roda antes da própria action `wp_ajax_*` disparar). Se
 * essa chave vier preenchida, o WooCommerce adiciona o produto pelo fluxo
 * nativo E este handler adiciona de novo — 2 itens no carrinho por 1 clique.
 */
function proseg_ajax_adicionar_carrinho(): void {
    check_ajax_referer('proseg_ajax', 'nonce');

    if (!function_exists('WC') || !WC()->cart) {
        wp_send_json_error(['message' => 'Carrinho indisponível.']);
    }

    $product_id   = absint($_POST['product_id'] ?? 0);
    $quantity     = max(1, (int) ($_POST['quantity'] ?? 1));
    $variation_id = absint($_POST['variation_id'] ?? 0);

    if (!$product_id) {
        wp_send_json_error(['message' => 'Produto inválido.']);
    }

    $variation = [];
    foreach ($_POST as $key => $value) {
        if (strpos((string) $key, 'attribute_') === 0 && is_string($value)) {
            $variation[$key] = wc_clean(wp_unslash($value));
        }
    }

    $added = WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variation);

    if (!$added) {
        $notices = wc_get_notices('error');
        wc_clear_notices();
        $message = $notices ? wp_strip_all_tags($notices[0]['notice']) : 'Não foi possível adicionar o produto ao orçamento.';
        wp_send_json_error(['message' => $message]);
    }

    wc_clear_notices();

    wp_send_json_success([
        'count'   => WC()->cart->get_cart_contents_count(),
        'message' => sprintf('%s adicionado ao orçamento.', wp_strip_all_tags(get_the_title($product_id))),
    ]);
}
add_action('wp_ajax_adicionar_carrinho', 'proseg_ajax_adicionar_carrinho');
add_action('wp_ajax_nopriv_adicionar_carrinho', 'proseg_ajax_adicionar_carrinho');

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
