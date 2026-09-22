<?php
defined('ABSPATH') || exit;

$contato = get_field('contato') ?: [];

block_render('ouvidoria-contato', [
    'titulo'    => $contato['titulo'] ?? '',
    'descricao' => $contato['descricao'] ?? '',
    'telefone'  => $contato['telefone'] ?? '',
    'whatsapp'  => $contato['whatsapp'] ?? '',
    'email'     => $contato['email'] ?? '',
    'horario'   => $contato['horario'] ?? '',
]);
