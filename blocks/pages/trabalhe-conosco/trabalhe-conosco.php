<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/trabalhe-conosco');

$tpl->wrap('page-trabalhe-conosco', function (Tpl $t) use ($page) {
    $t->scope('global')->partial('hero-estatico');

    $page
        ->partial('vagas')
        ->partial('candidatura');
});
