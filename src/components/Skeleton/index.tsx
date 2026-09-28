import clsx from 'clsx';
import styles from './style.module.scss';

interface SkeletonProps {
  className?: string;
}

/**
 * Bloco de shimmer genérico — padrão do tema pra estado de loading de qualquer
 * listagem (produtos, vídeos, notícias, etc.). Combine com uma classe própria
 * (via `className`) pra herdar tamanho/proporção/raio de outro elemento.
 */
export default function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx(styles.skeleton, className)} aria-hidden="true" />;
}
