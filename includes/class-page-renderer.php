<?php
defined('ABSPATH') || exit;

/**
 * PageRenderer
 *
 * Renderiza blocos sem usar include manual. Substitui todos os
 * include .../render.php nos orquestradores de página.
 *
 * Uso básico:
 *   PageRenderer::block('pages/home/hero');
 *   PageRenderer::block('global/text-image', ['title' => 'Título customizado']);
 *
 * Uso com página completa:
 *   PageRenderer::page('home', [
 *       'pages/home/hero',
 *       'pages/home/faixa',
 *       'global/text-image',
 *       'pages/home/solucoes',
 *   ]);
 *
 * Slug: caminho relativo a blocks/ sem a barra inicial nem /render.php.
 *   'pages/home/hero'    → blocks/pages/home/hero/render.php
 *   'global/text-image'  → blocks/global/text-image/render.php
 */
class PageRenderer {

    /**
     * Renderiza um único bloco pelo slug.
     *
     * @param string $slug  Caminho relativo a blocks/ (ex: 'pages/home/hero')
     * @param array  $data  Dados de override — disponíveis via BlockImporter::data()
     *                      no render.php, com prioridade sobre os campos ACF.
     */
    public static function block(string $slug, array $data = []): void {
        $path = THEME_DIR . '/blocks/' . ltrim($slug, '/') . '/render.php';

        if (!file_exists($path)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_trigger_error
                trigger_error(
                    sprintf('PageRenderer: render.php não encontrado para o slug "%s" (%s)', $slug, $path),
                    E_USER_WARNING
                );
            }
            return;
        }

        if (!empty($data)) {
            BlockImporter::setData($data);
        }

        include $path;
    }

    /**
     * Renderiza uma lista de blocos dentro de um <div class="page-{name}">.
     *
     * Cada entrada do array $blocks pode ser:
     *   - string:        'pages/home/hero'                 (sem override)
     *   - slug => array: 'global/text-image' => ['title' => 'Custom'] (com override)
     *
     * @param string $name   Nome da página — vira classe CSS "page-{name}"
     * @param array  $blocks Lista de slugs ou pares slug => data
     */
    public static function page(string $name, array $blocks): void {
        echo '<div class="page-' . esc_attr($name) . '">';
        foreach ($blocks as $slug => $value) {
            if (is_int($slug)) {
                self::block($value);
            } else {
                self::block($slug, (array) $value);
            }
        }
        echo '</div>';
    }
}
