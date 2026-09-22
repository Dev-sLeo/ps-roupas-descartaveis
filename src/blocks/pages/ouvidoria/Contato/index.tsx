import styles from './style.module.scss';
import { IconPhoneCheck, IconWhatsappOutline, IconMail, IconClock } from '../../../../icons';
import { whatsappHref } from '../../../../utils';
import { ContatoProps } from './types';

export default function Contato({ titulo, descricao, telefone, whatsapp, email, horario }: ContatoProps) {
  return (
    <section className={styles.contato}>
      <div className={styles.contato__container}>
        {(titulo || descricao) && (
          <div className={styles.contato__heading} data-animate="fade-up">
            {titulo && <h2 className={styles.contato__title}>{titulo}</h2>}
            {descricao && <p className={styles.contato__description}>{descricao}</p>}
          </div>
        )}

        {(telefone || whatsapp || email) && (
          <div className={styles.contato__cards} data-animate="fade-up" data-animate-delay="0.1">
            {telefone && (
              <a href={`tel:${telefone.replace(/\D/g, '')}`} className={styles.contato__card}>
                <IconPhoneCheck />
                <span>{telefone}</span>
              </a>
            )}
            {whatsapp && (
              <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" className={styles.contato__card}>
                <IconWhatsappOutline />
                <span>{whatsapp}</span>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className={styles.contato__card}>
                <IconMail />
                <span className={styles['contato__cardText--compact']}>{email}</span>
              </a>
            )}
          </div>
        )}

        {horario && (
          <p className={styles.contato__horario} data-animate="fade-up" data-animate-delay="0.2">
            <IconClock />
            <span>{horario}</span>
          </p>
        )}
      </div>
    </section>
  );
}
