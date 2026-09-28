import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './style.module.scss';
import PillTabs from '../../../../components/PillTabs';
import PostCard, { PostCardSkeleton } from '../../../../components/PostCard';
import { submitFiltro } from '../../../../utils/ajaxFiltro';
import { scrollToTarget } from '../../../../animations';
import { hasItems } from '../../../../utils';
import { ListagemProps, BlogPagina } from './types';
import type { Post } from '../../../../components/PostCard/types';

interface FiltrarBlogDetail {
  posts: Post[];
  paginacao: BlogPagina[];
  total: number;
}

const LISTAGEM_ID = 'listagem-blog';
const POSTS_POR_PAGINA = 9;

export default function Listagem({
  categorias = [],
  posts: postsIniciais = [],
  paginacao: paginacaoInicial = [],
  arquivoUrl,
}: ListagemProps) {
  const [categoriaAtiva, setCategoriaAtiva] = useState(() => categorias.find((c) => c.ativa)?.slug ?? '');
  const [posts, setPosts] = useState(postsIniciais);
  const [paginacao, setPaginacao] = useState(paginacaoInicial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onLoading = () => setLoading(true);
    const onUpdated = (e: Event) => {
      const detail = (e as CustomEvent<FiltrarBlogDetail>).detail;
      setPosts(detail.posts);
      setPaginacao(detail.paginacao);
      setLoading(false);
      scrollToTarget(LISTAGEM_ID);
    };

    window.addEventListener('filtrar_blog:loading', onLoading);
    window.addEventListener('filtrar_blog:updated', onUpdated);
    return () => {
      window.removeEventListener('filtrar_blog:loading', onLoading);
      window.removeEventListener('filtrar_blog:updated', onUpdated);
    };
  }, []);

  const selecionarCategoria = (slug: string) => {
    setCategoriaAtiva(slug);

    const params = new URLSearchParams(window.location.search);
    params.delete('paged');
    if (slug) {
      params.set('blog_categoria', slug);
    } else {
      params.delete('blog_categoria');
    }

    const query = params.toString();
    const url = `${arquivoUrl ?? window.location.pathname}${query ? `?${query}` : ''}`;
    submitFiltro('filtrar_blog', url);
  };

  const irParaPagina = (numero: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('paged', String(numero));
    const query = params.toString();
    const url = `${arquivoUrl ?? window.location.pathname}${query ? `?${query}` : ''}`;
    submitFiltro('filtrar_blog', url);
  };

  return (
    <section id={LISTAGEM_ID} className={styles.listagem}>
      <div className={styles.listagem__container}>
        {hasItems(categorias) && (
          <PillTabs
            className={styles.listagem__tabs}
            itemClassName={styles.listagem__tabItem}
            activeItemClassName={styles.listagem__tabItemActive}
            items={categorias.map((categoria) => ({
              label: categoria.nome,
              active: categoria.slug === categoriaAtiva,
              onClick: () => selecionarCategoria(categoria.slug),
            }))}
          />
        )}

        {loading ? (
          <div className={styles.listagem__grid}>
            {Array.from({ length: posts.length || POSTS_POR_PAGINA }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : hasItems(posts) ? (
          <div className={styles.listagem__grid}>
            {posts.map((post, i) => (
              <PostCard key={i} post={post} animateDelay={String((i % 3) * 0.1)} />
            ))}
          </div>
        ) : (
          <p className={styles.listagem__empty}>Nenhum post encontrado.</p>
        )}

        {!loading && paginacao.length > 1 && (
          <nav className={styles.listagem__pagination} aria-label="Paginação do blog">
            {paginacao.map((pagina) =>
              pagina.ativa ? (
                <span
                  key={pagina.numero}
                  className={clsx(styles.listagem__pageLink, styles['listagem__pageLink--active'])}
                  aria-current="page"
                >
                  {String(pagina.numero).padStart(2, '0')}
                </span>
              ) : (
                <button
                  key={pagina.numero}
                  type="button"
                  onClick={() => irParaPagina(pagina.numero)}
                  className={styles.listagem__pageLink}
                >
                  {String(pagina.numero).padStart(2, '0')}
                </button>
              )
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
