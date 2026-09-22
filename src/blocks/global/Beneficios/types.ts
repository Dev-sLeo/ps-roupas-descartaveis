import type { AcfImage } from '../../../utils';

export interface BeneficioItem {
  icone?: AcfImage | null;
  titulo: string;
  texto: string;
}

export interface BeneficiosProps {
  titulo?: string;
  descricao?: string;
  items?: BeneficioItem[];
}
