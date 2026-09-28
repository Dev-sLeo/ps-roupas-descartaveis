import clsx from 'clsx';
import styles from './style.module.scss';
import SmartImage from '../SmartImage';
import Skeleton from '../Skeleton';
import { IconChevronRight } from '../../icons';
import { ProductCardProps } from './types';

/**
 * Placeholder de loading com a mesma proporção/estrutura do `ProductCard` —
 * padrão do tema pra skeleton de listagens (ver `Catalogo` em produtos).
 */
export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <Skeleton className={styles.productCard__image} />
      <div className={styles.productCard__footer}>
        <Skeleton className={styles.productCard__titleSkeleton} />
      </div>
    </div>
  );
}

export default function ProductCard({ produto, animateDelay, variant = 'default' }: ProductCardProps) {
  const content = (
    <>
      <div className={styles.productCard__image}>
        {produto.imagem && <SmartImage image={produto.imagem} className={styles.productCard__img} />}
      </div>
      <div className={styles.productCard__footer}>
        <span
          className={clsx(styles.productCard__title, variant === 'home' && styles['productCard__title--home'])}
        >
          {produto.nome}
        </span>
        <IconChevronRight />
      </div>
    </>
  );

  if (produto.url) {
    return (
      <a href={produto.url} className={styles.productCard} data-animate="fade-up" data-animate-delay={animateDelay}>
        {content}
      </a>
    );
  }

  return (
    <div className={styles.productCard} data-animate="fade-up" data-animate-delay={animateDelay}>
      {content}
    </div>
  );
}
