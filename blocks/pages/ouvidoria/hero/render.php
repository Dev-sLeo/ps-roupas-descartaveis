<?php
defined('ABSPATH') || exit;

$hero          = get_field('hero') ?: [];
$faleConoscoUrl = acf_link($hero['fale_conosco_url'] ?? null, 'Fale Conosco');

// Bloco compartilhado com Contato (blocks/global/hero-toggle) — mesmo
// componente React (HeroToggle), cada página monta seu próprio array `tabs`.
block_render('ouvidoria-hero', [
    'eyebrow'   => $hero['eyebrow'] ?? '',
    'titulo'    => $hero['titulo'] ?? '',
    'descricao' => $hero['descricao'] ?? '',
    'tabs'      => [
        ['label' => $faleConoscoUrl['label'] ?? 'Fale Conosco', 'href' => $faleConoscoUrl['url'] ?? ''],
        ['label' => 'Ouvidoria', 'active' => true],
    ],
    // Decorativos fixos do tema (não são campo ACF) — só aparecem no desktop.
    'patternLeft'  => THEME_URI . '/images/pattern-left-header-alternative.webp',
    'patternRight' => THEME_URI . '/images/pattern-right-header-alternative.webp',
]);
