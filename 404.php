<?php
defined('ABSPATH') || exit;
get_header();
?>

<main class="not-found">
    <div class="not-found__inner">
        <span class="not-found__code" aria-hidden="true">404</span>

        <h1 class="not-found__title">Página não encontrada</h1>

        <p class="not-found__description">
            O endereço que você acessou não existe ou foi movido.<br>
            Volte para o início e continue navegando.
        </p>

        <a href="<?php echo esc_url(home_url('/')); ?>" class="not-found__btn">
            Voltar para home
        </a>
    </div>
</main>

<?php get_footer(); ?>
