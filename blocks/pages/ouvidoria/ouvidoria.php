<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/ouvidoria');

$tpl->wrap('page-ouvidoria', function (Tpl $t) use ($page) {
    $page
        ->partial('hero')
        ->partial('contato')
        ->partial('documentos');

    $t->scope('global')->partial('fale-conosco');
});
