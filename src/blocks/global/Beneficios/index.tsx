import styles from './style.module.scss';
import SmartImage from '../../../components/SmartImage';
import { hasItems } from '../../../utils';
import { BeneficiosProps } from './types';

export default function Beneficios({ items = [] }: BeneficiosProps) {
  if (!hasItems(items)) return null;

  return (
    <section className={styles.beneficios}>
      <div className={styles.beneficios__container}>
        {items.map((item, i) => (
          <article key={i} className={styles.beneficios__card} data-animate="fade-up" data-animate-delay={String(i * 0.1)}>
            {item.icone && <SmartImage image={item.icone} className={styles.beneficios__icon} />}
            {item.titulo && <h3 className={styles.beneficios__title}>{item.titulo}</h3>}
            {item.texto && <p className={styles.beneficios__text}>{item.texto}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
