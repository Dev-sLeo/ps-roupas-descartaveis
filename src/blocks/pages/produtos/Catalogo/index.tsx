import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './style.module.scss';
import ProductCard, { ProductCardSkeleton } from '../../../../components/ProductCard';
import { IconCheck } from '../../../../icons';
import { submitFiltro } from '../../../../utils/ajaxFiltro';
import { scrollToTarget } from '../../../../animations';
import { hasItems } from '../../../../utils';
import { CatalogoProps, PaginaFiltro } from './types';
import type { Produto } from '../../../../components/ProductCard/types';

interface FiltrarProdutosDetail {
  produtos: Produto[];
  paginacao: PaginaFiltro[];
  total: number;
}

const CATALOGO_ID = 'catalogo-produtos';
const FILTRO_DEBOUNCE_MS = 400;
const PRODUTOS_POR_PAGINA = 9;

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

  // Marcar vários checkboxes rápido não pode disparar uma requisição por clique:
  // as refs guardam sempre o estado mais atual (pra ler no momento do debounce,
  // não o valor "congelado" de quando cada clique aconteceu) e o debounce só
  // dispara a busca depois que os cliques pararem — 1 requisição, com o filtro
  // final já combinado.
  const selecionadasRef = useRef(selecionadas);
  const destacadoRef = useRef(destacadoAtivo);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onLoading = () => setLoading(true);
    const onUpdated = (e: Event) => {
      const detail = (e as CustomEvent<FiltrarProdutosDetail>).detail;
      setProdutos(detail.produtos);
      setPaginacao(detail.paginacao);
      setLoading(false);
      scrollToTarget(CATALOGO_ID);
    };

    window.addEventListener('filtrar_produtos:loading', onLoading);
    window.addEventListener('filtrar_produtos:updated', onUpdated);
    return () => {
      window.removeEventListener('filtrar_produtos:loading', onLoading);
      window.removeEventListener('filtrar_produtos:updated', onUpdated);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const dispararFiltro = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('paged');

    if (selecionadasRef.current.size) {
      params.set('produto_categoria', Array.from(selecionadasRef.current).join(','));
    } else {
      params.delete('produto_categoria');
    }

    if (destacadoRef.current) {
      params.set('produto_destaque', '1');
    } else {
      params.delete('produto_destaque');
    }

    const query = params.toString();
    const url = `${arquivoUrl ?? window.location.pathname}${query ? `?${query}` : ''}`;
    submitFiltro('filtrar_produtos', url);
  };

  const agendarFiltro = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(dispararFiltro, FILTRO_DEBOUNCE_MS);
  };

  const toggleCategoria = (slug: string) => {
    const next = new Set(selecionadas);
    next.has(slug) ? next.delete(slug) : next.add(slug);
    setSelecionadas(next);
    selecionadasRef.current = next;
    agendarFiltro();
  };

  const toggleDestaque = () => {
    const next = !destacadoAtivo;
    setDestacadoAtivo(next);
    destacadoRef.current = next;
    agendarFiltro();
  };

  const irParaPagina = (numero: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('paged', String(numero));
    const query = params.toString();
    const url = `${arquivoUrl ?? window.location.pathname}${query ? `?${query}` : ''}`;
    submitFiltro('filtrar_produtos', url);
  };

  const filtroAtivo = selecionadas.size > 0 || destacadoAtivo;

  const resetarFiltros = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const vazio = new Set<string>();
    setSelecionadas(vazio);
    setDestacadoAtivo(false);
    selecionadasRef.current = vazio;
    destacadoRef.current = false;
    dispararFiltro();
  };

  // Nenhum resultado: descarta também a busca (produto_busca) e a paginação,
  // voltando pra listagem padrão da page Produtos (sem nenhum parâmetro na URL).
  const voltarParaProdutos = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    submitFiltro('filtrar_produtos', arquivoUrl ?? window.location.pathname);
  };

  return (
    <section id={CATALOGO_ID} className={styles.catalogo}>
      <div className={styles.catalogo__container}>
        <aside className={styles.catalogo__sidebar}>
          <div className={styles.catalogo__filterBox}>
            <div className={styles.catalogo__filterHeader}>
              <p className={styles.catalogo__filterTitle}>Categoria</p>

              {filtroAtivo && (
                <button type="button" className={styles.catalogo__resetLink} onClick={resetarFiltros}>
                  Limpar filtros
                </button>
              )}
            </div>

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
          {loading ? (
            <div className={styles.catalogo__grid}>
              {Array.from({ length: produtos.length || PRODUTOS_POR_PAGINA }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : hasItems(produtos) ? (
            <div className={styles.catalogo__grid}>
              {produtos.map((produto, i) => (
                <ProductCard key={produto.id ?? i} produto={produto} animateDelay={String((i % 3) * 0.1)} />
              ))}
            </div>
          ) : (
            <div className={styles.catalogo__emptyState}>
              <p className={styles.catalogo__empty}>Nenhum produto encontrado para os filtros selecionados.</p>
              <button type="button" className={styles.catalogo__emptyReset} onClick={voltarParaProdutos}>
                Ver todos os produtos
              </button>
            </div>
          )}

          {!loading && paginacao.length > 1 && (
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
