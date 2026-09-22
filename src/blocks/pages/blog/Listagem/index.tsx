import styles from './style.module.scss';
import PillTabs from '../../../../components/PillTabs';
import PostCard from '../../../../components/PostCard';
import { hasItems } from '../../../../utils';
import { ListagemProps } from './types';

export default function Listagem({ categorias = [], posts = [], paginacao = [] }: ListagemProps) {
  return (
    <section className={styles.listagem}>
      <div className={styles.listagem__container}>
        {hasItems(categorias) && (
          <PillTabs
            className={styles.listagem__tabs}
            itemClassName={styles.listagem__tabItem}
            activeItemClassName={styles.listagem__tabItemActive}
            items={categorias.map((categoria) => ({
              label: categoria.nome,
              href: categoria.url,
              active: categoria.ativa,
            }))}
          />
        )}

        {hasItems(posts) ? (
          <div className={styles.listagem__grid}>
            {posts.map((post, i) => (
              <PostCard key={i} post={post} animateDelay={String((i % 3) * 0.1)} />
            ))}
          </div>
        ) : (
          <p className={styles.listagem__empty}>Nenhum post encontrado.</p>
        )}

        {paginacao.length > 1 && (
          <nav className={styles.listagem__pagination} aria-label="Paginação do blog">
            {paginacao.map((pagina) =>
              pagina.ativa ? (
                <span
                  key={pagina.numero}
                  className={`${styles.listagem__pageLink} ${styles['listagem__pageLink--active']}`}
                  aria-current="page"
                >
                  {String(pagina.numero).padStart(2, '0')}
                </span>
              ) : (
                <a key={pagina.numero} href={pagina.url} className={styles.listagem__pageLink}>
                  {String(pagina.numero).padStart(2, '0')}
                </a>
              )
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
