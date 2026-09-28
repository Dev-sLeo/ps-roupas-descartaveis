import { AcfImage } from '../../utils';

export interface Produto {
  id?: number;
  imagem?: AcfImage | null;
  nome: string;
  url?: string;
}

export interface ProductCardProps {
  produto: Produto;
  animateDelay?: string;
  variant?: 'default' | 'home';
}
