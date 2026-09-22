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
        $page->partial('formulario');
        ?>
    </div>
    <?php

    // Sem override — usa direto o texto/CTAs da aba "Fale conosco" da options
    // page "Tema" (mesmo módulo global de todas as outras páginas).
    $t->scope('global')->partial('fale-conosco');
});
