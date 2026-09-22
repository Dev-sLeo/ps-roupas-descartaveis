import styles from './style.module.scss';
import PillTabs from '../../../components/PillTabs';
import { HeroToggleProps } from './types';

export default function HeroToggle({ eyebrow, titulo, descricao, tabs = [], patternLeft, patternRight }: HeroToggleProps) {
  return (
    <section className={styles.hero}>
      {patternLeft && <img src={patternLeft} alt="" aria-hidden="true" className={`${styles.hero__pattern} ${styles['hero__pattern--left']}`} loading="lazy" />}
      {patternRight && <img src={patternRight} alt="" aria-hidden="true" className={`${styles.hero__pattern} ${styles['hero__pattern--right']}`} loading="lazy" />}

      <div className={styles.hero__container}>
        <div className={styles.hero__content} data-animate="fade-up">
          {eyebrow && <p className={styles.hero__eyebrow}>{eyebrow}</p>}
          {titulo && <h1 className={styles.hero__title}>{titulo}</h1>}
          {descricao && <p className={styles.hero__description}>{descricao}</p>}
        </div>
      </div>

      {tabs.length > 0 && <PillTabs className={styles.hero__tabs} items={tabs} />}
    </section>
  );
}
