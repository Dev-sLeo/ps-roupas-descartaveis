<?php
defined('ABSPATH') || exit;

$hero = get_field('hero') ?: [];

block_render('hero-estatico', [
    'background'       => acf_image($hero['background'] ?? null),
    'backgroundMobile' => acf_image($hero['background_mobile'] ?? null),
    'eyebrow'          => $hero['eyebrow'] ?? '',
    'titulo'           => $hero['titulo'] ?? '',
    'descricao'        => $hero['descricao'] ?? '',
    'cta1'             => acf_link($hero['cta_1'] ?? null),
    'cta2'             => acf_link($hero['cta_2'] ?? null),
]);
