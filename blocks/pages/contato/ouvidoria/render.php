<?php
defined('ABSPATH') || exit;

$group     = get_field('ouvidoria_secao') ?: [];
$footer    = get_field('footer', 'tema') ?: [];
$formulario = get_field('formulario_secao') ?: [];

// Conteúdo da aba "Ouvidoria" do switcher do hero (ver blocks/pages/contato/hero
// e src/blocks/global/HeroToggle) — mostrado/escondido via JS (evento
// `contato:tab`), não é mais uma página separada. Telefone/whatsapp/e-mail vêm
// do rodapé (mesma fonte da aba "Fale Conosco") e horário reaproveita o campo
// já existente na aba "Formulário" — sem duplicar contato.
block_render('contato-ouvidoria', [
    'titulo'    => $group['titulo'] ?? '',
    'descricao' => $group['descricao'] ?? '',
    'telefone'  => $footer['telefone'] ?? '',
    'whatsapp'  => $footer['whatsapp'] ?? '',
    'email'     => $footer['email'] ?? '',
    'horario'   => $formulario['horario'] ?? '',
]);
