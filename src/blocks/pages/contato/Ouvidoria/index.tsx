import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './style.module.scss';
import { IconPhoneCheck, IconWhatsappOutline, IconMail, IconClock } from '../../../../icons';
import { whatsappHref } from '../../../../utils';
import { ContatoOuvidoriaProps } from './types';

/**
 * Conteúdo da aba "Ouvidoria" do switcher do hero da página Contato (ver
 * blocks/pages/contato/hero e src/blocks/global/HeroToggle) — a página
 * Ouvidoria separada não é mais usada, este módulo é a versão que morava lá
 * (blocks/pages/ouvidoria/contato), só que escondido/mostrado via JS em vez
 * de navegação. Fica escondido via CSS (não desmontado) pra preservar o
 * texto digitado no form da aba "Fale Conosco" ao trocar de aba.
 */
export default function Ouvidoria({ titulo, descricao, telefone, whatsapp, email, horario }: ContatoOuvidoriaProps) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoTrocarAba = (e: Event) => {
      setVisivel((e as CustomEvent<{ tab?: string }>).detail?.tab === 'ouvidoria');
    };
    window.addEventListener('contato:tab', aoTrocarAba);
    return () => window.removeEventListener('contato:tab', aoTrocarAba);
  }, []);

  return (
    <section className={clsx(styles.contato, !visivel && 'proseg-hidden')}>
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
