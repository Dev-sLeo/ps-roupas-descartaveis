<?php
defined('ABSPATH') || exit;

add_action('after_setup_theme', function () {
    add_theme_support('custom-logo', [
        'height'      => 40,
        'width'       => 171,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['script', 'style', 'gallery', 'caption']);
    add_theme_support('editor-styles');
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    load_theme_textdomain('theme', THEME_DIR . '/languages');

    register_nav_menus(array(
        'header' => 'Header',
        'footer' => 'Footer',
        'mobile' => 'Mobile',
    ));
});

// ACF Local JSON — define pasta de leitura e escrita dos field groups
if (function_exists('acf_add_local_json_folder')) {
    // Load: ACF lê os JSONs desta pasta ao inicializar
    add_filter('acf/settings/load_json', function (array $paths): array {
        $paths[] = THEME_DIR . '/acf-json';
        return $paths;
    });

    // Save: ao salvar/exportar um grupo no painel, o arquivo vai para esta pasta
    add_filter('acf/settings/save_json', function (): string {
        return THEME_DIR . '/acf-json';
    });

    // Popula os selects "Menu do rodapé 1/2" (footer.menu / footer.menu_2) com os menus cadastrados em Aparência → Menus
    $populate_menu_choices = function (array $field): array {
        $field['choices'] = [];
        foreach (wp_get_nav_menus() as $menu) {
            $field['choices'][$menu->term_id] = $menu->name;
        }
        return $field;
    };
    add_filter('acf/load_field/key=field_7a1000000031', $populate_menu_choices);
    add_filter('acf/load_field/key=field_7a1000000034', $populate_menu_choices);
}

add_filter('wpcf7_autop_or_not', '__return_false');

// Blog (posts page): 9 posts por página (grid 3x3) e filtro por categoria via
// querystring `?blog_categoria=slug` — em vez do arquivo de categoria do WP
// (category.php), pra manter o filtro na mesma página/layout do blog.
add_filter('query_vars', function (array $vars): array {
    $vars[] = 'blog_categoria';
    return $vars;
});

add_action('pre_get_posts', function (WP_Query $query): void {
    if (is_admin() || !$query->is_main_query()) {
        return;
    }

    if (!$query->is_home() && !$query->is_search()) {
        return;
    }

    $query->set('posts_per_page', 9);

    $categoria = sanitize_title($query->get('blog_categoria'));
    if ($categoria !== '') {
        $query->set('category_name', $categoria);
    }
});

// Arquivo de produtos (WooCommerce): filtro por categoria (multi, via checkbox)
// + busca, ambos via querystring (?produto_categoria=slug1,slug2&produto_busca=x)
// — em vez de navegar pra archive de taxonomia (product_cat), fica tudo na
// mesma página/layout do arquivo. AJAX (includes/ajax.php) usa os mesmos nomes
// de query var pra montar a query idêntica sem recarregar a página.
add_filter('query_vars', function (array $vars): array {
    $vars[] = 'produto_categoria';
    $vars[] = 'produto_busca';
    $vars[] = 'produto_destaque';
    return $vars;
});

add_action('pre_get_posts', function (WP_Query $query): void {
    if (is_admin() || !$query->is_main_query()) {
        return;
    }

    if (!$query->is_post_type_archive('product')) {
        return;
    }

    $query->set('posts_per_page', 9);
    $query->set('tax_query', proseg_produtos_tax_query([
        'produto_categoria' => $query->get('produto_categoria'),
        'produto_destaque'  => $query->get('produto_destaque'),
    ]));

    $busca = sanitize_text_field((string) $query->get('produto_busca'));
    if ($busca !== '') {
        $query->set('s', $busca);
    }
});
