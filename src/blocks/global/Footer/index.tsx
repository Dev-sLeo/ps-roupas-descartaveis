import styles from './style.module.scss';
import SmartImage from '../../../components/SmartImage';
import { IconLinkedin, IconInstagram, IconPhone, IconWhatsapp, IconMail } from '../../../icons';
import { hasItems, whatsappHref } from '../../../utils';
import { FooterProps } from './types';

function SocialIcon({ network }: { network: string }) {
  return network === 'linkedin' ? <IconLinkedin /> : <IconInstagram />;
}

function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits ? `tel:+55${digits}` : null;
}

export default function Footer({
  logo,
  homeUrl = '/',
  menu = [],
  menu2 = [],
  phone,
  whatsapp,
  email,
  social = [],
  copy,
  privacyLink,
  agencyUrl = 'https://upsites.digital/?origin=proseg',
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__top}>
          <div className={styles.footer__brand}>
            {logo && (
              <a href={homeUrl} className={styles.footer__logoLink} aria-label="Página inicial">
                <SmartImage image={logo} className={styles.footer__logo} />
              </a>
            )}

            {hasItems(social) && (
              <div className={styles.footer__social}>
                {social.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.network}
                    className={styles.footer__socialLink}
                  >
                    <SocialIcon network={item.network} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {hasItems(menu) && (
            <nav className={styles.footer__nav}>
              {menu.map((item, i) => (
                <a key={i} href={item.url} className={styles.footer__navLink}>
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {hasItems(menu2) && (
            <nav className={styles.footer__nav}>
              {menu2.map((item, i) => (
                <a key={i} href={item.url} className={styles.footer__navLink}>
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <div className={styles.footer__contact}>
            {phone && (
              <a href={phoneHref(phone) ?? undefined} className={styles.footer__contactLink}>
                <IconPhone />
                <span>{phone}</span>
              </a>
            )}
            {whatsapp && (
              <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" className={styles.footer__contactLink}>
                <IconWhatsapp />
                <span>{whatsapp}</span>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className={styles.footer__contactLink}>
                <IconMail />
                <span>{email}</span>
              </a>
            )}
          </div>
        </div>

        <div className={styles.footer__divider} />

        <div className={styles.footer__bottom}>
          {copy && <p className={styles.footer__copy}>{copy}</p>}
          {privacyLink?.url && (
            <a
              href={privacyLink.url}
              target={privacyLink.target || undefined}
              rel={privacyLink.target === '_blank' ? 'noopener noreferrer' : undefined}
              className={styles.footer__privacyLink}
            >
              {privacyLink.label || 'Política de privacidade'}
            </a>
          )}
          <p className={styles.footer__credit}>
            Desenvolvido por{' '}
            <a href={agencyUrl} target="_blank" rel="noopener noreferrer" className={styles.footer__creditLink}>
              Upsites
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
