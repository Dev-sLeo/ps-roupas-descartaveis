<?php
defined('ABSPATH') || exit;

// ─── Preconnect para Google Fonts ─────────────────────────────────────────────
add_filter('wp_resource_hints', function (array $hints, string $relation_type): array {
    if ($relation_type === 'preconnect') {
        $hints[] = ['href' => 'https://fonts.googleapis.com'];
        $hints[] = ['href' => 'https://fonts.gstatic.com', 'crossorigin' => 'anonymous'];
    }
    return $hints;
}, 10, 2);

// ─── Inter — non-blocking (preload + onload trick) ────────────────────────────
add_action('wp_head', function (): void {
    $font_url = 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap';
?>
    <link rel="preload" href="<?php echo esc_url($font_url); ?>" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="<?php echo esc_url($font_url); ?>">
    </noscript>
<?php
}, 2);

// ─── Preload da imagem de fundo do hero (somente front page — LCP) ────────────
add_action('wp_head', function (): void {
    if (! is_front_page()) return;
    $hero = get_field('hero') ?: [];
    $bg   = $hero['background'] ?? null;
    if (! empty($bg['url'])) {
        echo '<link rel="preload" as="image" fetchpriority="high" href="' . esc_url($bg['url']) . '">' . "\n";
    }
}, 3);

/**
 * Enfileira os assets gerados pelo @wordpress/scripts na pasta /build.
 *
 * O arquivo index.asset.php é gerado automaticamente pelo build e contém
 * o hash de versão e as dependências exatas do bundle (ex: wp-element).
 */
add_action('wp_enqueue_scripts', function () {
    $asset_file = THEME_DIR . '/build/index.asset.php';

    if (! file_exists($asset_file)) {
        return;
    }

    $asset = require $asset_file;

    wp_enqueue_script(
        'theme-main',
        THEME_URI . '/build/index.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );

    wp_localize_script('theme-main', 'prosegAjax', [
        'url'   => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('proseg_ajax'),
    ]);

    if (file_exists(THEME_DIR . '/build/index.css')) {
        wp_enqueue_style(
            'theme-main',
            THEME_URI . '/build/index.css',
            [],
            $asset['version']
        );
    }
});

/**
 * Adia o carregamento dos scripts do Contact Form 7 (render-blocking),
 * já que o formulário fica abaixo da dobra em todas as páginas.
 */
add_filter('wp_enqueue_scripts', function () {
    if (wp_script_is('contact-form-7', 'registered')) {
        wp_script_add_data('contact-form-7', 'strategy', 'defer');
    }
    if (wp_script_is('swv', 'registered')) {
        wp_script_add_data('swv', 'strategy', 'defer');
    }
}, 20);

/**
 * Enfileira assets no editor de blocos (Gutenberg).
 * Garante que os blocos React também funcionem no contexto do editor.
 */
add_action('enqueue_block_editor_assets', function () {
    $asset_file = THEME_DIR . '/build/index.asset.php';

    if (! file_exists($asset_file)) {
        return;
    }

    $asset = require $asset_file;

    wp_enqueue_script(
        'theme-main-editor',
        THEME_URI . '/build/index.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );
});
