import type { Produto } from '../../../../components/ProductCard/types';

export interface CategoriaFiltro {
  slug: string;
  nome: string;
  checked: boolean;
}

export interface PaginaFiltro {
  numero: number;
  ativa: boolean;
}

export interface CatalogoProps {
  categorias?: CategoriaFiltro[];
  destaque?: boolean;
  busca?: string;
  produtos?: Produto[];
  paginacao?: PaginaFiltro[];
  total?: number;
  arquivoUrl?: string;
}
