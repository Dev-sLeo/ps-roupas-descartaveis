import type { AcfImage } from '../../../../utils';

export interface ClienteLogo {
  logo?: AcfImage | null;
}

export interface ClientesProps {
  titulo?: string;
  descricao?: string;
  logos?: ClienteLogo[];
}
