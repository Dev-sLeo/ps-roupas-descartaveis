export interface EyebrowProps {
  text: string;
  /** `dark` — texto branco, para uso sobre fundo escuro/imagem. `light` — texto azul, sobre fundo claro. */
  variant?: 'dark' | 'light';
  className?: string;
}
