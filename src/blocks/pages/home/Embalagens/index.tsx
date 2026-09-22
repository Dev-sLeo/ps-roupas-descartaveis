import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import DestaqueCard from '../../../../components/DestaqueCard';
import { IconHeart } from '../../../../icons';
import { hasItems, linkProps } from '../../../../utils';
import { EmbalagensProps } from './types';

export default function Embalagens({ eyebrow, titulo, descricao, imagem, destaques = [], botao }: EmbalagensProps) {
  const cta = linkProps(botao);

  return (
    <section className={styles.embalagens}>
      <div className={styles.embalagens__container}>
        {imagem && (
          <div className={styles.embalagens__media} data-animate="fade-right">
            <SmartImage image={imagem} className={styles.embalagens__image} />
          </div>
        )}

        <div className={styles.embalagens__content} data-animate="fade-left" data-animate-delay="0.15">
          <div className={styles.embalagens__heading}>
            {eyebrow && <p className={styles.embalagens__eyebrow}>{eyebrow}</p>}
            {titulo && <h2 className={styles.embalagens__title}>{titulo}</h2>}
            {descricao && <p className={styles.embalagens__description}>{descricao}</p>}
          </div>

          {hasItems(destaques) && (
            <div className={styles.embalagens__destaques}>
              {destaques.map((destaque, i) => (
                <DestaqueCard
                  key={i}
                  icon={<IconHeart />}
                  titulo={destaque.titulo}
                  texto={destaque.texto}
                  variant="spacious"
                />
              ))}
            </div>
          )}

          {cta && (
            <a {...cta} className={styles.embalagens__cta}>
              {botao!.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
