<?php
defined('ABSPATH') || exit;

global $tpl;
$home = $tpl->scope('pages/home');

$tpl->wrap('page-home', function (Tpl $t) use ($home) {
    $home->partial('hero');

    $t->scope('global')
        ->partial('beneficios')
        ->partial('quem-somos');

    $home
        ->partial('clientes')
        ->partial('produtos')
        ->partial('embalagens')
        ->partial('projetos-especiais');

    $t->scope('global')->partial('fale-conosco');
});
