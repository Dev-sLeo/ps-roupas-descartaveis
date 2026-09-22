export interface CertificadoCategoria {
  nome: string;
}

export interface CertificadoDocumento {
  titulo: string;
  categoria: string;
  descricao: string;
  arquivo?: string;
}

export interface CertificadosProps {
  titulo?: string;
  descricao?: string;
  categorias?: CertificadoCategoria[];
  documentos?: CertificadoDocumento[];
}
