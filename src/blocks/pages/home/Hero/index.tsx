import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { IconArrowCircleLeft, IconArrowCircleRight } from '../../../../icons';
import { hasItems, linkProps } from '../../../../utils';
import { HeroProps, HeroSlide } from './types';

function HeroSlideContent({ background, backgroundMobile, titulo, descricao, cta1, cta2 }: HeroSlide) {
  const primary = linkProps(cta1);
  const secondary = linkProps(cta2);

  return (
    <>
      {background && (
        <SmartImage image={background} className={styles.hero__bgDesktop} alt="" loading="eager" fetchpriority="high" />
      )}
      {backgroundMobile && (
        <SmartImage image={backgroundMobile} className={styles.hero__bgMobile} alt="" loading="eager" fetchpriority="high" />
      )}

      <div className={styles.hero__container}>
        <div className={styles.hero__content} data-animate="fade-up">
          {titulo && <h1 className={styles.hero__title}>{titulo}</h1>}
          {descricao && <p className={styles.hero__description}>{descricao}</p>}

          {(primary || secondary) && (
            <div className={styles.hero__actions}>
              {primary && (
                <a {...primary} className={styles.hero__ctaPrimary}>
                  {cta1!.label}
                </a>
              )}
              {secondary && (
                <a {...secondary} className={styles.hero__ctaSecondary}>
                  {cta2!.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Hero({ slides }: HeroProps) {
  if (!hasItems(slides)) return null;

  return (
    <section id="inicio" className={styles.hero}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={slides.length > 1 ? { clickable: true, el: `.${styles.hero__pagination}` } : false}
        navigation={
          slides.length > 1
            ? { prevEl: `.${styles.hero__navPrev}`, nextEl: `.${styles.hero__navNext}` }
            : false
        }
        loop={slides.length > 1}
        speed={700}
        className={styles.hero__swiper}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className={styles.hero__slide}>
            <HeroSlideContent {...slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 && (
        <>
          <button type="button" className={`${styles.hero__nav} ${styles.hero__navPrev}`} aria-label="Slide anterior">
            <IconArrowCircleLeft />
          </button>
          <button type="button" className={`${styles.hero__nav} ${styles.hero__navNext}`} aria-label="Próximo slide">
            <IconArrowCircleRight />
          </button>
          <div className={styles.hero__pagination} />
        </>
      )}
    </section>
  );
}
