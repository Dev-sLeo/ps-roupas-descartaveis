import { useEffect } from 'react';

// ─── Shapes ACF normalizados (espelham BlockImporter no PHP) ──────────────────

export interface AcfImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Presente quando a URL aponta para um .svg — conteúdo do arquivo pronto para inline. */
  svgContent?: string;
  /** true quando o arquivo enviado no campo (mime_type) é um vídeo, não uma imagem. */
  isVideo?: boolean;
}

export interface AcfLink {
  label: string;
  url: string;
  target: string;
}

// ─── Guards de tipo ────────────────────────────────────────────────────────────

export function isAcfImage(value: unknown): value is AcfImage {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as AcfImage).url === 'string' &&
    (value as AcfImage).url.length > 0
  );
}

export function isAcfLink(value: unknown): value is AcfLink {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as AcfLink).url === 'string' &&
    (value as AcfLink).url.length > 0
  );
}

// ─── Helpers de imagem ─────────────────────────────────────────────────────────

/**
 * Retorna os atributos prontos para usar em um <img>.
 * Omite width/height se forem 0 (campos sem dimensão definida no ACF).
 */
export function imgProps(
  image: AcfImage | null | undefined,
  overrides: Partial<React.ImgHTMLAttributes<HTMLImageElement>> = {}
): React.ImgHTMLAttributes<HTMLImageElement> | null {
  if (!image?.url) return null;

  return {
    src: image.url,
    alt: image.alt,
    ...(image.width  > 0 && { width:  image.width  }),
    ...(image.height > 0 && { height: image.height }),
    ...overrides,
  };
}

// ─── Helpers de link ───────────────────────────────────────────────────────────

/**
 * Retorna os atributos prontos para usar em um <a>.
 * Adiciona rel="noopener noreferrer" quando target="_blank".
 */
export function linkProps(
  link: AcfLink | null | undefined,
  overrides: Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>> = {}
): (React.AnchorHTMLAttributes<HTMLAnchorElement> & { label: string }) | null {
  if (!link?.url) return null;

  const isBlank = link.target === '_blank';
  return {
    href:   link.url,
    target: link.target || undefined,
    ...(isBlank && { rel: 'noopener noreferrer' }),
    label:  link.label,
    ...overrides,
  };
}

// ─── Helpers de array ──────────────────────────────────────────────────────────

/**
 * Garante que o valor é um array não-vazio antes de renderizar.
 * Útil para repeaters: `hasItems(cards) && cards.map(...)`.
 */
export function hasItems<T>(list: T[] | null | undefined): list is T[] {
  return Array.isArray(list) && list.length > 0;
}

// ─── Helpers de texto ──────────────────────────────────────────────────────────

/**
 * Retorna o primeiro valor não-vazio dentre os fornecidos.
 * Útil para fallback de campos opcionais: `firstDefined(heading, 'Título padrão')`.
 */
export function firstDefined(...values: (string | null | undefined)[]): string {
  for (const v of values) {
    if (v != null && v.trim() !== '') return v;
  }
  return '';
}

/**
 * Monta um link wa.me a partir de um telefone bruto (com ou sem máscara).
 * Assume Brasil (+55) quando o telefone não tem código de país.
 */
export function whatsappHref(phone: string, message = ''): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  const url = `https://wa.me/55${digits}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}

// ─── Payload HTML seguro ──────────────────────────────────────────────────────

/**
 * Props para renderizar HTML de campo WYSIWYG via dangerouslySetInnerHTML.
 * Use em elementos de bloco como <div> e <p>.
 */
export function htmlContent(raw: string | null | undefined): { dangerouslySetInnerHTML: { __html: string } } {
  return { dangerouslySetInnerHTML: { __html: raw ?? '' } };
}

/**
 * Props para renderizar HTML inline em títulos e headings (strong, em, span, br, a).
 * Use em <h1>, <h2>, <h3>, <p> quando o campo ACF foi processado com acf_html().
 *
 * Exemplo no render.php:  'title' => acf_html($group['title'])
 * Exemplo no componente:  <h2 {...htmlTitle(title)} className={styles.card__title} />
 */
export function htmlTitle(raw: string | null | undefined): { dangerouslySetInnerHTML: { __html: string } } {
  return { dangerouslySetInnerHTML: { __html: raw ?? '' } };
}

// ─── Scroll lock (lightboxes/modais) ───────────────────────────────────────────

/**
 * Bloqueia o scroll da página enquanto `locked` for true (ex: lightbox aberto).
 * `overflow:hidden` no body não basta aqui: o scroll real é simulado via
 * transform pelo GSAP ScrollSmoother (ver src/animations/index.ts), que ignora
 * o overflow do body — por isso pausamos a instância também via `ScrollSmoother.get()`.
 */
export function useLockScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let smoother: { paused: (value: boolean) => void } | undefined;
    import('gsap/ScrollSmoother').then(({ ScrollSmoother }) => {
      smoother = ScrollSmoother.get();
      smoother?.paused(true);
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      smoother?.paused(false);
    };
  }, [locked]);
}
