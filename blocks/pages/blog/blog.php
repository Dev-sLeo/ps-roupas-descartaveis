<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/blog');

$tpl->wrap('page-blog', function (Tpl $t) use ($page) {
    $page
        ->partial('hero')
        ->partial('listagem');

    $t->scope('global')->partial('fale-conosco');
});
