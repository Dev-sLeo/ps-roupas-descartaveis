<?php
defined('ABSPATH') || exit;

$group = get_field('quem_somos') ?: [];

// Na página Quem Somos o card "Assista ao vídeo" fica empilhado abaixo da
// thumbnail (com fundo gradiente), em vez do overlay flutuante da Home.
$videoTeaserEmpilhado = is_page_template('page-quem-somos.php');

block_render('quem-somos', [
    'eyebrow'                => $group['eyebrow'] ?? '',
    'titulo'                 => $group['titulo'] ?? '',
    'descricao'              => acf_wysiwyg($group['descricao'] ?? ''),
    'badge1'                 => $group['badge_1'] ?? '',
    'badge2'                 => $group['badge_2'] ?? '',
    'botao'                  => acf_link($group['botao'] ?? null),
    'imagem'                 => acf_image($group['imagem'] ?? null),
    'videoTitulo'            => $group['video_titulo'] ?? '',
    'videoDescricao'         => $group['video_descricao'] ?? '',
    'videoUrl'               => $group['video_url'] ?? '',
    'videoTeaserEmpilhado'   => $videoTeaserEmpilhado,
]);
