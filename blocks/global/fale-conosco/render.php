<?php
defined('ABSPATH') || exit;

// Global por padrão — dados vêm da options page "Tema" (aba "Fale conosco").
// Uma página pode sobrescrever o conteúdo passando dados como 2º argumento de
// partial('fale-conosco', [...]) — útil quando a página precisa do mesmo
// padrão visual (fundo $color-accent + 2 CTAs) com copy própria (ex: Contato).
$data  = block_data();
$group = get_field('fale_conosco', 'tema') ?: [];

block_render('fale-conosco', [
    'eyebrow'     => $data['eyebrow']   ?? $group['eyebrow']   ?? '',
    'titulo'      => $data['titulo']    ?? $group['titulo']    ?? '',
    'descricao'   => $data['descricao'] ?? $group['descricao'] ?? '',
    'cta1'        => array_key_exists('cta1', $data) ? $data['cta1'] : acf_link($group['cta_1'] ?? null),
    'cta2'        => array_key_exists('cta2', $data) ? $data['cta2'] : acf_link($group['cta_2'] ?? null),
    // Decorativos fixos do tema (não são campo ACF) — só aparecem no desktop.
    'patternLeft'  => THEME_URI . '/images/pattern-left-faleconosco.webp',
    'patternRight' => THEME_URI . '/images/pattern-right-faleconosco.webp',
]);
