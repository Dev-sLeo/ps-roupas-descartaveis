import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { IconMail, IconLinkedin, IconShareWhatsapp, IconShareFacebook } from '../../../../icons';
import { htmlContent } from '../../../../utils';
import { SinglePostProps } from './types';

export default function Post({ data, categoria, titulo, imagem, conteudo, compartilhar }: SinglePostProps) {
  return (
    <article className={styles.post}>
      <header className={styles.post__header}>
        <div className={styles.post__headerContainer} data-animate="fade-up">
          {(data || categoria) && (
            <p className={styles.post__meta}>
              {data}
              {data && categoria && <span className={styles.post__metaDot}>•</span>}
              {categoria}
            </p>
          )}
          {titulo && <h1 className={styles.post__title}>{titulo}</h1>}

          {compartilhar && (
            <div className={styles.post__share}>
              <span>Compartilhe</span>
              <div className={styles.post__shareIcons}>
                <a href={compartilhar.email} aria-label="Compartilhar por e-mail">
                  <IconMail />
                </a>
                <a href={compartilhar.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn">
                  <IconLinkedin />
                </a>
                <a href={compartilhar.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">
                  <IconShareWhatsapp />
                </a>
                <a href={compartilhar.facebook} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook">
                  <IconShareFacebook />
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className={styles.post__container}>
        {imagem && (
          <div className={styles.post__media} data-animate="fade-up">
            <SmartImage image={imagem} className={styles.post__image} loading="eager" fetchpriority="high" />
          </div>
        )}

        {conteudo && <div className={styles.post__content} data-animate="fade-up" {...htmlContent(conteudo)} />}
      </div>
    </article>
  );
}
