<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/carrinho');

$tpl->wrap('page-carrinho', function (Tpl $t) use ($page) {
    ?>
    <div class="carrinho__container">
        <nav class="carrinho__breadcrumb" aria-label="Breadcrumb">
            <span class="carrinho__breadcrumb-item"><a href="<?php echo esc_url(home_url('/')); ?>">Início</a></span>
            <span class="carrinho__breadcrumb-item carrinho__breadcrumb-item--current">Carrinho de Compras</span>
        </nav>
        <h1 class="carrinho__title">Carrinho de Compras</h1>
        <?php

        $page->partial('itens');

        $faleConosco = get_field('fale_conosco_secao') ?: [];

        $page->partial('formulario');
        ?>
    </div>
    <?php

    $t->scope('global')->partial('fale-conosco', [
        'eyebrow'   => $faleConosco['eyebrow'] ?? '',
        'titulo'    => $faleConosco['titulo'] ?? '',
        'descricao' => $faleConosco['descricao'] ?? '',
        'cta1'      => acf_link($faleConosco['cta_1'] ?? null),
        'cta2'      => acf_link($faleConosco['cta_2'] ?? null),
    ]);
});
