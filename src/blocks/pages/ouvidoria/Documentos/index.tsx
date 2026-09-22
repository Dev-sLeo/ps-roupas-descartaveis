import { useMemo, useState } from 'react';
import styles from './style.module.scss';
import PillTabs from '../../../../components/PillTabs';
import { IconCheckSquare } from '../../../../icons';
import { hasItems } from '../../../../utils';
import { DocumentosProps } from './types';

export default function Documentos({ titulo, descricao, itens = [] }: DocumentosProps) {
  const categorias = useMemo(() => {
    const vistas = new Set<string>();
    return itens.reduce<string[]>((lista, item) => {
      if (item.categoria && !vistas.has(item.categoria)) {
        vistas.add(item.categoria);
        lista.push(item.categoria);
      }
      return lista;
    }, []);
  }, [itens]);

  const [categoriaAtiva, setCategoriaAtiva] = useState(categorias[0] ?? '');

  if (!hasItems(itens)) return null;

  const itensFiltrados = categoriaAtiva ? itens.filter((item) => item.categoria === categoriaAtiva) : itens;

  return (
    <section className={styles.documentos}>
      <div className={styles.documentos__container}>
        {(titulo || descricao) && (
          <div className={styles.documentos__heading} data-animate="fade-up">
            {titulo && <h2 className={styles.documentos__title}>{titulo}</h2>}
            {descricao && <p className={styles.documentos__description}>{descricao}</p>}
          </div>
        )}

        {hasItems(categorias) && (
          <PillTabs
            className={styles.documentos__tabs}
            items={categorias.map((categoria) => ({
              label: categoria,
              active: categoria === categoriaAtiva,
              onClick: () => setCategoriaAtiva(categoria),
            }))}
          />
        )}

        <div className={styles.documentos__grid}>
          {itensFiltrados.map((item, i) => (
            <article key={i} className={styles.documentos__card} data-animate="fade-up" data-animate-delay={String((i % 3) * 0.1)}>
              <IconCheckSquare />
              {item.nome && <h3 className={styles.documentos__cardTitle}>{item.nome}</h3>}
              {item.descricao && <p className={styles.documentos__cardText}>{item.descricao}</p>}
              {item.arquivo && (
                <a href={item.arquivo.url} download className={styles.documentos__cardDownload}>
                  Download
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
