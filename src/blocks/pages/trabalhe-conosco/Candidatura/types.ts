import type { AcfImage } from '../../../../utils';

export interface CandidaturaProps {
  titulo?: string;
  descricao?: string;
  imagem?: AcfImage | null;
  formTitulo?: string;
  formHtml?: string;
}
