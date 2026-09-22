import type { AcfImage } from '../../../../utils';

export interface Compartilhar {
  email: string;
  linkedin: string;
  whatsapp: string;
  facebook: string;
}

export interface SinglePostProps {
  data?: string;
  categoria?: string;
  titulo?: string;
  imagem?: AcfImage | null;
  conteudo?: string;
  compartilhar?: Compartilhar;
}
