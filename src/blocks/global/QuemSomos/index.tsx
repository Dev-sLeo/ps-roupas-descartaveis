import styles from './style.module.scss';
import SmartImage from '../../../components/SmartImage';
import DestaqueCard from '../../../components/DestaqueCard';
import { IconFavourite, IconUserGroup03, IconPlaySquare } from '../../../icons';
import { linkProps, htmlContent } from '../../../utils';
import { QuemSomosProps } from './types';

export default function QuemSomos({
  eyebrow,
  titulo,
  descricao,
  badge1,
  badge2,
  botao,
  imagem,
  videoTitulo,
  videoDescricao,
  videoUrl,
}: QuemSomosProps) {
  const cta = linkProps(botao);

  return (
    <section className={styles.quemSomos}>
      <div className={styles.quemSomos__container}>
        <div className={styles.quemSomos__content} data-animate="fade-right">
          <div className={styles.quemSomos__heading}>
            {eyebrow && <p className={styles.quemSomos__eyebrow}>{eyebrow}</p>}
            {titulo && <h2 className={styles.quemSomos__title}>{titulo}</h2>}
          </div>
          {descricao && <div className={styles.quemSomos__description} {...htmlContent(descricao)} />}

          {(badge1 || badge2) && (
            <div className={styles.quemSomos__badges}>
              {badge1 && <DestaqueCard icon={<IconFavourite />} titulo={badge1} />}
              {badge2 && <DestaqueCard icon={<IconUserGroup03 />} titulo={badge2} />}
            </div>
          )}

          {cta && (
            <a {...cta} className={styles.quemSomos__cta}>
              {botao!.label}
            </a>
          )}
        </div>

        <div className={styles.quemSomos__media} data-animate="fade-left" data-animate-delay="0.15">
          {imagem && <SmartImage image={imagem} className={styles.quemSomos__image} />}

          {(videoTitulo || videoDescricao) && (
            <a
              href={videoUrl || '#'}
              target={videoUrl ? '_blank' : undefined}
              rel={videoUrl ? 'noopener noreferrer' : undefined}
              className={styles.quemSomos__videoTeaser}
            >
              <span className={styles.quemSomos__videoIcon}>
                <IconPlaySquare />
              </span>
              <span className={styles.quemSomos__videoInfo}>
                {videoTitulo && <strong>{videoTitulo}</strong>}
                {videoDescricao && <span>{videoDescricao}</span>}
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
