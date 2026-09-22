import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './style.module.scss';
import ProductCard from '../../../../components/ProductCard';
import { IconCheck } from '../../../../icons';
import { submitFiltro } from '../../../../utils/ajaxFiltro';
import { hasItems } from '../../../../utils';
import { CatalogoProps, PaginaFiltro } from './types';
import type { Produto } from '../../../../components/ProductCard/types';

interface FiltrarProdutosDetail {
  produtos: Produto[];
  paginacao: PaginaFiltro[];
  total: number;
}

export default function Catalogo({
  categorias = [],
  destaque = false,
  produtos: produtosIniciais = [],
  paginacao: paginacaoInicial = [],
  arquivoUrl,
}: CatalogoProps) {
  const [selecionadas, setSelecionadas] = useState(() => new Set(categorias.filter((c) => c.checked).map((c) => c.slug)));
  const [destacadoAtivo, setDestacadoAtivo] = useState(destaque);
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [paginacao, setPaginacao] = useState(paginacaoInicial);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onLoading = () => setLoading(true);
    const onUpdated = (e: Event) => {
      const detail = (e as CustomEvent<FiltrarProdutosDetail>).detail;
      setProdutos(detail.produtos);
      setPaginacao(detail.paginacao);
      setLoading(false);
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.addEventListener('filtrar_produtos:loading', onLoading);
    window.addEventListener('filtrar_produtos:updated', onUpdated);
    return () => {
      window.removeEventListener('filtrar_produtos:loading', onLoading);
      window.removeEventListener('filtrar_produtos:updated', onUpdated);
    };
  }, []);

  const filtrar = (params: URLSearchParams) => {
    params.delete('paged');
    const query = params.toString();
    const url = `${arquivoUrl ?? window.location.pathname}${query ? `?${query}` : ''}`;
    submitFiltro('filtrar_produtos', url);
  };

  const toggleCategoria = (slug: string) => {
    const next = new Set(selecionadas);
    next.has(slug) ? next.delete(slug) : next.add(slug);
    setSelecionadas(next);

    const params = new URLSearchParams(window.location.search);
    if (next.size) {
      params.set('produto_categoria', Array.from(next).join(','));
    } else {
      params.delete('produto_categoria');
    }
    filtrar(params);
  };

  const toggleDestaque = () => {
    const next = !destacadoAtivo;
    setDestacadoAtivo(next);

    const params = new URLSearchParams(window.location.search);
    if (next) {
      params.set('produto_destaque', '1');
    } else {
      params.delete('produto_destaque');
    }
    filtrar(params);
  };

  const irParaPagina = (numero: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('paged', String(numero));
    const query = params.toString();
    const url = `${arquivoUrl ?? window.location.pathname}${query ? `?${query}` : ''}`;
    submitFiltro('filtrar_produtos', url);
  };

  return (
    <section className={styles.catalogo}>
      <div className={styles.catalogo__container}>
        <aside className={styles.catalogo__sidebar}>
          <div className={styles.catalogo__filterBox}>
            <p className={styles.catalogo__filterTitle}>Categoria</p>

            <div className={styles.catalogo__checkboxList}>
              <label className={styles.catalogo__checkbox}>
                <input type="checkbox" checked={destacadoAtivo} onChange={toggleDestaque} />
                <span className={styles.catalogo__checkboxMark}>
                  <IconCheck />
                </span>
                <span>Em destaque</span>
              </label>

              {categorias.map((categoria) => (
                <label key={categoria.slug} className={styles.catalogo__checkbox}>
                  <input
                    type="checkbox"
                    checked={selecionadas.has(categoria.slug)}
                    onChange={() => toggleCategoria(categoria.slug)}
                  />
                  <span className={styles.catalogo__checkboxMark}>
                    <IconCheck />
                  </span>
                  <span>{categoria.nome}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className={styles.catalogo__content} ref={gridRef}>
          {loading && <div className={styles.catalogo__loading} aria-hidden="true" />}

          {hasItems(produtos) ? (
            <div className={clsx(styles.catalogo__grid, loading && styles['catalogo__grid--loading'])}>
              {produtos.map((produto, i) => (
                <ProductCard key={produto.id ?? i} produto={produto} animateDelay={String((i % 3) * 0.1)} />
              ))}
            </div>
          ) : (
            <p className={styles.catalogo__empty}>Nenhum produto encontrado para os filtros selecionados.</p>
          )}

          {paginacao.length > 1 && (
            <nav className={styles.catalogo__pagination} aria-label="Paginação de produtos">
              {paginacao.map((pagina) =>
                pagina.ativa ? (
                  <span
                    key={pagina.numero}
                    className={clsx(styles.catalogo__pageLink, styles['catalogo__pageLink--active'])}
                    aria-current="page"
                  >
                    {String(pagina.numero).padStart(2, '0')}
                  </span>
                ) : (
                  <button
                    key={pagina.numero}
                    type="button"
                    onClick={() => irParaPagina(pagina.numero)}
                    className={styles.catalogo__pageLink}
                  >
                    {String(pagina.numero).padStart(2, '0')}
                  </button>
                )
              )}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
