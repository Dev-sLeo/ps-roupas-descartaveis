import type { PillTabItem } from '../../../components/PillTabs/types';

export interface HeroToggleProps {
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  tabs?: PillTabItem[];
  patternLeft?: string;
  patternRight?: string;
}
