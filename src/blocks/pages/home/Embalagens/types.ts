import type { AcfImage, AcfLink } from '../../../../utils';

export interface EmbalagensDestaque {
  titulo: string;
  texto: string;
}

export interface EmbalagensProps {
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  imagem?: AcfImage | null;
  destaques?: EmbalagensDestaque[];
  botao?: AcfLink | null;
}
