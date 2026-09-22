<?php
defined('ABSPATH') || exit;

$hero = get_field('hero') ?: [];

block_render('ouvidoria-hero', [
    'eyebrow'        => $hero['eyebrow'] ?? '',
    'titulo'         => $hero['titulo'] ?? '',
    'descricao'      => $hero['descricao'] ?? '',
    'faleConoscoUrl' => acf_link($hero['fale_conosco_url'] ?? null, 'Fale Conosco'),
]);
