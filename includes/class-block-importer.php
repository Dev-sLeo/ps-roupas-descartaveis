<?php
defined('ABSPATH') || exit;

/**
 * BlockImporter
 *
 * Normaliza dados do ACF para o payload JSON dos blocos React.
 * Uso nos render.php: BlockImporter::image($field), BlockImporter::link($field), etc.
 */
class BlockImporter {

    /** Dados injetados via PageRenderer::block() para o próximo render.php. */
    private static ?array $override_data = null;

    // ─── Dados iniciais do bloco ──────────────────────────────────────────────

    /**
     * Injeta dados de override para o próximo render.php.
     * Chamado internamente por PageRenderer::block().
     */
    public static function setData(array $data): void {
        self::$override_data = $data;
    }

    /**
     * Retorna o array $data do bloco.
     * Prioridade: setData() → get_query_var('data') → []
     */
    public static function data(): array {
        if (self::$override_data !== null) {
            $data = self::$override_data;
            self::$override_data = null;
            return $data;
        }
        $data = get_query_var('data') ?: [];
        return is_array($data) ? $data : [];
    }

    /**
     * Resolve um campo: prefere o valor em $data (override de preview/teste),
     * senão busca do ACF. Suporta opções globais via $location (ex: 'option').
     *
     * @param string      $key      Nome do campo ACF
     * @param array       $data     Array $data do bloco
     * @param string|null $location Post ID, 'option', ou null para post atual
     */
    public static function field(string $key, array $data, ?string $location = null): mixed {
        if (array_key_exists($key, $data)) {
            return $data[$key];
        }
        return $location ? get_field($key, $location) : get_field($key);
    }

    // ─── Normalização de tipos ACF ────────────────────────────────────────────

    /**
     * Normaliza um campo ACF do tipo Image para o shape esperado pelo React.
     * Retorna null se o campo estiver vazio.
     *
     * @param mixed       $field         Valor bruto do campo ACF
     * @param int         $default_width  Largura padrão (px) quando não informada
     * @param int         $default_height Altura padrão (px) quando não informada
     */
    public static function image(mixed $field, int $default_width = 0, int $default_height = 0): ?array {
        if (empty($field['url'])) {
            return null;
        }

        $url       = (string) $field['url'];
        $mime_type = (string) ($field['mime_type'] ?? '');
        $result = [
            'url'     => $url,
            'alt'     => (string) ($field['alt']    ?? ''),
            'width'   => (int)    ($field['width']  ?? $default_width),
            'height'  => (int)    ($field['height'] ?? $default_height),
            'isVideo' => str_starts_with($mime_type, 'video/'),
        ];

        if (strtolower(pathinfo($url, PATHINFO_EXTENSION)) === 'svg') {
            $svg = self::readSvg($url);
            if ($svg !== null) {
                $result['svgContent'] = $svg;
            }
        }

        return $result;
    }

    /**
     * Lê um SVG do disco a partir da URL do upload, sanitiza e retorna o markup.
     *
     * Estratégia 1 (preferida): resolve via attachment ID → get_attached_file() retorna
     * o path absoluto real, sem risco de mapeamento errado em Windows ou CDN.
     * Estratégia 2 (fallback): str_replace de baseurl → basedir, para SVGs sem attachment
     * (ex: arquivos copiados manualmente para uploads/).
     *
     * Retorna null se o arquivo não existir, não for legível ou não for realmente um SVG.
     */
    private static function readSvg(string $url): ?string {
        $file_path = null;

        // Estratégia 1 — via attachment ID (mais confiável)
        $attachment_id = attachment_url_to_postid($url);
        if ($attachment_id) {
            $attached = get_attached_file($attachment_id);
            if ($attached && file_exists($attached)) {
                $file_path = $attached;
            }
        }

        // Estratégia 2 — mapeamento direto de URL para path
        if ($file_path === null) {
            $uploads      = wp_upload_dir();
            $mapped       = str_replace($uploads['baseurl'], $uploads['basedir'], $url);
            $mapped       = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $mapped);
            if (file_exists($mapped)) {
                $file_path = $mapped;
            }
        }

        if ($file_path === null || !is_readable($file_path)) {
            return null;
        }

        // Confirma que o arquivo é realmente um SVG pelo conteúdo, não só pela extensão
        $content = file_get_contents($file_path);
        if ($content === false || stripos($content, '<svg') === false) {
            return null;
        }

        return self::sanitizeSvg($content);
    }

    /**
     * Remove tags <script> e event handlers inline de um SVG para evitar XSS.
     */
    private static function sanitizeSvg(string $content): string {
        $content = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $content);
        $content = preg_replace('/\s+on\w+="[^"]*"/i', '', $content);
        $content = preg_replace('/\s+on\w+=\'[^\']*\'/i', '', $content);
        return trim($content);
    }

    /**
     * Normaliza um campo ACF do tipo Link/Button para o shape esperado pelo React.
     * Retorna null se o campo estiver vazio.
     *
     * @param mixed  $field         Valor bruto do campo ACF (array com title/url/target)
     * @param string $default_label Label fallback quando o campo não tem título
     */
    public static function link(mixed $field, string $default_label = ''): ?array {
        if (empty($field)) {
            return null;
        }
        $url = $field['url'] ?? '';
        if (empty($url)) {
            return null;
        }
        return [
            'label'  => (string) ($field['title']  ?? $field['label'] ?? $default_label),
            'url'    => (string) $url,
            'target' => (string) ($field['target'] ?? ''),
        ];
    }

    /**
     * Normaliza um campo ACF do tipo Repeater para um array de itens.
     * Aplica um callback de mapeamento opcional em cada item.
     *
     * @param mixed         $field    Valor bruto do campo ACF (array de arrays)
     * @param callable|null $map      Callback aplicado em cada item: fn(array $item): array
     */
    public static function repeater(mixed $field, ?callable $map = null): array {
        if (empty($field) || !is_array($field)) {
            return [];
        }
        if ($map === null) {
            return array_values($field);
        }
        return array_values(array_map($map, $field));
    }

    /**
     * Normaliza um campo ACF do tipo Group.
     * Retorna o grupo como array ou [] se vazio.
     *
     * @param mixed $field Valor bruto do campo ACF
     */
    public static function group(mixed $field): array {
        if (empty($field) || !is_array($field)) {
            return [];
        }
        return $field;
    }

    /**
     * Normaliza um campo ACF do tipo WYSIWYG (retorna HTML sanitizado).
     *
     * @param mixed $field Valor bruto do campo ACF
     */
    public static function wysiwyg(mixed $field): string {
        if (empty($field)) {
            return '';
        }
        return wp_kses_post((string) $field);
    }

    /**
     * Sanitiza um campo de texto que pode conter HTML inline (títulos, eyebrows, etc.).
     * Permite: strong, em, i, b, span, br, a — bloqueia scripts e atributos de evento.
     * Use no render.php quando o campo ACF puder conter tags de formatação.
     * No React, renderize o valor com htmlTitle() (dangerouslySetInnerHTML).
     *
     * @param mixed $field Valor bruto do campo ACF
     */
    public static function html(mixed $field): string {
        if (empty($field)) {
            return '';
        }
        return wp_kses((string) $field, [
            'strong' => [],
            'em'     => [],
            'i'      => [],
            'b'      => [],
            'u'      => [],
            'span'   => ['class' => [], 'style' => []],
            'br'     => [],
            'a'      => ['href' => [], 'target' => [], 'rel' => [], 'class' => []],
        ]);
    }

    // ─── Saída do bloco ───────────────────────────────────────────────────────

    /**
     * Serializa o payload e imprime o HTML âncora do bloco.
     * Equivale ao trecho final de todo render.php.
     *
     * @param string $block_name  Valor do atributo data-block (ex: 'home-hero')
     * @param array  $payload     Dados a serializar como JSON
     */
    public static function render(string $block_name, array $payload): void {
        $json = wp_json_encode($payload);
        echo '<div data-block="' . esc_attr($block_name) . '">';
        echo '<script type="application/json">' . $json . '</script>';
        echo '</div>';
    }
}
