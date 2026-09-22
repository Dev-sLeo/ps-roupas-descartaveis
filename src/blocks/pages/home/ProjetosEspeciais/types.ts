import type { AcfImage } from '../../../../utils';

export interface GaleriaItem {
  imagem?: AcfImage | null;
}

export interface ProjetosEspeciaisProps {
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  galeria?: GaleriaItem[];
}
