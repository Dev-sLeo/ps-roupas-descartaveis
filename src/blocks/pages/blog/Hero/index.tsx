import styles from './style.module.scss';
import { IconSearch } from '../../../../icons';
import { HeroProps } from './types';

export default function Hero({ eyebrow, titulo, searchValue, searchUrl = '/' }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__shapeLeft} aria-hidden="true" />
      <div className={styles.hero__shapeRight} aria-hidden="true" />

      <div className={styles.hero__container}>
        <div className={styles.hero__content} data-animate="fade-up">
          {eyebrow && <p className={styles.hero__eyebrow}>{eyebrow}</p>}
          {titulo && <h1 className={styles.hero__title}>{titulo}</h1>}
        </div>

        <form action={searchUrl} method="get" className={styles.hero__search} data-animate="fade-up" data-animate-delay="0.15">
          <input
            type="search"
            name="s"
            defaultValue={searchValue}
            placeholder="Busca"
            className={styles.hero__searchInput}
            aria-label="Buscar no blog"
          />
          <button type="submit" className={styles.hero__searchBtn} aria-label="Buscar">
            <IconSearch />
          </button>
        </form>
      </div>
    </section>
  );
}
