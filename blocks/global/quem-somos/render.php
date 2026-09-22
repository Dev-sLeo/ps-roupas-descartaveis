<?php
defined('ABSPATH') || exit;

$group = get_field('quem_somos') ?: [];

block_render('quem-somos', [
    'eyebrow'        => $group['eyebrow'] ?? '',
    'titulo'         => $group['titulo'] ?? '',
    'descricao'      => acf_wysiwyg($group['descricao'] ?? ''),
    'badge1'         => $group['badge_1'] ?? '',
    'badge2'         => $group['badge_2'] ?? '',
    'botao'          => acf_link($group['botao'] ?? null),
    'imagem'         => acf_image($group['imagem'] ?? null),
    'videoTitulo'    => $group['video_titulo'] ?? '',
    'videoDescricao' => $group['video_descricao'] ?? '',
    'videoUrl'       => $group['video_url'] ?? '',
]);
