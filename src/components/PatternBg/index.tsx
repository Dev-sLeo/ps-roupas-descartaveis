import clsx from 'clsx';
import styles from './style.module.scss';
import type { PatternBgProps } from './types';

export default function PatternBg({ src, className }: PatternBgProps) {
  if (!src) return null;

  return (
    <div className={clsx(styles.patternBg, className)} aria-hidden="true">
      <img src={src} alt="" className={styles.patternBg__img} />
    </div>
  );
}
