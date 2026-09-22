import styles from './style.module.scss';
import SmartImage from '../../../components/SmartImage';
import { linkProps } from '../../../utils';
import { HeroProps } from './types';

export default function Hero({ background, backgroundMobile, eyebrow, titulo, descricao, cta1, cta2 }: HeroProps) {
  const primary = linkProps(cta1);
  const secondary = linkProps(cta2);

  return (
    <section className={styles.hero}>
      {background && (
        <SmartImage image={background} className={styles.hero__bgDesktop} alt="" loading="eager" fetchpriority="high" />
      )}
      {backgroundMobile && (
        <SmartImage image={backgroundMobile} className={styles.hero__bgMobile} alt="" loading="eager" fetchpriority="high" />
      )}

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
