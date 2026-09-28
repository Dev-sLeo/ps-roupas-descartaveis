<?php
defined('ABSPATH') || exit;

global $tpl;

$tpl->wrap('page-conteudo-texto', function (Tpl $t) {
    $t->scope('global')->partial('conteudo-texto');
});
