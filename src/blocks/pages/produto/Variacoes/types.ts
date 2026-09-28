import type { AcfImage } from '../../../../utils';

export interface VariationAttributeOption {
  value: string;
  label: string;
  hex?: string | null;
}

export interface VariationAttribute {
  key: string;
  label: string;
  isCores: boolean;
  options: VariationAttributeOption[];
}

export interface ProductVariation {
  id: number;
  attributes: Record<string, string>;
  priceHtml: string;
  inStock: boolean;
  imagem: AcfImage | null;
}

export interface VariacoesProps {
  productId?: number;
  attributes?: VariationAttribute[];
  variations?: ProductVariation[];
  pecasPorPacote?: number;
  ctaLabel?: string;
  whatsappHref?: string;
}
