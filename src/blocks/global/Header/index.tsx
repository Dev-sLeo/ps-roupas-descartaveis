import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './style.module.scss';
import SmartImage from '../../../components/SmartImage';
import { IconPhone, IconWhatsapp, IconMail, IconMenu, IconClose, IconShoppingCart, IconChevronDown, IconLinkedinOutline, IconInstagramOutline } from '../../../icons';
import { linkProps, hasItems, whatsappHref } from '../../../utils';
import { HeaderProps, HeaderMenuItem } from './types';

function SocialIcon({ network }: { network: string }) {
  return network === 'linkedin' ? <IconLinkedinOutline /> : <IconInstagramOutline />;
}

export default function Header({ logo, homeUrl = '/', phone = '', whatsapp = '', email = '', cartUrl, cartCount = 0, social = [], menu = [] }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [topStripHidden, setTopStripHidden] = useState(false);
  const cart = linkProps(cartUrl);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Esconde o top strip ao rolar pra baixo, mostra de novo ao rolar pra cima —
  // some só depois de passar da própria altura dele (evita "tremer" no topo).
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const checkScroll = () => {
      const y = window.scrollY;
      if (y <= lastY || y < 80) {
        setTopStripHidden(false);
      } else if (y > lastY) {
        setTopStripHidden(true);
      }
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function renderNavItem(item: HeaderMenuItem, i: number, onClick?: () => void) {
    const hasChildren = hasItems(item.children);

    return (
      <div key={i} className={styles.header__navItem}>
        <a
          href={item.url}
          className={clsx(styles.header__navLink, item.current && styles['header__navLink--active'])}
          onClick={onClick}
        >
          {item.label}
          {hasChildren && <IconChevronDown />}
        </a>

        {hasChildren && (
          <div className={styles.header__navChildren}>
            {item.children!.map((child, ci) => (
              <a key={ci} href={child.url} className={styles.header__navChildLink} onClick={onClick}>
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <header className={styles.header}>
      {(phone || whatsapp || email || hasItems(social)) && (
        <div className={clsx(styles.header__topStrip, topStripHidden && styles['header__topStrip--hidden'])}>
          <div className={styles.header__topStripInner}>
            {hasItems(social) && (
              <div className={styles.header__topStripSocial}>
                {social.map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.network} className={styles.header__topStripSocialLink}>
                    <SocialIcon network={item.network} />
                  </a>
                ))}
              </div>
            )}

            <div className={styles.header__topStripContacts}>
              {email && (
                <a href={`mailto:${email}`} className={clsx(styles.header__topStripItem, styles['header__topStripItem--emailDesktop'])}>
                  <IconMail />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\D/g, '')}`} className={styles.header__topStripItem}>
                  <IconPhone />
                  <span>{phone}</span>
                </a>
              )}
              {whatsapp && (
                <a href={whatsappHref(whatsapp)} className={styles.header__topStripItem} target="_blank" rel="noopener noreferrer">
                  <IconWhatsapp />
                  <span>{whatsapp}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.header__bar}>
        {logo && (
          <a href={homeUrl} className={styles.header__logoLink} aria-label="Página inicial">
            <SmartImage image={logo} className={styles.header__logo} loading="eager" />
          </a>
        )}

        {hasItems(menu) && (
          <nav className={styles.header__navDesktop}>
            {menu.map((item, i) => renderNavItem(item, i))}
          </nav>
        )}

        <div className={styles.header__actionsDesktop}>
          {cart && (
            <a {...cart} className={styles.header__cart}>
              <IconShoppingCart />
              <span>{cartUrl!.label || 'Meu carrinho'}</span>
              {cartCount > 0 && <span className={styles.header__cartCount}>{cartCount}</span>}
            </a>
          )}
        </div>

        <div className={styles.header__actionsMobile}>
          <button type="button" className={styles.header__cartMobile} aria-label="Carrinho">
            <IconShoppingCart />
            {cartCount > 0 && <span className={styles.header__cartCount}>{cartCount}</span>}
          </button>

          <button
            type="button"
            className={styles.header__toggle}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div className={clsx(styles.header__panel, open && styles['header__panel--open'])}>
        {hasItems(menu) && (
          <nav className={styles.header__nav}>
            {menu.map((item, i) => renderNavItem(item, i, () => setOpen(false)))}
          </nav>
        )}
      </div>
    </header>
  );
}
