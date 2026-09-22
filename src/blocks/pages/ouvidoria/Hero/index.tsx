import styles from './style.module.scss';
import PillTabs from '../../../../components/PillTabs';
import { linkProps } from '../../../../utils';
import { HeroProps } from './types';

export default function Hero({ eyebrow, titulo, descricao, faleConoscoUrl }: HeroProps) {
  const faleConosco = linkProps(faleConoscoUrl);

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

        <PillTabs
          className={styles.hero__tabs}
          items={[
            { label: faleConoscoUrl?.label || 'Fale Conosco', href: faleConosco?.href },
            { label: 'Ouvidoria', active: true },
          ]}
        />
      </div>
    </section>
  );
}
