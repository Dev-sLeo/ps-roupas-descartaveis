<?php
defined('ABSPATH') || exit;

/**
 * Registra automaticamente todos os blocos ACF localizados em /blocks.
 * Cada bloco deve conter um arquivo block.json em sua pasta raiz.
 */
add_action('init', function () {
    $blocks_dir = THEME_DIR . '/blocks';

    if (! is_dir($blocks_dir)) {
        return;
    }

    // Percorre recursivamente todas as subpastas procurando block.json
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($blocks_dir, RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if ($file->getFilename() === 'block.json') {
            register_block_type(dirname($file->getPathname()));
        }
    }
});
