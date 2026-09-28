import styles from './style.module.scss';
import { IconPhone, IconWhatsapp, IconMapPin, IconClock, IconMail } from '../../../../icons';
import { htmlContent, whatsappHref } from '../../../../utils';
import { ContatoFormularioProps } from './types';

export default function Formulario({
  titulo,
  descricao,
  telefone,
  whatsapp,
  email,
  endereco,
  horario,
  formTitulo,
  formHtml,
}: ContatoFormularioProps) {
  interface Canal {
    icon: JSX.Element;
    texto: string;
    href?: string;
    external?: boolean;
  }

  const canais: Array<Canal | null> = [
    telefone ? { icon: <IconPhone />, texto: telefone, href: `tel:+55${telefone.replace(/\D/g, '')}`, external: false } : null,
    whatsapp ? { icon: <IconWhatsapp />, texto: whatsapp, href: whatsappHref(whatsapp), external: true } : null,
    endereco ? { icon: <IconMapPin />, texto: endereco, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`, external: true } : null,
    horario ? { icon: <IconClock />, texto: horario } : null,
    email ? { icon: <IconMail />, texto: email, href: `mailto:${email}`, external: false } : null,
  ];

  const canaisAtivos = canais.filter((canal): canal is Canal => canal !== null);

  return (
    <section className={styles.formulario}>
      <div className={styles.formulario__container}>
        <div className={styles.formulario__info} data-animate="fade-right">
          {titulo && <h2 className={styles.formulario__title}>{titulo}</h2>}
          {descricao && <p className={styles.formulario__description}>{descricao}</p>}

          {canaisAtivos.length > 0 && (
            <ul className={styles.formulario__canais}>
              {canaisAtivos.map((canal, i) => (
                <li key={i} className={styles.formulario__canal}>
                  <span className={styles.formulario__canalIcon}>{canal.icon}</span>
                  {canal.href ? (
                    <a href={canal.href} {...(canal.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {canal.texto}
                    </a>
                  ) : (
                    <span>{canal.texto}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {formHtml && (
          <div className={styles.formulario__card} data-animate="fade-left" data-animate-delay="0.15">
            {formTitulo && <p className={styles.formulario__cardTitle}>{formTitulo}</p>}
            <div className={styles.formulario__cf7} {...htmlContent(formHtml)} />
          </div>
        )}
      </div>
    </section>
  );
}
