import styles from './style.module.scss';
import { IconPhone, IconWhatsapp, IconMapPin, IconClock, IconMail } from '../../../../icons';
import { htmlContent } from '../../../../utils';
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
  const canais = [
    telefone && { icon: <IconPhone />, texto: telefone },
    whatsapp && { icon: <IconWhatsapp />, texto: whatsapp },
    endereco && { icon: <IconMapPin />, texto: endereco },
    horario && { icon: <IconClock />, texto: horario },
    email && { icon: <IconMail />, texto: email },
  ].filter((item): item is { icon: JSX.Element; texto: string } => Boolean(item));

  return (
    <section className={styles.formulario}>
      <div className={styles.formulario__container}>
        <div className={styles.formulario__info} data-animate="fade-right">
          {titulo && <h2 className={styles.formulario__title}>{titulo}</h2>}
          {descricao && <p className={styles.formulario__description}>{descricao}</p>}

          {canais.length > 0 && (
            <ul className={styles.formulario__canais}>
              {canais.map((canal, i) => (
                <li key={i} className={styles.formulario__canal}>
                  <span className={styles.formulario__canalIcon}>{canal.icon}</span>
                  <span>{canal.texto}</span>
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
