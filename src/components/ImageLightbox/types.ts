import type { AcfImage } from '../../utils';

export interface ImageLightboxProps {
  images: (AcfImage | null | undefined)[];
  initialIndex?: number;
  onClose: () => void;
}
