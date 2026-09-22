<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/single-noticia');

$tpl->wrap('page-single-noticia', function (Tpl $t) use ($page) {
    $page
        ->partial('post')
        ->partial('relacionados');

    $t->scope('global')->partial('fale-conosco');
});
