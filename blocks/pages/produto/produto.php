<?php
defined('ABSPATH') || exit;

global $tpl, $product;

if (!$product instanceof WC_Product) {
    $product = wc_get_product(get_the_ID());
}

$page = $tpl->scope('pages/produto');

$tpl->wrap('page-produto', function (Tpl $t) use ($page) {
    ?>
    <div class="produto__breadcrumb-wrap">
        <nav class="produto__breadcrumb" aria-label="Breadcrumb">
            <?php
            $breadcrumb = new WC_Breadcrumb();
            $breadcrumb->add_crumb('Início', home_url('/'));
            $breadcrumb->generate();
            $crumbs = $breadcrumb->get_breadcrumb();
            $total  = count($crumbs);
            foreach ($crumbs as $i => $crumb) {
                [$label, $url] = $crumb;
                $isCurrent = $i === $total - 1;
                ?>
                <span class="produto__breadcrumb-item<?php echo $isCurrent ? ' produto__breadcrumb-item--current' : ''; ?>">
                    <?php if (!$isCurrent && $url) : ?>
                        <a href="<?php echo esc_url($url); ?>"><?php echo esc_html($label); ?></a>
                    <?php else : ?>
                        <?php echo esc_html($label); ?>
                    <?php endif; ?>
                </span>
                <?php
            }
            ?>
        </nav>
    </div>

    <div class="produto__topo">
        <?php wc_get_template_part('content', 'single-product'); ?>
    </div>
    <?php

    $page
        ->partial('especificacoes')
        ->partial('instrucoes')
        ->partial('galeria');

    // Produtos relacionados — nativo do WooCommerce (query/lógica prontas),
    // só restilizado via CSS pra bater com o resto da página.
    woocommerce_output_related_products();

    $t->scope('global')->partial('fale-conosco');
});
