<?php
defined('ABSPATH') || exit;

$header = get_field('header', 'tema') ?: [];
// Redes sociais: campo pertence ao grupo "footer" no ACF, mas o mesmo repeater
// é reaproveitado aqui no topo do Header desktop (ver instructions do campo).
$footer = get_field('footer', 'tema') ?: [];
$locations = get_nav_menu_locations();
$menu_items = !empty($locations['header']) ? wp_get_nav_menu_items($locations['header']) : [];

$menu_by_parent = [];
foreach ($menu_items as $item) {
    $menu_by_parent[(int) $item->menu_item_parent][] = $item;
}

// _wp_menu_item_classes_by_context() (usada dentro de wp_nav_menu()) marca itens
// errados como current em CPTs sem página própria (ex: single de "carro" marcava
// "Notícias" via colisão de taxonomy ancestors). Calculamos "current" manualmente
// e de forma restrita em vez de confiar nessa função.
$is_menu_item_current = function ($item) {
    switch ($item->type) {
        case 'post_type_archive':
            // Cobre tanto o arquivo (ex: /estoque/) quanto o singular do mesmo post type
            // (ex: single de "carro" mantém "Estoque" ativo).
            return is_post_type_archive($item->object) || is_singular($item->object);

        case 'post_type':
            return is_singular() && (int) get_queried_object_id() === (int) $item->object_id;

        case 'taxonomy':
            return is_tax($item->object) && (int) get_queried_object_id() === (int) $item->object_id;

        default:
            $item_path = untrailingslashit((string) wp_parse_url($item->url, PHP_URL_PATH));
            $current_path = untrailingslashit((string) wp_parse_url(home_url($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH));
            return $item_path !== '' && $item_path === $current_path;
    }
};

$build_menu_item = function ($item) use (&$build_menu_item, $menu_by_parent, $is_menu_item_current) {
    $children = array_map($build_menu_item, $menu_by_parent[(int) $item->ID] ?? []);
    $current = $is_menu_item_current($item) || array_reduce($children, fn ($carry, $child) => $carry || $child['current'], false);

    return [
        'label'    => $item->title,
        'url'      => $item->url,
        'current'  => $current,
        'children' => $children,
    ];
};

block_render('header', [
    'logo'     => custom_logo_image(),
    'homeUrl'  => home_url('/'),
    'phone'    => $header['telefone'] ?? '',
    'whatsapp' => $header['whatsapp'] ?? '',
    // E-mail: campo pertence ao grupo "footer" no ACF, reaproveitado aqui no topo do Header desktop.
    'email'    => $footer['email'] ?? '',
    'cartUrl'  => acf_link($header['cart_url'] ?? null),
    'social'   => acf_repeater($footer['redes_sociais'] ?? null, fn($item) => [
        'network' => $item['rede'] ?? '',
        'url'     => $item['link'] ?? '',
    ]),
    'menu'     => array_map($build_menu_item, $menu_by_parent[0] ?? []),
]);
