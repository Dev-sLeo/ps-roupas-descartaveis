import type { AcfImage, AcfLink } from '../../../utils';

export interface FooterMenuItem {
  label: string;
  url: string;
}

export interface FooterSocial {
  network: string;
  url: string;
}

export interface FooterProps {
  logo?: AcfImage | null;
  homeUrl?: string;
  menu?: FooterMenuItem[];
  menu2?: FooterMenuItem[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  social?: FooterSocial[];
  copy?: string;
  privacyLink?: AcfLink | null;
  agencyUrl?: string;
}
