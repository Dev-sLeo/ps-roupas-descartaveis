<?php
defined('ABSPATH') || exit;

$group = get_field('conteudo_texto') ?: [];

block_render('conteudo-texto', [
    'eyebrow'     => $group['eyebrow'] ?? '',
    'titulo'      => get_the_title(),
    'atualizadoEm' => $group['atualizado_em'] ?? '',
    'texto'       => acf_wysiwyg($group['texto'] ?? null),
]);
