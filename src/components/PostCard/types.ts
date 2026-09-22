import type { AcfImage } from '../../utils';

export interface Post {
  titulo: string;
  excerpt: string;
  categoria: string;
  url: string;
  imagem?: AcfImage | null;
}

export interface PostCardProps {
  post: Post;
  animateDelay?: string;
}
