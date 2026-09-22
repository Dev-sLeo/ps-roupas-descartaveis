import { useState } from 'react';
import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import VideoLightbox from '../../../../components/VideoLightbox';
import { IconPlaySquare, IconShare } from '../../../../icons';
import { InstrucoesProps } from './types';

export default function Instrucoes({ videoUrl, capa }: InstrucoesProps) {
  const [aberto, setAberto] = useState(false);

  if (!videoUrl) return null;

  function compartilhar() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
    }
  }

  return (
    <section className={styles.instrucoes}>
      <div className={styles.instrucoes__container}>
        <div className={styles.instrucoes__header} data-animate="fade-up">
          <h2 className={styles.instrucoes__title}>Instruções de uso</h2>
          <button type="button" className={styles.instrucoes__share} onClick={compartilhar}>
            <IconShare />
            <span>Compartilhar</span>
          </button>
        </div>

        <button type="button" className={styles.instrucoes__player} onClick={() => setAberto(true)} aria-label="Assistir vídeo de instruções de uso">
          {capa && <SmartImage image={capa} className={styles.instrucoes__thumb} alt="" />}
          <span className={styles.instrucoes__playIcon}>
            <IconPlaySquare />
          </span>
        </button>
      </div>

      {aberto && <VideoLightbox url={videoUrl} onClose={() => setAberto(false)} />}
    </section>
  );
}
