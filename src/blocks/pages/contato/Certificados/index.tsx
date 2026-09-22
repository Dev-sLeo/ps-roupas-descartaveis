import { useState } from 'react';
import clsx from 'clsx';
import styles from './style.module.scss';
import { IconCheckSquare } from '../../../../icons';
import { hasItems } from '../../../../utils';
import { CertificadosProps } from './types';

export default function Certificados({ titulo, descricao, categorias = [], documentos = [] }: CertificadosProps) {
  const [ativa, setAtiva] = useState(categorias[0]?.nome ?? '');

  const visiveis = hasItems(categorias) ? documentos.filter((doc) => doc.categoria === ativa) : documentos;

  return (
    <section className={styles.certificados}>
      <div className={styles.certificados__container}>
        <div className={styles.certificados__heading} data-animate="fade-up">
          {titulo && <h2 className={styles.certificados__title}>{titulo}</h2>}
          {descricao && <p className={styles.certificados__description}>{descricao}</p>}
        </div>

        {hasItems(categorias) && (
          <div className={styles.certificados__tabs} data-animate="fade-up" data-animate-delay="0.1">
            {categorias.map((categoria, i) => (
              <button
                key={i}
                type="button"
                className={clsx(styles.certificados__tab, categoria.nome === ativa && styles['certificados__tab--active'])}
                onClick={() => setAtiva(categoria.nome)}
              >
                {categoria.nome}
              </button>
            ))}
          </div>
        )}

        {hasItems(visiveis) && (
          <div className={styles.certificados__grid}>
            {visiveis.map((doc, i) => (
              <article
                key={i}
                className={styles.certificados__card}
                data-animate="fade-up"
                data-animate-delay={String((i % 3) * 0.1)}
              >
                <IconCheckSquare />
                <div className={styles.certificados__cardBody}>
                  {doc.titulo && <p className={styles.certificados__cardTitle}>{doc.titulo}</p>}
                  {doc.descricao && <p className={styles.certificados__cardText}>{doc.descricao}</p>}
                  {doc.arquivo && (
                    <a href={doc.arquivo} target="_blank" rel="noopener noreferrer" className={styles.certificados__cardDownload}>
                      Download
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
