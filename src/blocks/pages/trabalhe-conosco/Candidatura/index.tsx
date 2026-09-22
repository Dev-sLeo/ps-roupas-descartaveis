import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { htmlContent } from '../../../../utils';
import { CandidaturaProps } from './types';

export default function Candidatura({ titulo, descricao, imagem, formTitulo, formHtml }: CandidaturaProps) {
  return (
    <section id="candidatura" className={styles.candidatura}>
      <div className={styles.candidatura__container}>
        <div className={styles.candidatura__intro} data-animate="fade-right">
          <div className={styles.candidatura__introText}>
            {titulo && <h2 className={styles.candidatura__title}>{titulo}</h2>}
            {descricao && <p className={styles.candidatura__description}>{descricao}</p>}
          </div>

          {imagem && (
            <div className={styles.candidatura__media}>
              <SmartImage image={imagem} className={styles.candidatura__image} />
            </div>
          )}
        </div>

        {formHtml && (
          <div className={styles.candidatura__formCard} data-animate="fade-left" data-animate-delay="0.15">
            {formTitulo && <h3 className={styles.candidatura__formTitle}>{formTitulo}</h3>}
            <div className={styles.candidatura__form} {...htmlContent(formHtml)} />
          </div>
        )}
      </div>
    </section>
  );
}
