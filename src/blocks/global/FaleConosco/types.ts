import type { AcfLink } from '../../../utils';

export interface FaleConoscoProps {
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  cta1?: AcfLink | null;
  cta2?: AcfLink | null;
  patternLeft?: string;
  patternRight?: string;
}
