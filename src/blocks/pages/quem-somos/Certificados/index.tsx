import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { hasItems } from '../../../../utils';
import { CertificadosProps } from './types';

export default function Certificados({ eyebrow, titulo, descricao, imagens = [], background }: CertificadosProps) {
  return (
    <section className={styles.certificados}>
      {background && <img src={background} alt="" aria-hidden="true" className={styles.certificados__background} loading="lazy" />}

      <div className={styles.certificados__container}>
        <div className={styles.certificados__heading} data-animate="fade-right">
          {eyebrow && <p className={styles.certificados__eyebrow}>{eyebrow}</p>}
          {titulo && <h2 className={styles.certificados__title}>{titulo}</h2>}
          {descricao && <p className={styles.certificados__description}>{descricao}</p>}
        </div>

        {hasItems(imagens) && (
          <div className={styles.certificados__gallery} data-animate="fade-left" data-animate-delay="0.15">
            {imagens.map(
              (item, i) =>
                item.imagem && (
                  <div key={i} className={styles.certificados__item}>
                    <SmartImage image={item.imagem} className={styles.certificados__image} />
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
