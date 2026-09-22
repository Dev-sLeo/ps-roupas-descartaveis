import styles from './style.module.scss';
import { linkProps, htmlTitle } from '../../../utils';
import { FaleConoscoProps } from './types';

export default function FaleConosco({ eyebrow, titulo, descricao, cta1, cta2, patternLeft, patternRight }: FaleConoscoProps) {
  const primary = linkProps(cta1);
  const secondary = linkProps(cta2);

  return (
    <section className={styles.faleConosco}>
      {patternLeft && <img src={patternLeft} alt="" aria-hidden="true" className={`${styles.faleConosco__pattern} ${styles['faleConosco__pattern--left']}`} loading="lazy" />}
      {patternRight && <img src={patternRight} alt="" aria-hidden="true" className={`${styles.faleConosco__pattern} ${styles['faleConosco__pattern--right']}`} loading="lazy" />}

      <div className={styles.faleConosco__container} data-animate="fade-up">
        {eyebrow && <p className={styles.faleConosco__eyebrow}>{eyebrow}</p>}
        {titulo && <h2 className={styles.faleConosco__title}>{titulo}</h2>}
        {descricao && <p className={styles.faleConosco__description} {...htmlTitle(descricao)} />}

        {(primary || secondary) && (
          <div className={styles.faleConosco__actions}>
            {primary && (
              <a {...primary} className={styles.faleConosco__ctaPrimary}>
                {cta1!.label}
              </a>
            )}
            {secondary && (
              <a {...secondary} className={styles.faleConosco__ctaSecondary}>
                {cta2!.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
