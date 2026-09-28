import { useState } from 'react';
import styles from './style.module.scss';
import PillTabs from '../../../components/PillTabs';
import { HeroToggleProps } from './types';

/**
 * Switcher do hero (Fale Conosco/Ouvidoria) — cada aba pode navegar pra outra
 * página (`href`, comportamento original) OU trocar conteúdo na MESMA página
 * (sem `href`): nesse caso o componente guarda o estado local e dispara
 * `tabEvent` (CustomEvent no `window`) com `{ tab: key }` — os módulos de
 * conteúdo abaixo (roots React separados) escutam esse evento pra se mostrar/
 * esconder (ver src/blocks/pages/contato/Formulario e .../Ouvidoria).
 */
export default function HeroToggle({
  eyebrow,
  titulo,
  descricao,
  tabs = [],
  tabEvent = 'hero-toggle:tab',
  patternLeft,
  patternRight,
}: HeroToggleProps) {
  const [active, setActive] = useState(() => tabs.find((tab) => tab.active)?.key ?? tabs[0]?.key);

  const items = tabs.map((tab) =>
    tab.href
      ? { label: tab.label, active: tab.active, href: tab.href }
      : {
          label: tab.label,
          active: tab.key === active,
          onClick: () => {
            setActive(tab.key);
            window.dispatchEvent(new CustomEvent(tabEvent, { detail: { tab: tab.key } }));
          },
        }
  );

  return (
    <section className={styles.hero}>
      {patternLeft && <img src={patternLeft} alt="" aria-hidden="true" className={`${styles.hero__pattern} ${styles['hero__pattern--left']}`} loading="lazy" />}
      {patternRight && <img src={patternRight} alt="" aria-hidden="true" className={`${styles.hero__pattern} ${styles['hero__pattern--right']}`} loading="lazy" />}

      <div className={styles.hero__container}>
        <div className={styles.hero__content} data-animate="fade-up">
          {eyebrow && <p className={styles.hero__eyebrow}>{eyebrow}</p>}
          {titulo && <h1 className={styles.hero__title}>{titulo}</h1>}
          {descricao && <p className={styles.hero__description}>{descricao}</p>}
        </div>
      </div>

      {items.length > 0 && <PillTabs className={styles.hero__tabs} items={items} />}
    </section>
  );
}
