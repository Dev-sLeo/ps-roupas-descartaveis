<?php
/**
 * Ajustes de WooCommerce específicos do tema — texto do CTA nativo, botão
 * extra de WhatsApp e a troca da galeria (flexslider padrão do WC vira um
 * slider Swiper — ver blocks/pages/produto/galeria-principal). Layout/estilo
 * do restante fica em src/styles/_woocommerce.scss.
 */
defined('ABSPATH') || exit;

add_filter('woocommerce_product_single_add_to_cart_text', function (): string {
    return 'Adicionar ao orçamento';
});

// Projeto de cotação: produtos não têm preço cadastrado (a loja só monta
// orçamento, não vende direto) — por padrão o WC trata "sem preço" como
// "não comprável"/"variação invisível" e esconde o produto (ou a variação)
// inteiro da loja. Os 3 filtros abaixo desligam essa exigência, deixando
// tudo visível/adicionável ao carrinho mesmo sem preço em nenhum campo.
// `get_price_html()` já retorna string vazia quando o preço é '' — não é
// preciso esconder nenhum elemento de preço manualmente em outro lugar.
add_filter('woocommerce_is_purchasable', '__return_true');
add_filter('woocommerce_variation_is_visible', '__return_true');
add_filter('woocommerce_variation_is_purchasable', '__return_true');

// Produtos variáveis: troca o formulário nativo de variações do WC (tabela de
// selects sem estilo, sem swatch de cor, sem cálculo de peças/pacote) pelo
// bloco React `produto-variacoes` (ver blocks/pages/produto/variacoes) — ele
// já inclui os dois botões (orçamento + WhatsApp) no mesmo layout do Figma,
// então o hook do WhatsApp abaixo é pulado pra esse tipo de produto.
add_action('woocommerce_single_product_summary', function (): void {
    global $product;
    if (!$product instanceof WC_Product || !$product->is_type('variable')) {
        return;
    }
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);
    include THEME_DIR . '/blocks/pages/produto/variacoes/render.php';
}, 25);

// Envolve o(s) botão(ões) de ação (add to cart nativo ou o bloco de variações
// acima, mais o WhatsApp logo abaixo) numa linha flex — ver `.produto__acoes`
// em _woocommerce.scss. Pra produto variável sobra só 1 filho aqui dentro (o
// bloco React já traz os 2 botões junto), o que não muda nada visualmente.
add_action('woocommerce_single_product_summary', fn () => print('<div class="produto__acoes">'), 29);
add_action('woocommerce_single_product_summary', fn () => print('</div>'), 36);

// Troca a galeria padrão do WooCommerce (thumbnails + fade, sem setas) por um
// slider Swiper de verdade (imagem principal arrastável, com seta/seta/bullets
// centralizados abaixo, sem miniaturas) — mesma fonte de imagens (imagem
// destacada + galeria do produto).
remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20);
add_action('woocommerce_before_single_product_summary', function (): void {
    include THEME_DIR . '/blocks/pages/produto/galeria-principal/render.php';
}, 20);

add_action('woocommerce_single_product_summary', function (): void {
    global $product;
    // Produtos variáveis já têm o próprio botão de WhatsApp dentro do bloco
    // `produto-variacoes` (ver hook de prioridade 25 acima) — evita duplicar.
    if ($product instanceof WC_Product && $product->is_type('variable')) {
        return;
    }

    $footer   = get_field('footer', 'tema') ?: [];
    $whatsapp = $footer['whatsapp'] ?? '';
    if ($whatsapp === '') {
        return;
    }

    $href = whatsapp_url($whatsapp, sprintf('Olá! Tenho interesse no produto "%s".', get_the_title()));
    ?>
    <a href="<?php echo esc_url($href); ?>" target="_blank" rel="noopener noreferrer" class="produto__falar-btn">
        Falar com nossa equipe
    </a>
    <?php
}, 35);

/**
 * Carrinho de cotação (ver blocks/pages/carrinho) → pedido real no WooCommerce.
 *
 * Ao enviar com sucesso o form CF7 da página "Carrinho de Compras", cria um
 * pedido (status "on-hold") com os itens da sessão do carrinho + dados do
 * cliente, e esvazia o carrinho. Identifica QUAL form CF7 é o de cotação pela
 * presença do campo oculto `carrinho-resumo` (em vez de fixar um ID de form)
 * — assim continua funcionando mesmo se o form for recriado/duplicado.
 *
 * Nomes de campo esperados no form CF7 (ver instruções passadas ao usuário
 * pra montar o form): nome-completo, email-corporativo, telefone,
 * empresa-cnpj, notas, regime-tributacao, carrinho-resumo (hidden).
 */
add_action('wpcf7_mail_sent', function (WPCF7_ContactForm $form): void {
    $submission = WPCF7_Submission::get_instance();
    if (!$submission) {
        return;
    }

    $data = $submission->get_posted_data();
    if (!array_key_exists('carrinho-resumo', $data)) {
        return; // Não é o form de cotação do carrinho — nada a fazer.
    }

    if (!function_exists('WC') || !WC()->cart || WC()->cart->is_empty()) {
        return;
    }

    // Sem preço em nenhum pedido de cotação, os e-mails NATIVOS do WC (New
    // Order/Customer On-Hold, disparados pela transição de status abaixo)
    // mostrariam "Total: R$ 0,00" pro cliente — confuso, já que o e-mail do
    // próprio CF7 (configurado no form) é quem realmente comunica a
    // solicitação. Desliga só esses 2, só durante a criação deste pedido.
    $desligarEmailsNativos = fn () => false;
    add_filter('woocommerce_email_enabled_new_order', $desligarEmailsNativos);
    add_filter('woocommerce_email_enabled_customer_on_hold_order', $desligarEmailsNativos);

    $order = wc_create_order();

    foreach (WC()->cart->get_cart() as $item) {
        $order->add_product($item['data'], $item['quantity'], [
            'variation' => $item['variation'] ?? [],
            'subtotal'  => 0,
            'total'     => 0,
        ]);
    }

    $order->set_address([
        'first_name' => sanitize_text_field($data['nome-completo'] ?? ''),
        'email'      => sanitize_email($data['email-corporativo'] ?? ''),
        'phone'      => sanitize_text_field($data['telefone'] ?? ''),
        'company'    => sanitize_text_field($data['empresa-cnpj'] ?? ''),
    ], 'billing');

    if (!empty($data['regime-tributacao'])) {
        $order->update_meta_data('_regime_tributacao', sanitize_text_field($data['regime-tributacao']));
    }

    if (!empty($data['notas'])) {
        $order->add_order_note('Notas do cliente: ' . sanitize_textarea_field($data['notas']));
    }

    $order->set_created_via('cotacao');
    $order->calculate_totals();
    $order->update_status('on-hold', 'Solicitação de cotação recebida pelo site — aguardando orçamento formal.');
    $order->save();

    remove_filter('woocommerce_email_enabled_new_order', $desligarEmailsNativos);
    remove_filter('woocommerce_email_enabled_customer_on_hold_order', $desligarEmailsNativos);

    WC()->cart->empty_cart();
}, 10, 1);
