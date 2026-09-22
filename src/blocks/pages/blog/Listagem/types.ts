import type { Post } from '../../../../components/PostCard/types';

export interface BlogCategoria {
  nome: string;
  slug: string;
  url: string;
  ativa: boolean;
}

export interface BlogPagina {
  numero: number;
  url: string;
  ativa: boolean;
}

export interface ListagemProps {
  categorias?: BlogCategoria[];
  posts?: Post[];
  paginacao?: BlogPagina[];
}
