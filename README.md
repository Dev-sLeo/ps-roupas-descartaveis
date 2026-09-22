# Proseg — WordPress Theme

Tema WordPress para o site da Proseg (PS Roupas Descartáveis). Arquitetura baseada em blocos ACF com frontend em React 18 + TypeScript, compilado via `@wordpress/scripts`.

---

## Stack

| Camada | Tecnologia |
|---|---|
| CMS | WordPress + ACF Pro |
| Blocos | ACF Blocks (block.json + render.php) |
| Frontend | React 18 + TypeScript |
| Estilos | SCSS Modules + BEM |
| Build | @wordpress/scripts (Webpack) |
| Ícones | SVG inline via `src/icons/index.tsx` |

---

## Pré-requisitos

- PHP 8.1+
- WordPress 6.4+
- ACF Pro 6+
- Node.js 18+
- Yarn

---

## Instalação

```bash
# 1. Clonar o tema na pasta de temas do WordPress
cd wp-content/themes/
git clone <repo-url> proseg

# 2. Instalar dependências JS
cd proseg
yarn install

# 3. Build dos assets
yarn build
```

Ativar o tema no painel do WordPress em **Aparência → Temas**.

---

## Desenvolvimento

```bash
yarn start    # watch mode — recompila ao salvar
yarn build    # build de produção
```

Os assets compilados vão para `build/`. Nunca editar os arquivos em `build/` diretamente.

---

## Arquitetura

O fluxo de dados de todo bloco segue o padrão:

```
ACF (painel) → render.php → JSON → index.ts → componente React → HTML
```

O `render.php` **nunca escreve HTML** — apenas serializa os dados do ACF em JSON e imprime a âncora do bloco. O componente React faz todo o HTML a partir desse payload.

---

## Estrutura de pastas

```
blocks/
  global/                     ← blocos reutilizáveis em qualquer página
    <module-name>/
      block.json              ← metadados do bloco (WordPress Block API v3)
      render.php              ← serializa dados ACF em JSON
  pages/
    <page>/
      <module-name>/
        block.json
        render.php
      <page>.php              ← orquestrador: lista os blocos da página

src/
  blocks/
    global/<ModuleName>/
      index.tsx               ← componente React (default export)
      types.ts                ← interfaces TypeScript
      style.module.scss       ← estilos BEM (CSS Modules)
    pages/<page>/<ModuleName>/
      index.tsx
      types.ts
      style.module.scss
  components/
    Button/                   ← botão primário/secundário
    SmartImage/               ← imagem ACF inteligente (SVG inline ou <img>)
  icons/
    index.tsx                 ← todos os ícones SVG do projeto (named exports)
  styles/
    _tokens.scss              ← design tokens (cores, tipografia, espaçamento)
    _reset.scss
    global.scss
  utils/
    index.ts                  ← helpers TypeScript (imgProps, linkProps, etc.)

includes/
  class-block-importer.php   ← normaliza dados ACF para o payload JSON
  class-tpl.php              ← motor de templates ($tpl global)
  helpers.php                ← funções PHP procedurais (acf_image, acf_link, etc.)
  blocks.php                 ← auto-registra todos os block.json
  enqueue.php                ← enfileira JS/CSS compilados
  setup.php                  ← suportes do tema, menus

acf-json/                    ← JSONs do ACF (source of truth dos campos)
build/                       ← assets compilados (gerado pelo build, não editar)
```

---

## Criando um novo bloco

### 1. PHP — `blocks/<path>/<name>/render.php`

```php
<?php
defined('ABSPATH') || exit;

$data  = BlockImporter::data();
$group = get_field('meu_grupo') ?: [];

block_render('meu-bloco', [
    'title'  => acf_html($group['title']),
    'text'   => acf_wysiwyg($group['text']),
    'image'  => acf_image($group['image']),
    'cta'    => acf_link($group['button']),
    'items'  => acf_repeater($group['list'], fn($item) => [
        'title' => $item['title'] ?? '',
    ]),
]);
```

### 2. PHP — `blocks/<path>/<name>/block.json`

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "theme/meu-bloco",
  "title": "Meu Bloco",
  "category": "theme",
  "acf": { "mode": "preview", "renderTemplate": "render.php" },
  "editorScript": "file:../../build/index.js",
  "style":        "file:../../build/index.css"
}
```

> `file:` com `../../` para blocos em `global/`, `../../../` para blocos em `pages/<page>/`.

### 3. TypeScript — `src/blocks/.../types.ts`

```ts
import type { AcfImage, AcfLink } from '../../../utils';

export interface MeuBlocoProps {
  title?: string;
  text?: string;
  image?: AcfImage | null;
  cta?: AcfLink | null;
}
```

### 4. React — `src/blocks/.../index.tsx`

```tsx
import styles from './style.module.scss';
import { MeuBlocoProps } from './types';
import SmartImage from '../../../components/SmartImage';
import { htmlTitle, htmlContent, linkProps } from '../../../utils';

export default function MeuBloco({ title, text, image, cta }: MeuBlocoProps) {
  const ctaProps = linkProps(cta);
  return (
    <section className={styles.bloco}>
      {title && <h2 className={styles.bloco__title} {...htmlTitle(title)} />}
      {text  && <div className={styles.bloco__text} {...htmlContent(text)} />}
      <SmartImage image={image} className={styles.bloco__image} />
      {ctaProps && <a {...ctaProps} className={styles.bloco__cta}>{ctaProps.label}</a>}
    </section>
  );
}
```

### 5. Registrar em `src/index.ts`

```ts
'meu-bloco': () => import(/* webpackChunkName: "blocks/global/MeuBloco" */ './blocks/global/MeuBloco'),
```

### 6. Adicionar ao orquestrador da página

```php
// blocks/pages/home/home.php
$home->partial('meu-bloco');
```

---

## Motor de templates — `$tpl`

A variável global `$tpl` (classe `Tpl`) permite montar páginas sem `include` manual.

```php
// front-page.php
get_header();
include THEME_DIR . '/blocks/pages/home/home.php';
get_footer();

// blocks/pages/home/home.php
global $tpl;
$tpl->wrap('page-home', function ($t) {
    $home = $t->scope('pages/home');

    $home->partial('hero')
         ->partial('faixa');

    $t->scope('global')->partial('text-image');

    $home->partial('solucoes')
         ->partial('diferenciais');
});
```

| Método | Descrição |
|---|---|
| `partial($slug, $data = [])` | Inclui `blocks/{slug}/render.php`. Suporta chaining. |
| `scope($subpath)` | Nova instância com base estendida (slugs curtos). |
| `wrap($class, $fn)` | Envolve os parciais em `<div class="{class}">`. |

**Override de dados** — reutiliza um bloco global com conteúdo diferente:

```php
$t->scope('global')->partial('cta', [
    'title' => 'Título personalizado',
    'cta'   => ['label' => 'Saiba mais', 'url' => '/contato', 'target' => ''],
]);
```

---

## Helpers PHP — `BlockImporter` + `helpers.php`

| Helper | O que faz |
|---|---|
| `acf_image($field)` | Normaliza campo Image → `{url, alt, width, height, svgContent?}` |
| `acf_link($field)` | Normaliza campo Link/Button → `{label, url, target}` |
| `acf_repeater($field, $map)` | Normaliza Repeater com callback por item |
| `acf_group($field)` | Normaliza Group → `array` ou `[]` |
| `acf_wysiwyg($field)` | Retorna HTML sanitizado (`wp_kses_post`) — para campos WYSIWYG |
| `acf_html($field)` | Retorna HTML inline sanitizado — para títulos com `<strong>`, `<br>`, `<span>` |
| `block_render($name, $data)` | Imprime `<div data-block>` + JSON |
| `BlockImporter::data()` | Retorna `$data` do bloco (override de `$tpl->partial()` ou `get_query_var`) |
| `BlockImporter::field($key, $data)` | Resolve campo: prefere `$data`, depois ACF |

---

## Helpers TypeScript — `src/utils`

```ts
import SmartImage from '../components/SmartImage';
import { linkProps, hasItems, htmlTitle, htmlContent } from '../../utils';
import type { AcfImage, AcfLink } from '../../utils';
```

| Export | Descrição |
|---|---|
| `AcfImage` | Interface `{url, alt, width, height, svgContent?}` |
| `AcfLink` | Interface `{label, url, target}` |
| `linkProps(link)` | Atributos para `<a>` + `rel` automático no `_blank` |
| `hasItems(list)` | Guard para array não-vazio antes de `.map()` |
| `htmlTitle(raw)` | `dangerouslySetInnerHTML` para títulos com HTML inline |
| `htmlContent(raw)` | `dangerouslySetInnerHTML` para campos WYSIWYG |
| `firstDefined(...values)` | Primeiro valor não-vazio (fallback de campos opcionais) |

### SmartImage

Componente que renderiza qualquer campo ACF Image:

- **SVG** → inline via `dangerouslySetInnerHTML` com `role="img"` / `aria-hidden`
- **JPG / PNG / WebP** → `<img loading="lazy" decoding="async">`
- **nulo / vazio** → `null`

```tsx
<SmartImage image={image} className={styles.card__image} />
<SmartImage image={bgImage} alt="" loading="eager" />
<SmartImage image={logo} width={171} height={44} />
```

---

## Design tokens

Arquivo: `src/styles/_tokens.scss`

### Cores principais

| Token | Valor | Uso |
|---|---|---|
| `$color-primary` | `#048837` | Verde — cor principal |
| `$color-accent` | `#f29506` | Laranja — botões CTA |
| `$color-dark` | `#060d3c` | Navy — fundos escuros |
| `$color-text` | `#1a1a1a` | Texto padrão |
| `$color-text-muted` | `#737373` | Texto secundário |
| `$color-bg` | `#f5f5f5` | Fundo de seções |

### Tipografia

Fonte: **Plus Jakarta Sans**

`$font-size-sm` (14px) · `$font-size-md` (16px) · `$font-size-lg` (18px) · `$font-size-xl` (20px) · `$font-size-2xl` (24px) · `$font-size-3xl` (30px) · `$font-size-4xl` (36px) · `$font-size-5xl` (48px)

### Espaçamento

`$space-1` (4px) · `$space-2` (8px) · `$space-4` (16px) · `$space-6` (24px) · `$space-8` (32px) · `$space-12` (48px) · `$space-16` (64px) · `$space-20` (80px) · `$space-24` (96px)

---

## Convenções

- Pastas em `src/` → **PascalCase** (`ExampleHero`)
- Pastas em `blocks/` → **kebab-case** (`example-hero`)
- Classes CSS → **BEM** (`block`, `block__element`, `block--modifier`)
- SCSS → sempre **mobile-first** (`@include respond-to($bp-md)`)
- Chaves do payload JSON → **camelCase** (`bgImage`, `ctaLabel`)
- Títulos com HTML inline → `acf_html()` no PHP + `htmlTitle()` no React
- Imagens ACF → sempre via `SmartImage` (nunca `<img>` manual)
- SVGs estáticos de UI → `src/icons/index.tsx` (nunca inline nos componentes)
