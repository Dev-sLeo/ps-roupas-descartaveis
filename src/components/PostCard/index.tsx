import styles from './style.module.scss';
import SmartImage from '../SmartImage';
import Skeleton from '../Skeleton';
import { PostCardProps } from './types';

/**
 * Placeholder de loading com a mesma proporção/estrutura do `PostCard` —
 * padrão do tema pra skeleton de listagens (ver `ProductCardSkeleton`).
 */
export function PostCardSkeleton() {
  return (
    <div className={styles.postCard}>
      <Skeleton className={styles.postCard__imageSkeleton} />
      <div className={styles.postCard__body}>
        <Skeleton className={styles.postCard__titleSkeleton} />
        <Skeleton className={styles.postCard__excerptSkeleton} />
      </div>
      <Skeleton className={styles.postCard__ctaSkeleton} />
    </div>
  );
}

export default function PostCard({ post, animateDelay }: PostCardProps) {
  return (
    <article className={styles.postCard} data-animate="fade-up" data-animate-delay={animateDelay}>
      {post.imagem && (
        <a href={post.url} className={styles.postCard__imageLink} aria-hidden="true" tabIndex={-1}>
          <SmartImage image={post.imagem} className={styles.postCard__image} />
        </a>
      )}
      <div className={styles.postCard__body}>
        {post.titulo && <h3 className={styles.postCard__title}>{post.titulo}</h3>}
        {post.excerpt && <p className={styles.postCard__excerpt}>{post.excerpt}</p>}
      </div>
      <a href={post.url} className={styles.postCard__cta}>
        Saiba mais
      </a>
    </article>
  );
}
