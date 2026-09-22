import styles from './style.module.scss';
import SmartImage from '../SmartImage';
import { IconChevronRight } from '../../icons';
import { ProductCardProps } from './types';

export default function ProductCard({ produto, animateDelay }: ProductCardProps) {
  const content = (
    <>
      <div className={styles.productCard__image}>
        {produto.imagem && <SmartImage image={produto.imagem} className={styles.productCard__img} />}
      </div>
      <div className={styles.productCard__footer}>
        <span className={styles.productCard__title}>{produto.nome}</span>
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
