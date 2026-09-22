import type { AcfImage, AcfLink } from '../../../../utils';

export interface HeroSlide {
  background?: AcfImage | null;
  backgroundMobile?: AcfImage | null;
  titulo?: string;
  descricao?: string;
  cta1?: AcfLink | null;
  cta2?: AcfLink | null;
}

export interface HeroProps {
  slides?: HeroSlide[];
}
