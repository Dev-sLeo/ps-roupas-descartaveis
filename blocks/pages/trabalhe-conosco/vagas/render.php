<?php
defined('ABSPATH') || exit;

$group = get_field('vagas_secao') ?: [];

block_render('trabalhe-conosco-vagas', [
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    'vagas'     => acf_repeater($group['vagas'] ?? null, fn($item) => [
        'titulo'    => $item['titulo'] ?? '',
        'descricao' => $item['descricao'] ?? '',
        // Sem link cadastrado: aponta pra âncora do formulário de candidatura.
        'link'      => acf_link($item['link'] ?? null) ?: [
            'label'  => 'Candidatar a vaga',
            'url'    => '#candidatura',
            'target' => '',
        ],
    ]),
]);
