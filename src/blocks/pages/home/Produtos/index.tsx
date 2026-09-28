import styles from './style.module.scss';
import ProductCard from '../../../../components/ProductCard';
import { hasItems, linkProps } from '../../../../utils';
import { ProdutosProps } from './types';

export default function Produtos({ eyebrow, titulo, descricao, produtos = [], botao }: ProdutosProps) {
  const cta = linkProps(botao);

  return (
    <section className={styles.produtos}>
      <div className={styles.produtos__container}>
        <div className={styles.produtos__header} data-animate="fade-up">
          <div className={styles.produtos__heading}>
            {eyebrow && <p className={styles.produtos__eyebrow}>{eyebrow}</p>}
            {titulo && <h2 className={styles.produtos__title}>{titulo}</h2>}
            {descricao && <p className={styles.produtos__description}>{descricao}</p>}
          </div>

          {cta && (
            <a {...cta} className={styles.produtos__cta}>
              {botao!.label}
            </a>
          )}
        </div>

        {hasItems(produtos) && (
          <div className={styles.produtos__grid}>
            {produtos.map((produto, i) => (
              <ProductCard key={produto.id ?? i} produto={produto} animateDelay={String((i % 3) * 0.1)} variant="home" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
