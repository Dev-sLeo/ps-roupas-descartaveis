<?php
defined('ABSPATH') || exit;

$hero = get_field('hero') ?: [];

// A página Ouvidoria não é mais usada (ver blocks/pages/contato/ouvidoria) —
// as duas abas agora trocam conteúdo NA MESMA página via evento `contato:tab`
// (ver src/blocks/global/HeroToggle), em vez de navegar pra /ouvidoria/.
block_render('contato-hero', [
    'eyebrow'   => $hero['eyebrow'] ?? '',
    'titulo'    => $hero['titulo'] ?? '',
    'descricao' => $hero['descricao'] ?? '',
    'tabs'      => [
        ['key' => 'fale-conosco', 'label' => 'Fale Conosco', 'active' => true],
        ['key' => 'ouvidoria', 'label' => 'Ouvidoria'],
    ],
    'tabEvent' => 'contato:tab',
    // Decorativos fixos do tema (não são campo ACF) — só aparecem no desktop.
    'patternLeft'  => THEME_URI . '/images/pattern-left-header-alternative.webp',
    'patternRight' => THEME_URI . '/images/pattern-right-header-alternative.webp',
]);
