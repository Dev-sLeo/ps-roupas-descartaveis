<?php
defined('ABSPATH') || exit;

if (!function_exists('WC') || !WC()->cart) {
    return;
}

$itens = [];

foreach (WC()->cart->get_cart() as $key => $item) {
    $product = $item['data'];
    if (!$product instanceof WC_Product) {
        continue;
    }

    // `get_image_id()` de uma variação já cai pra imagem do produto pai
    // automaticamente quando a variação não tem imagem própria (nativo do WC).
    $imageId = $product->get_image_id();
    $src     = $imageId ? wp_get_attachment_image_src($imageId, 'thumbnail') : false;

    // Campo `pecas_por_pacote` (ACF) mora no post do produto PAI — variação
    // não tem esse campo (location do field group é `post_type == product`).
    $productIdParaCampos = $product->is_type('variation') ? $product->get_parent_id() : $product->get_id();
    $pecasPorPacote       = (int) (get_field('pecas_por_pacote', $productIdParaCampos) ?: 0);

    $variacaoPartes = [];
    foreach ($item['variation'] ?? [] as $attrKey => $value) {
        if ($value === '') {
            continue;
        }

        $taxonomy = str_replace('attribute_', '', $attrKey);
        $label    = strpos($taxonomy, 'pa_') === 0 ? wc_attribute_label($taxonomy) : ucfirst($taxonomy);

        // Valor de "Cores" pode vir como "Azul : #9AD3D5" (convenção do
        // cadastro em Atributos) — mantém só o nome legível aqui.
        if (preg_match('/^(.*?)\s*:\s*#[0-9a-fA-F]{3,6}\s*$/', $value, $m)) {
            $value = trim($m[1]);
        }

        $variacaoPartes[] = $label . ': ' . $value;
    }

    $itens[] = [
        'key'            => $key,
        'nome'           => $product->get_name(),
        'variacaoTexto'  => implode(', ', $variacaoPartes),
        'imagem'         => $src ? ['url' => $src[0], 'alt' => $product->get_name()] : null,
        'quantidade'     => (int) $item['quantity'],
        'pecasPorPacote' => $pecasPorPacote,
    ];
}

block_render('carrinho-itens', [
    'itens' => $itens,
]);
