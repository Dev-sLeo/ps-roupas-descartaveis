import clsx from 'clsx';
import styles from './style.module.scss';
import { ButtonProps } from './types';

export default function Button({
  label,
  url,
  target,
  variant = 'primary',
  type = 'button',
  onClick,
  className,
}: ButtonProps) {
  const cls = clsx(styles.btn, styles[`btn--${variant}`], className);

  if (url) {
    return (
      <a
        href={url}
        className={cls}
        {...(target ? { target, rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {label}
    </button>
  );
}
