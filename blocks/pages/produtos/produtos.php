<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/produtos');

$tpl->wrap('page-produtos', function (Tpl $t) use ($page) {
    $page
        ->partial('hero')
        ->partial('catalogo');

    $t->scope('global')->partial('fale-conosco');
});
