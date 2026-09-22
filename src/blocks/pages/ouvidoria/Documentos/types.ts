export interface DocumentoArquivo {
  url: string;
  nome: string;
}

export interface DocumentoItem {
  categoria: string;
  nome: string;
  descricao: string;
  arquivo?: DocumentoArquivo | null;
}

export interface DocumentosProps {
  titulo?: string;
  descricao?: string;
  itens?: DocumentoItem[];
}
