<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="HandheldFriendly" content="true">
    <meta http-equiv="X-UA-Compatible" content="IE=9">
    <meta http-equiv="X-UA-TextLayoutMetrics" content="gdi" />
    <meta name="format-detection" content="telephone=no">
    <meta name="author" content="Criação de Site por UpSites">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:ital,wght@0,400;0,600;1,400;1,600&family=Montserrat:ital,wght@0,500;0,600;1,500;1,600&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <?php include THEME_DIR . '/blocks/global/header/render.php'; ?>

    <div id="smooth-wrapper">
        <div id="smooth-content">