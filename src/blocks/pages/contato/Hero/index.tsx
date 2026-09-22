import styles from './style.module.scss';
import { linkProps } from '../../../../utils';
import { ContatoHeroProps } from './types';

export default function Hero({ eyebrow, titulo, descricao, cta1, cta2 }: ContatoHeroProps) {
  const primary = linkProps(cta1);
  const secondary = linkProps(cta2);

  return (
    <section className={styles.hero}>
      <div className={styles.hero__shapeLeft} aria-hidden="true" />
      <div className={styles.hero__shapeRight} aria-hidden="true" />

      <div className={styles.hero__container}>
        <div className={styles.hero__content} data-animate="fade-up">
          {eyebrow && <p className={styles.hero__eyebrow}>{eyebrow}</p>}
          {titulo && <h1 className={styles.hero__title}>{titulo}</h1>}
          {descricao && <p className={styles.hero__description}>{descricao}</p>}
        </div>

        {(primary || secondary) && (
          <div className={styles.hero__actions} data-animate="fade-up" data-animate-delay="0.15">
            {primary && (
              <a {...primary} className={styles.hero__ctaPrimary}>
                {cta1!.label}
              </a>
            )}
            {secondary && (
              <a {...secondary} className={styles.hero__ctaSecondary}>
                {cta2!.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
