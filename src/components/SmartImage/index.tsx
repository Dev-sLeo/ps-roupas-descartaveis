import { SmartImageProps } from './types';
import { imgProps } from '../../utils';

/**
 * Renderiza uma imagem ACF de forma inteligente:
 * - Vídeo → <video> autoplay/muted/loop (campo de imagem aceitando upload de vídeo de fundo)
 * - SVG  → inline via dangerouslySetInnerHTML, com role="img" e aria-label para acessibilidade
 * - Resto → <img> normal via imgProps(), com loading="lazy" e decoding="async" por padrão
 *
 * Uso:
 *   <SmartImage image={icon} className={styles.card__icon} />
 *   <SmartImage image={bg} alt="" loading="eager" />
 */
export default function SmartImage({
  image,
  className,
  alt,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  fetchpriority,
}: SmartImageProps) {
  if (!image?.url) return null;

  const resolvedAlt = alt !== undefined ? alt : image.alt;

  if (image.isVideo) {
    return (
      <video
        className={className}
        src={image.url}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden={resolvedAlt === '' ? true : undefined}
      />
    );
  }

  if (image.svgContent) {
    return (
      <span
        role="img"
        aria-label={resolvedAlt || undefined}
        aria-hidden={resolvedAlt === '' ? true : undefined}
        className={className}
        style={
          (width || height)
            ? { display: 'inline-flex', width: width ?? undefined, height: height ?? undefined }
            : undefined
        }
        dangerouslySetInnerHTML={{ __html: image.svgContent }}
      />
    );
  }

  const props = imgProps(image, {
    ...(alt           !== undefined && { alt }),
    ...(width         !== undefined && { width }),
    ...(height        !== undefined && { height }),
    ...(fetchpriority !== undefined && { fetchpriority }),
    loading,
    decoding,
  });

  if (!props) return null;

  return <img {...props} className={className} />;
}
