declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '@splidejs/react-splide' {
  import { ComponentType, ReactNode } from 'react';
  import { Options } from '@splidejs/splide';

  export interface SplideProps {
    options?: Options & { autoScroll?: { speed?: number; pauseOnHover?: boolean; pauseOnFocus?: boolean } };
    extensions?: Record<string, unknown>;
    className?: string;
    children?: ReactNode;
  }

  export interface SplideSlideProps {
    className?: string;
    children?: ReactNode;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
  export const SplideTrack: ComponentType<{ children?: ReactNode }>;
}

declare module '@splidejs/react-splide/css/core' {}
