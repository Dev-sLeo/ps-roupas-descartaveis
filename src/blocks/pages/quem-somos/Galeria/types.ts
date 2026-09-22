import type { AcfImage } from '../../../../utils';

export interface GaleriaItem {
  imagem?: AcfImage | null;
}

export interface GaleriaProps {
  titulo?: string;
  descricao?: string;
  imagens?: GaleriaItem[];
}
