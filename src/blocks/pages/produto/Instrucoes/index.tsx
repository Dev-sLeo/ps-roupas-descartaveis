import { useState } from 'react';
import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import VideoLightbox from '../../../../components/VideoLightbox';
import { IconPlaySquare, IconShare } from '../../../../icons';
import { InstrucoesProps } from './types';

export default function Instrucoes({ videoUrl, capa }: InstrucoesProps) {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  if (!videoUrl) return null;

  async function compartilhar() {
    // Âncora pro módulo de especificações — quem abre o link compartilhado
    // cai direto lá (ver id="produto-especificacoes" em Especificacoes/index.tsx
    // e scrollToHash() em src/index.ts, que já trata #hash no load da página).
    const url = `${window.location.href.split('#')[0]}#produto-especificacoes`;

    // Share nativo (mobile/Safari) — se o usuário cancelar o dialog, o próprio
    // navigator.share rejeita a Promise; não é erro, só não faz nada depois.
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        /* usuário cancelou o compartilhamento nativo */
      }
      return;
    }

    // Fallback (desktop): copia o link. `navigator.clipboard` só existe em
    // contexto seguro (https) — em http (comum em ambiente local) o botão
    // clicava e não fazia nada, sem erro nenhum e sem feedback. O
    // `document.execCommand` cobre esse caso; o try/catch final é só rede de
    // segurança pra nunca quebrar o clique.
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('textarea');
        input.value = url;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* nada a fazer — sem clipboard disponível */
    }
  }

  return (
    <section className={styles.instrucoes}>
      <div className={styles.instrucoes__container}>
        <div className={styles.instrucoes__header} data-animate="fade-up">
          <h2 className={styles.instrucoes__title}>Instruções de uso</h2>
          <button type="button" className={styles.instrucoes__share} onClick={compartilhar}>
            <IconShare />
            <span>{copiado ? 'Link copiado!' : 'Compartilhar'}</span>
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
