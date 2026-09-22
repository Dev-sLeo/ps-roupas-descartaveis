export interface ButtonProps {
  label: string;
  url?: string;
  target?: string;
  variant?: 'primary' | 'dark' | 'outline' | 'translucent';
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
}
