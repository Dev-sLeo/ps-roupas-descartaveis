<?php
defined('ABSPATH') || exit;

/**
 * Tpl — motor de templates do tema.
 *
 * Uso básico (instância global $tpl criada em functions.php):
 *
 *   global $tpl;
 *   $tpl->partial('pages/home/hero');
 *   $tpl->partial('global/text-image', ['title' => 'Custom']);
 *
 * Instância com base configurada (evita repetir o prefixo):
 *
 *   $home = $tpl->scope('pages/home');
 *   $home->partial('hero')
 *        ->partial('faixa')
 *        ->partial('solucoes');
 *
 * Wrapper de página:
 *
 *   $tpl->wrap('page-home', function ($t) {
 *       $home = $t->scope('pages/home');
 *       $home->partial('hero')
 *            ->partial('faixa');
 *       $t->scope('global')->partial('text-image');
 *       $home->partial('solucoes');
 *   });
 *
 * Slug: caminho relativo à base (padrão: blocks/).
 *   'pages/home/hero'   → blocks/pages/home/hero/render.php
 *   'global/text-image' → blocks/global/text-image/render.php
 */
class Tpl {

    public function __construct(private string $base = 'blocks') {}

    /**
     * Renderiza um partial pelo slug.
     * Retorna $this para encadeamento: ->partial('a')->partial('b').
     *
     * @param string $name  Slug relativo à base (ex: 'pages/home/hero')
     * @param array  $data  Override de dados — acessível via BlockImporter::data()
     */
    public function partial(string $name, array $data = []): static {
        $path = THEME_DIR . '/' . trim($this->base, '/') . '/' . trim($name, '/') . '/render.php';

        if (!file_exists($path)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_trigger_error
                trigger_error(sprintf('Tpl: partial "%s" não encontrado (%s)', $name, $path), E_USER_WARNING);
            }
            return $this;
        }

        if (!empty($data)) {
            BlockImporter::setData($data);
        }

        include $path;

        return $this;
    }

    /**
     * Retorna uma nova instância com a base estendida pelo subpath.
     * Permite usar nomes curtos nos parciais:
     *   $tpl->scope('pages/home')->partial('hero')
     *
     * @param string $subpath  Caminho a concatenar na base atual
     */
    public function scope(string $subpath): static {
        return new static(trim($this->base, '/') . '/' . trim($subpath, '/'));
    }

    /**
     * Envolve um grupo de parciais num <div class="{class}">.
     * O callback recebe $this como argumento.
     *
     * @param string   $class  Classe CSS do wrapper
     * @param callable $fn     fn(Tpl $t): void
     */
    public function wrap(string $class, callable $fn): void {
        echo '<div class="' . esc_attr($class) . '">';
        $fn($this);
        echo '</div>';
    }
}
