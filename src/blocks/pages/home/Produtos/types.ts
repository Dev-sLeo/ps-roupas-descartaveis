import type { AcfLink } from '../../../../utils';
import type { Produto } from '../../../../components/ProductCard/types';

export interface ProdutosProps {
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  produtos?: Produto[];
  botao?: AcfLink | null;
}
