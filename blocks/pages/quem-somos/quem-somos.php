<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/quem-somos');

$tpl->wrap('page-quem-somos', function (Tpl $t) use ($page) {
    $t->scope('global')
        ->partial('hero-estatico')
        ->partial('quem-somos');

    $page->partial('galeria');

    $t->scope('global')->partial('beneficios');

    $page->partial('certificados');

    // "Fale conosco" é o mesmo bloco global da Home (mesma estrutura visual),
    // mas com texto próprio desta página — por isso o override via 2º argumento
    // do partial() em vez de puxar da options page "Tema".
    $faleConosco = get_field('fale_conosco_secao') ?: [];

    $t->scope('global')->partial('fale-conosco', [
        'eyebrow'   => $faleConosco['eyebrow'] ?? '',
        'titulo'    => $faleConosco['titulo'] ?? '',
        'descricao' => $faleConosco['descricao'] ?? '',
        'cta1'      => acf_link($faleConosco['cta_1'] ?? null),
        'cta2'      => acf_link($faleConosco['cta_2'] ?? null),
    ]);
});
