<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/contato');

$tpl->wrap('page-contato', function (Tpl $t) use ($page) {
    $page
        ->partial('hero')
        ->partial('formulario')
        ->partial('certificados');

    $group = get_field('cta_orcamento') ?: [];

    $t->scope('global')->partial('fale-conosco', [
        'eyebrow'   => $group['eyebrow'] ?? '',
        'titulo'    => $group['titulo'] ?? '',
        'descricao' => $group['descricao'] ?? '',
        'cta1'      => acf_link($group['cta_1'] ?? null),
        'cta2'      => acf_link($group['cta_2'] ?? null),
    ]);
});
