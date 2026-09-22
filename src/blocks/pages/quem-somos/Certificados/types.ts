import type { AcfImage } from '../../../../utils';

export interface CertificadoItem {
  imagem?: AcfImage | null;
}

export interface CertificadosProps {
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  imagens?: CertificadoItem[];
  background?: string;
}
