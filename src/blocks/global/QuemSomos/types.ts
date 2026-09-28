import type { AcfImage, AcfLink } from '../../../utils';

export interface QuemSomosProps {
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  badge1?: string;
  badge2?: string;
  botao?: AcfLink | null;
  imagem?: AcfImage | null;
  videoTitulo?: string;
  videoDescricao?: string;
  videoUrl?: string;
  videoTeaserEmpilhado?: boolean;
}
