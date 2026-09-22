<?php
defined('ABSPATH') || exit;

$hero = get_field('hero') ?: [];

block_render('trabalhe-conosco-hero', [
    'eyebrow'   => $hero['eyebrow'] ?? '',
    'titulo'    => $hero['titulo'] ?? '',
    'descricao' => $hero['descricao'] ?? '',
    'cta1'      => acf_link($hero['cta_1'] ?? null),
    'cta2'      => acf_link($hero['cta_2'] ?? null),
    // Decorativos fixos do tema (não são campo ACF) — mesma base visual de Contato/Ouvidoria, só aparecem no desktop.
    'patternLeft'  => THEME_URI . '/images/pattern-left-header-alternative.webp',
    'patternRight' => THEME_URI . '/images/pattern-right-header-alternative.webp',
]);
