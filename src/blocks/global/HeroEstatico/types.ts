import type { AcfImage, AcfLink } from '../../../utils';

export interface HeroProps {
  background?: AcfImage | null;
  backgroundMobile?: AcfImage | null;
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  cta1?: AcfLink | null;
  cta2?: AcfLink | null;
}
