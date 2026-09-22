import { useState } from 'react';
import styles from './style.module.scss';
import { IconSearch } from '../../../../icons';
import { submitFiltro } from '../../../../utils/ajaxFiltro';
import { ProdutosHeroProps } from './types';

export default function Hero({ eyebrow, titulo, descricao, buscaPlaceholder, buscaValue, arquivoUrl, patternLeft, patternRight }: ProdutosHeroProps) {
  const [valor, setValor] = useState(buscaValue ?? '');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    if (valor.trim()) {
      params.set('produto_busca', valor.trim());
    } else {
      params.delete('produto_busca');
    }
    params.delete('paged');

    const query = params.toString();
    const url = `${arquivoUrl ?? window.location.pathname}${query ? `?${query}` : ''}`;

    submitFiltro('filtrar_produtos', url);
  };

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

        <form className={styles.hero__search} onSubmit={onSubmit} data-animate="fade-up" data-animate-delay="0.15">
          <input
            type="search"
            name="produto_busca"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder={buscaPlaceholder || 'Encontre seu produto'}
            className={styles.hero__searchInput}
          />
          <button type="submit" className={styles.hero__searchBtn} aria-label="Buscar">
            <IconSearch />
          </button>
        </form>
      </div>
    </section>
  );
}
