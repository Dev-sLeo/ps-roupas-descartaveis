<?php
defined('ABSPATH') || exit;

global $tpl;
$page = $tpl->scope('pages/trabalhe-conosco');

$tpl->wrap('page-trabalhe-conosco', function (Tpl $t) use ($page) {
    $page
        ->partial('hero')
        ->partial('vagas')
        ->partial('candidatura');
});
