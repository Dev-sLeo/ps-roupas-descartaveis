import clsx from 'clsx';
import styles from './style.module.scss';
import { DestaqueCardProps } from './types';

export default function DestaqueCard({ icon, titulo, texto, variant = 'default' }: DestaqueCardProps) {
  return (
    <div className={clsx(styles.destaqueCard, variant !== 'default' && styles[`destaqueCard--${variant}`])}>
      <span className={styles.destaqueCard__icon}>{icon}</span>
      <div className={styles.destaqueCard__body}>
        <p className={styles.destaqueCard__title}>{titulo}</p>
        {texto && <p className={styles.destaqueCard__text}>{texto}</p>}
      </div>
    </div>
  );
}
