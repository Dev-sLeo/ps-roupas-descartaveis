<?php
defined('ABSPATH') || exit;

/**
 * Atalhos procedurais para BlockImporter.
 * Importe em functions.php e use diretamente nos render.php.
 */

/**
 * Normaliza campo ACF do tipo Image.
 *
 * @param mixed $field          Valor bruto do ACF
 * @param int   $default_width  Largura padrão em px
 * @param int   $default_height Altura padrão em px
 */
function acf_image(mixed $field, int $default_width = 0, int $default_height = 0): ?array {
    return BlockImporter::image($field, $default_width, $default_height);
}

/**
 * Normaliza campo ACF do tipo Link/Button.
 *
 * @param mixed  $field         Valor bruto do ACF
 * @param string $default_label Label fallback
 */
function acf_link(mixed $field, string $default_label = ''): ?array {
    return BlockImporter::link($field, $default_label);
}

/**
 * Normaliza campo ACF do tipo Repeater.
 *
 * @param mixed         $field Valor bruto do ACF
 * @param callable|null $map   Callback de mapeamento por item
 */
function acf_repeater(mixed $field, ?callable $map = null): array {
    return BlockImporter::repeater($field, $map);
}

/**
 * Normaliza campo ACF do tipo Group.
 *
 * @param mixed $field Valor bruto do ACF
 */
function acf_group(mixed $field): array {
    return BlockImporter::group($field);
}

/**
 * Normaliza campo ACF do tipo WYSIWYG (retorna HTML sanitizado).
 *
 * @param mixed $field Valor bruto do ACF
 */
function acf_wysiwyg(mixed $field): string {
    return BlockImporter::wysiwyg($field);
}

/**
 * Sanitiza um campo de texto com HTML inline permitido (strong, em, span, br, a).
 * Use para títulos e eyebrows que precisam de formatação no painel.
 * No React, renderize com htmlTitle() (dangerouslySetInnerHTML).
 *
 * @param mixed $field Valor bruto do ACF
 */
function acf_html(mixed $field): string {
    return BlockImporter::html($field);
}

/**
 * Retorna o array $data do bloco (override de preview/teste via context).
 */
function block_data(): array {
    return BlockImporter::data();
}

/**
 * Serializa o payload e imprime o HTML âncora do bloco.
 *
 * @param string $block_name Valor do atributo data-block
 * @param array  $payload    Dados a serializar
 */
function block_render(string $block_name, array $payload): void {
    BlockImporter::render($block_name, $payload);
}

/**
 * Trunca um texto em um limite de caracteres, respeitando palavras inteiras.
 */
function trim_chars(string $text, int $length): string {
    if (mb_strlen($text) <= $length) {
        return $text;
    }

    $trimmed = mb_substr($text, 0, $length);
    $trimmed = mb_substr($trimmed, 0, mb_strrpos($trimmed, ' ') ?: $length);

    return rtrim($trimmed, " \t\n\r\0\x0B.,;:") . '…';
}

/**
 * Normaliza o logo do site (Aparência → Personalizar → Identidade, custom-logo)
 * para o shape esperado pelo React (mesmo formato de acf_image()).
 * Retorna null se nenhum logo estiver definido.
 */
function custom_logo_image(): ?array {
    $attachment_id = get_theme_mod('custom_logo');

    if (!$attachment_id) {
        return null;
    }

    $src = wp_get_attachment_image_src($attachment_id, 'full');

    if (!$src) {
        return null;
    }

    return [
        'url'    => $src[0],
        'alt'    => get_post_meta($attachment_id, '_wp_attachment_image_alt', true) ?: get_bloginfo('name'),
        'width'  => (int) $src[1],
        'height' => (int) $src[2],
    ];
}

/**
 * Normaliza um WP_Post (do Blog) para o shape de card usado pelos blocos React.
 *
 * @param WP_Post $post           Post do WordPress
 * @param int     $excerpt_length Limite de caracteres do excerpt (0 = sem limite)
 */
function blog_post_card(WP_Post $post, int $excerpt_length = 0): array {
    $categorias = get_the_category($post->ID);
    $thumb_id   = get_post_thumbnail_id($post);
    $excerpt    = wp_strip_all_tags(get_the_excerpt($post));

    if ($excerpt_length > 0) {
        $excerpt = trim_chars($excerpt, $excerpt_length);
    }

    return [
        'titulo'    => get_the_title($post),
        'excerpt'   => $excerpt,
        'categoria' => $categorias ? $categorias[0]->name : '',
        'url'       => get_permalink($post),
        'imagem'    => $thumb_id ? [
            'url' => wp_get_attachment_image_url($thumb_id, 'large'),
            'alt' => get_post_meta($thumb_id, '_wp_attachment_image_alt', true) ?: get_the_title($post),
        ] : null,
    ];
}

/**
 * Normaliza um WC_Product (WooCommerce) para o shape de card usado pelos blocos React.
 *
 * @param WC_Product $product Produto do WooCommerce
 */
function wc_product_card(WC_Product $product): array {
    $image_id = $product->get_image_id();
    $src      = $image_id ? wp_get_attachment_image_src($image_id, 'large') : false;

    return [
        'id'     => $product->get_id(),
        'nome'   => $product->get_name(),
        'url'    => get_permalink($product->get_id()),
        'imagem' => $src ? [
            'url'    => $src[0],
            'alt'    => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: $product->get_name(),
            'width'  => (int) $src[1],
            'height' => (int) $src[2],
        ] : null,
    ];
}

/**
 * Normaliza um WP_Term de categoria de produto (WooCommerce) para o shape de
 * card usado pelos blocos React (mesmo shape de wc_product_card).
 *
 * @param WP_Term $term Termo da taxonomia product_cat
 */
function wc_category_card(WP_Term $term): array {
    $image_id = get_term_meta($term->term_id, 'thumbnail_id', true);
    $src      = $image_id ? wp_get_attachment_image_src((int) $image_id, 'large') : false;

    return [
        'id'     => $term->term_id,
        'nome'   => $term->name,
        'url'    => get_term_link($term),
        'imagem' => $src ? [
            'url'    => $src[0],
            'alt'    => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: $term->name,
            'width'  => (int) $src[1],
            'height' => (int) $src[2],
        ] : null,
    ];
}

/**
 * Monta o `tax_query` do arquivo de produtos a partir do valor bruto da
 * query var `produto_categoria` (slugs separados por vírgula).
 * Usado tanto pelo `pre_get_posts` (query principal) quanto pelo handler AJAX
 * (includes/ajax.php) — mesma lógica dos dois lados pra sempre bater.
 *
 * "Em destaque" não filtra mais pela taxonomia `product_visibility` (destaque
 * manual do WooCommerce) — os "produtos em destaque" do catálogo são os
 * últimos adicionados, então não precisam de tax_query própria: já é o
 * `orderby: date DESC` padrão de `proseg_produtos_query()`.
 *
 * @param array{produto_categoria?: mixed} $vars
 */
function proseg_produtos_tax_query(array $vars): array {
    $tax_query = [];

    $categorias = array_filter(array_map('sanitize_title', explode(',', (string) ($vars['produto_categoria'] ?? ''))));
    if ($categorias) {
        $tax_query[] = [
            'taxonomy' => 'product_cat',
            'field'    => 'slug',
            'terms'    => array_values($categorias),
        ];
    }

    return $tax_query;
}

/**
 * Lê e sanitiza os filtros do arquivo de produtos a partir de um array bruto
 * (normalmente $_GET) — usado pelo AJAX (includes/ajax.php), que não passa
 * pelo `pre_get_posts`/query vars do WP.
 *
 * @param array $get Array bruto (ex: $_GET)
 */
function proseg_produtos_filtros(array $get): array {
    return [
        'categoria' => sanitize_text_field((string) ($get['produto_categoria'] ?? '')),
        'busca'     => sanitize_text_field((string) ($get['produto_busca'] ?? '')),
        'destaque'  => !empty($get['produto_destaque']),
        'pagina'    => max(1, (int) ($get['paged'] ?? 1)),
    ];
}

/**
 * Roda a query do arquivo de produtos com os filtros já sanitizados
 * (ver proseg_produtos_filtros()) e devolve o payload pronto pro React
 * (produtos[] + paginacao[]) — mesmo shape usado no SSR e na resposta AJAX.
 *
 * "Em destaque" (`$filtros['destaque']`) não filtra a query — os produtos em
 * destaque são os últimos adicionados, e `orderby: date DESC` já traz isso
 * por padrão. O valor só volta no payload pra manter o checkbox marcado na UI.
 *
 * @param array{categoria: string, busca: string, destaque: bool, pagina: int} $filtros
 */
function proseg_produtos_query(array $filtros): array {
    $query = new WP_Query([
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => 9,
        'paged'          => $filtros['pagina'],
        's'              => $filtros['busca'],
        'orderby'        => 'date',
        'order'          => 'DESC',
        'tax_query'      => proseg_produtos_tax_query([
            'produto_categoria' => $filtros['categoria'],
        ]),
    ]);

    $produtos = array_map(
        fn(WP_Post $post) => wc_product_card(wc_get_product($post)),
        $query->posts
    );

    $paginacao = [];
    for ($i = 1; $i <= (int) $query->max_num_pages; $i++) {
        $paginacao[] = ['numero' => $i, 'ativa' => $i === $filtros['pagina']];
    }

    wp_reset_postdata();

    return ['produtos' => $produtos, 'paginacao' => $paginacao, 'total' => (int) $query->found_posts];
}

/**
 * Lê e sanitiza os filtros do blog a partir de um array bruto (normalmente
 * $_GET) — usado pelo AJAX (includes/ajax.php) e pelo `render.php` do bloco
 * de listagem, mesmo padrão de proseg_produtos_filtros().
 *
 * @param array $get Array bruto (ex: $_GET)
 */
function proseg_blog_filtros(array $get): array {
    return [
        'categoria' => sanitize_title((string) ($get['blog_categoria'] ?? '')),
        'busca'     => sanitize_text_field((string) ($get['s'] ?? '')),
        'pagina'    => max(1, (int) ($get['paged'] ?? 1)),
    ];
}

/**
 * Roda a query do blog (Posts Page + busca) com os filtros já sanitizados
 * (ver proseg_blog_filtros()) e devolve o payload pronto pro React
 * (posts[] + paginacao[]) — mesmo shape usado no SSR e na resposta AJAX.
 *
 * @param array{categoria: string, busca: string, pagina: int} $filtros
 */
function proseg_blog_query(array $filtros): array {
    $args = [
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => 9,
        'paged'          => $filtros['pagina'],
        's'              => $filtros['busca'],
    ];

    if ($filtros['categoria'] !== '') {
        $args['category_name'] = $filtros['categoria'];
    }

    $query = new WP_Query($args);

    $posts = array_map(
        fn(WP_Post $post) => blog_post_card($post, 90),
        $query->posts
    );

    $paginacao = [];
    for ($i = 1; $i <= (int) $query->max_num_pages; $i++) {
        $paginacao[] = ['numero' => $i, 'ativa' => $i === $filtros['pagina']];
    }

    wp_reset_postdata();

    return ['posts' => $posts, 'paginacao' => $paginacao, 'total' => (int) $query->found_posts];
}

/**
 * Monta um link wa.me com número e mensagem pré-preenchida.
 * Assume Brasil (+55) quando o telefone não tem código de país.
 *
 * @param string $phone   Telefone bruto (com ou sem máscara)
 * @param string $message Mensagem pré-preenchida (opcional)
 */
function whatsapp_url(string $phone, string $message = ''): string {
    $digits = preg_replace('/\D/', '', $phone) ?? '';

    if (!$digits) {
        return '';
    }

    $url = 'https://wa.me/55' . $digits;

    if ($message !== '') {
        $url .= '?text=' . rawurlencode($message);
    }

    return $url;
}
