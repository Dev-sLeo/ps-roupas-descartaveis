import type { AcfLink } from '../../../../utils';

export interface VagaItem {
  titulo: string;
  descricao: string;
  link: AcfLink;
}

export interface VagasProps {
  titulo?: string;
  descricao?: string;
  vagas?: VagaItem[];
}
