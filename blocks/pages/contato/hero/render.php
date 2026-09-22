<?php
defined('ABSPATH') || exit;

$hero         = get_field('hero') ?: [];
$ouvidoriaUrl = acf_link($hero['ouvidoria_url'] ?? null, 'Ouvidoria');

// Bloco compartilhado com Ouvidoria (blocks/global/hero-toggle) — mesmo
// componente React (HeroToggle), cada página monta seu próprio array `tabs`.
block_render('contato-hero', [
    'eyebrow'   => $hero['eyebrow'] ?? '',
    'titulo'    => $hero['titulo'] ?? '',
    'descricao' => $hero['descricao'] ?? '',
    'tabs'      => [
        ['label' => 'Fale Conosco', 'active' => true],
        ['label' => $ouvidoriaUrl['label'] ?? 'Ouvidoria', 'href' => $ouvidoriaUrl['url'] ?? ''],
    ],
    // Decorativos fixos do tema (não são campo ACF) — só aparecem no desktop.
    'patternLeft'  => THEME_URI . '/images/pattern-left-header-alternative.webp',
    'patternRight' => THEME_URI . '/images/pattern-right-header-alternative.webp',
]);
