import type { AcfImage } from '../../utils';

export interface SmartImageProps {
  image: AcfImage | null | undefined;
  className?: string;
  /** Sobrescreve o alt vindo do ACF (ex: quando decorativa — passar string vazia). */
  alt?: string;
  /** Largura em px — sobrescreve o valor do ACF. */
  width?: number;
  /** Altura em px — sobrescreve o valor do ACF. */
  height?: number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
}
