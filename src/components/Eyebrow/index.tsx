import clsx from 'clsx';
import styles from './style.module.scss';
import { EyebrowProps } from './types';

export default function Eyebrow({ text, variant = 'light', className }: EyebrowProps) {
  return (
    <div className={clsx(styles.eyebrow, styles[`eyebrow--${variant}`], className)}>
      <span className={styles.eyebrow__text}>{text}</span>
    </div>
  );
}
