export interface CarrinhoItem {
  key: string;
  nome: string;
  variacaoTexto?: string;
  imagem?: { url: string; alt: string } | null;
  quantidade: number;
  pecasPorPacote?: number;
}

export interface ItensProps {
  itens?: CarrinhoItem[];
}
