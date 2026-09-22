<?php
defined('ABSPATH') || exit;

$footer    = get_field('footer', 'tema') ?: [];
$locations = get_nav_menu_locations();

$build_menu = function (int $menu_id) {
    $items = $menu_id ? wp_get_nav_menu_items($menu_id) : [];
    return acf_repeater($items ?: [], fn($item) => [
        'label' => $item->title,
        'url'   => $item->url,
    ]);
};

$menu_1_id = !empty($footer['menu']) ? (int) $footer['menu'] : ($locations['footer'] ?? 0);
$menu_2_id = !empty($footer['menu_2']) ? (int) $footer['menu_2'] : 0;

block_render('footer', [
    'logo'            => acf_image($footer['logo'] ?? null) ?: custom_logo_image(),
    'homeUrl'         => home_url('/'),
    'menu'            => $build_menu($menu_1_id),
    'menu2'           => $build_menu($menu_2_id),
    'phone'           => $footer['telefone'] ?? '',
    'whatsapp'        => $footer['whatsapp'] ?? '',
    'email'           => $footer['email'] ?? '',
    'social'          => acf_repeater($footer['redes_sociais'] ?? null, fn($item) => [
        'network' => $item['rede'] ?? '',
        'url'     => $item['link'] ?? '',
    ]),
    'copy'            => $footer['copy'] ?? '',
    'privacyLink'     => acf_link($footer['link_privacidade'] ?? null, 'Política de privacidade'),
    'agencyUrl'       => $footer['upsites_url'] ?? 'https://upsites.digital',
]);
