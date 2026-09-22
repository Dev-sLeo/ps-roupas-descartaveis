import type { AcfImage, AcfLink } from '../../../utils';

export interface HeaderMenuItem {
  label: string;
  url: string;
  current?: boolean;
  children?: HeaderMenuItem[];
}

export interface HeaderSocial {
  network: string;
  url: string;
}

export interface HeaderProps {
  logo?: AcfImage | null;
  homeUrl?: string;
  phone?: string;
  whatsapp?: string;
  // Mesmo campo do repeater `footer.email` — reaproveitado aqui no topo do Header (ver render.php).
  email?: string;
  cartUrl?: AcfLink | null;
  // Mesmo shape do repeater `footer.redes_sociais` — reaproveitado aqui no topo do Header (ver render.php).
  social?: HeaderSocial[];
  menu?: HeaderMenuItem[];
}
