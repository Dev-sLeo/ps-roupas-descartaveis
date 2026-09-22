<?php
defined('ABSPATH') || exit;

define('THEME_VERSION', wp_get_theme()->get('Version'));
define('THEME_DIR', get_template_directory());
define('THEME_URI', get_template_directory_uri());

require_once THEME_DIR . '/includes/class-block-importer.php';
require_once THEME_DIR . '/includes/class-tpl.php';
require_once THEME_DIR . '/includes/helpers.php';
require_once THEME_DIR . '/includes/enqueue.php';
require_once THEME_DIR . '/includes/blocks.php';
require_once THEME_DIR . '/includes/setup.php';
require_once THEME_DIR . '/includes/woocommerce.php';
require_once THEME_DIR . '/includes/ajax.php';
require_once THEME_DIR . '/includes/cpt-vagas.php';

global $tpl;
$tpl = new Tpl();
