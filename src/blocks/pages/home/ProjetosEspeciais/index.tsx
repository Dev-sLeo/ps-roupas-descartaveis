import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { hasItems } from '../../../../utils';
import { ProjetosEspeciaisProps } from './types';

export default function ProjetosEspeciais({ eyebrow, titulo, descricao, galeria = [] }: ProjetosEspeciaisProps) {
  return (
    <section className={styles.projetos}>
      <div className={styles.projetos__container}>
        <div className={styles.projetos__heading} data-animate="fade-up">
          {eyebrow && <p className={styles.projetos__eyebrow}>{eyebrow}</p>}
          {titulo && <h2 className={styles.projetos__title}>{titulo}</h2>}
          {descricao && <p className={styles.projetos__description}>{descricao}</p>}
        </div>

        {hasItems(galeria) && (
          <div className={styles.projetos__gallery} data-animate="fade-up" data-animate-delay="0.15">
            {galeria.map(
              (item, i) =>
                item.imagem && (
                  <div key={i} className={styles.projetos__galleryItem}>
                    <SmartImage image={item.imagem} className={styles.projetos__galleryImage} />
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
