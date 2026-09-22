import styles from './style.module.scss';
import { IconCheckSquare } from '../../../../icons';
import { hasItems, linkProps } from '../../../../utils';
import { VagasProps } from './types';

export default function Vagas({ titulo, descricao, vagas = [] }: VagasProps) {
  return (
    <section id="vagas" className={styles.vagas}>
      <div className={styles.vagas__container}>
        <div className={styles.vagas__heading} data-animate="fade-up">
          {titulo && <h2 className={styles.vagas__title}>{titulo}</h2>}
          {descricao && <p className={styles.vagas__description}>{descricao}</p>}
        </div>

        {hasItems(vagas) && (
          <div className={styles.vagas__grid}>
            {vagas.map((vaga, i) => {
              const link = linkProps(vaga.link);
              return (
                <article key={i} className={styles.vagas__card} data-animate="fade-up" data-animate-delay={String((i % 3) * 0.1)}>
                  <span className={styles.vagas__icon}>
                    <IconCheckSquare />
                  </span>
                  <div className={styles.vagas__cardBody}>
                    {vaga.titulo && <h3 className={styles.vagas__cardTitle}>{vaga.titulo}</h3>}
                    {vaga.descricao && <p className={styles.vagas__cardText}>{vaga.descricao}</p>}
                    {link && (
                      <a {...link} className={styles.vagas__cardLink}>
                        {vaga.link.label}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
