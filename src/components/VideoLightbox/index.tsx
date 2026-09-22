import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './style.module.scss';
import { IconClose } from '../../icons';
import { useLockScroll } from '../../utils';

export interface VideoLightboxProps {
  url: string;
  tipo?: 'interno' | 'externo';
  onClose: () => void;
}

/**
 * Converte um link do YouTube/Vimeo para a URL de embed correspondente.
 * URLs que já não batem com nenhum dos dois padrões (ex: link direto de arquivo,
 * ou já uma URL de embed) passam direto.
 */
function toEmbedUrl(url: string): string {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}?autoplay=1`;

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;

  return url;
}

export default function VideoLightbox({ url, tipo = 'externo', onClose }: VideoLightboxProps) {
  useLockScroll(true);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!url) return null;

  return createPortal(
    <div className={styles.lightbox} onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" className={styles.lightbox__close} onClick={onClose} aria-label="Fechar vídeo">
        <IconClose />
      </button>

      <div className={styles.lightbox__frame} onClick={(e) => e.stopPropagation()}>
        {tipo === 'interno' ? (
          <video src={url} className={styles.lightbox__video} controls autoPlay playsInline />
        ) : (
          <iframe
            src={toEmbedUrl(url)}
            className={styles.lightbox__iframe}
            title="Vídeo"
            allow="autoplay; fullscreen; picture-in-picture"
          />
        )}
      </div>
    </div>,
    document.body
  );
}
