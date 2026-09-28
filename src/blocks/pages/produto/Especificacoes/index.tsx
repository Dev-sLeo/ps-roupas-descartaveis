import { useState } from 'react';
import clsx from 'clsx';
import styles from './style.module.scss';
import { IconDownload } from '../../../../icons';
import { htmlContent } from '../../../../utils';
import { EspecificacoesProps } from './types';

type Aba = 'especificacoes' | 'caracteristicas';

export default function Especificacoes({ especificacoes, caracteristicas, fichaTecnicaUrl }: EspecificacoesProps) {
  const [aba, setAba] = useState<Aba>('especificacoes');

  if (!especificacoes && !caracteristicas) return null;

  const conteudo = aba === 'especificacoes' ? especificacoes : caracteristicas;

  return (
    <section id="produto-especificacoes" className={styles.especificacoes}>
      <div className={styles.especificacoes__container}>
        <div className={styles.especificacoes__tabs} role="tablist">
          {especificacoes && (
            <button
              type="button"
              role="tab"
              aria-selected={aba === 'especificacoes'}
              className={clsx(styles.especificacoes__tab, aba === 'especificacoes' && styles['especificacoes__tab--active'])}
              onClick={() => setAba('especificacoes')}
            >
              Especificações
            </button>
          )}
          {caracteristicas && (
            <button
              type="button"
              role="tab"
              aria-selected={aba === 'caracteristicas'}
              className={clsx(styles.especificacoes__tab, aba === 'caracteristicas' && styles['especificacoes__tab--active'])}
              onClick={() => setAba('caracteristicas')}
            >
              Característica do produto
            </button>
          )}
        </div>

        {conteudo && <div className={styles.especificacoes__content} {...htmlContent(conteudo)} />}

        {fichaTecnicaUrl && (
          <a href={fichaTecnicaUrl} download className={styles.especificacoes__download}>
            <IconDownload />
            <span>Baixar ficha técnica</span>
          </a>
        )}
      </div>
    </section>
  );
}
