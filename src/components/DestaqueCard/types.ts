import { ReactNode } from 'react';

export interface DestaqueCardProps {
  icon: ReactNode;
  titulo: string;
  texto?: string;
  /** `spacious` usa mais respiro entre ícone e texto (ex: Embalagens). */
  variant?: 'default' | 'spacious';
}
