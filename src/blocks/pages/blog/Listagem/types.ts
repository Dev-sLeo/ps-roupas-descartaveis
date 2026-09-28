import type { Post } from '../../../../components/PostCard/types';

export interface BlogCategoria {
  nome: string;
  slug: string;
  ativa: boolean;
}

export interface BlogPagina {
  numero: number;
  ativa: boolean;
}

export interface ListagemProps {
  categorias?: BlogCategoria[];
  posts?: Post[];
  paginacao?: BlogPagina[];
  total?: number;
  arquivoUrl?: string;
}
