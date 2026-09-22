<?php
defined('ABSPATH') || exit;

$hero = get_field('hero') ?: [];

block_render('home-hero', [
    'slides' => acf_repeater($hero['slides'] ?? null, fn($slide) => [
        'background'       => acf_image($slide['background'] ?? null),
        'backgroundMobile' => acf_image($slide['background_mobile'] ?? null),
        'titulo'           => $slide['titulo'] ?? '',
        'descricao'        => $slide['descricao'] ?? '',
        'cta1'             => acf_link($slide['cta_1'] ?? null),
        'cta2'             => acf_link($slide['cta_2'] ?? null),
    ]),
]);
