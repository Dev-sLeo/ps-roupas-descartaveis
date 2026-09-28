import styles from './style.module.scss';
import { htmlContent } from '../../../utils';
import { ConteudoTextoProps } from './types';

export default function ConteudoTexto({ eyebrow, titulo, atualizadoEm, texto }: ConteudoTextoProps) {
  return (
    <section className={styles.conteudoTexto}>
      <div className={styles.conteudoTexto__container}>
        <div className={styles.conteudoTexto__header} data-animate="fade-up">
          {eyebrow && <p className={styles.conteudoTexto__eyebrow}>{eyebrow}</p>}
          {titulo && <h1 className={styles.conteudoTexto__title}>{titulo}</h1>}
          {atualizadoEm && <p className={styles.conteudoTexto__updated}>{atualizadoEm}</p>}
        </div>

        {texto && (
          <div className={styles.conteudoTexto__body} data-animate="fade-up" data-animate-delay="0.15" {...htmlContent(texto)} />
        )}
      </div>
    </section>
  );
}
