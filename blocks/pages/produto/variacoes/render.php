<?php
defined('ABSPATH') || exit;

global $product;

if (!$product instanceof WC_Product || !$product->is_type('variable')) {
    return;
}

$footer       = get_field('footer', 'tema') ?: [];
$whatsapp     = $footer['whatsapp'] ?? '';
$whatsappHref = $whatsapp !== ''
    ? whatsapp_url($whatsapp, sprintf('Olá! Tenho interesse no produto "%s".', get_the_title()))
    : '';

$pecasPorPacote = (int) (get_field('pecas_por_pacote', $product->get_id()) ?: 0);

// Paleta de fallback pra atributos de cor sem hex explícito no valor — convenção
// pro cadastro (aba Atributos do produto): "Nome : #hex" (ex: "Azul : #9AD3D5").
// Sem o hex, cai numa cor aproximada pelo nome; sem bater no dicionário, cinza neutro.
$colorFallback = [
    'azul'     => '#2F80ED',
    'verde'    => '#27AE60',
    'cinza'    => '#BDBDBD',
    'preto'    => '#111111',
    'branco'   => '#FFFFFF',
    'laranja'  => '#F36911',
    'amarelo'  => '#F2C94C',
    'vermelho' => '#EB5757',
    'rosa'     => '#F2A0C7',
    'roxo'     => '#9B51E0',
    'marrom'   => '#795548',
    'bege'     => '#E8DCC8',
];

$attributes = [];

// `get_variation_attributes()` é indexado pelo NOME de exibição do atributo
// (não pelo array de `get_attributes()`, que é uma lista sequencial 0,1,2...
// sem chave por nome) — pra atributos customizados a própria chave já é o
// label certo; só os de taxonomia (pa_*) precisam de `wc_attribute_label()`.
foreach ($product->get_variation_attributes() as $rawName => $options) {
    $isTaxonomy = strpos($rawName, 'pa_') === 0;
    $label      = $isTaxonomy ? wc_attribute_label($rawName) : $rawName;
    $isCores    = sanitize_title($label) === 'cores';

    $items = [];
    foreach ($options as $option) {
        $optLabel = $isTaxonomy ? (get_term_by('slug', $option, $rawName)->name ?? $option) : $option;
        $hex      = null;

        if ($isCores) {
            if (preg_match('/^(.*?)\s*:\s*(#[0-9a-fA-F]{3,6})\s*$/', $optLabel, $m)) {
                $optLabel = trim($m[1]);
                $hex      = $m[2];
            } else {
                $hex = $colorFallback[sanitize_title($optLabel)] ?? '#CCCCCC';
            }
        }

        $items[] = [
            'value' => $option,
            'label' => $optLabel,
            'hex'   => $hex,
        ];
    }

    $attributes[] = [
        'key'     => 'attribute_' . sanitize_title($rawName),
        'label'   => $label,
        'isCores' => $isCores,
        'options' => $items,
    ];
}

$variations = [];
foreach ($product->get_available_variations() as $variation) {
    $variations[] = [
        'id'         => $variation['variation_id'],
        'attributes' => $variation['attributes'],
        'priceHtml'  => $variation['price_html'],
        'inStock'    => (bool) $variation['is_in_stock'],
    ];
}

block_render('produto-variacoes', [
    'productId'      => $product->get_id(),
    'attributes'     => $attributes,
    'variations'     => $variations,
    'pecasPorPacote' => $pecasPorPacote,
    'ctaLabel'       => apply_filters('woocommerce_product_single_add_to_cart_text', __('Add to cart', 'woocommerce'), $product),
    'whatsappHref'   => $whatsappHref,
]);
