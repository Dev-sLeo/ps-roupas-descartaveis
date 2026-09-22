import styles from './style.module.scss';
import PostCard from '../../../../components/PostCard';
import { hasItems } from '../../../../utils';
import { RelacionadosProps } from './types';

export default function Relacionados({ titulo, posts = [] }: RelacionadosProps) {
  if (!hasItems(posts)) return null;

  return (
    <section className={styles.relacionados}>
      <div className={styles.relacionados__container}>
        {titulo && (
          <h2 className={styles.relacionados__title} data-animate="fade-up">
            {titulo}
          </h2>
        )}

        <div className={styles.relacionados__grid}>
          {posts.map((post, i) => (
            <PostCard key={i} post={post} animateDelay={String(i * 0.1)} />
          ))}
        </div>
      </div>
    </section>
  );
}
