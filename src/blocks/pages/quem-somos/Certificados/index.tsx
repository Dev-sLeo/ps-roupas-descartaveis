import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { IconArrowLeft, IconArrowRight } from '../../../../icons';
import { hasItems } from '../../../../utils';
import { CertificadosProps } from './types';

export default function Certificados({ eyebrow, titulo, descricao, imagens = [], background }: CertificadosProps) {
  const itens = imagens.filter((item) => item.imagem);

  return (
    <section className={styles.certificados}>
      {background && <img src={background} alt="" aria-hidden="true" className={styles.certificados__background} loading="lazy" />}

      <div className={styles.certificados__container}>
        <div className={styles.certificados__heading} data-animate="fade-right">
          {eyebrow && <p className={styles.certificados__eyebrow}>{eyebrow}</p>}
          {titulo && <h2 className={styles.certificados__title}>{titulo}</h2>}
          {descricao && <p className={styles.certificados__description}>{descricao}</p>}

          {hasItems(itens) && (
            <div className={styles.certificados__nav}>
              <button type="button" className={`${styles.certificados__navBtn} ${styles.certificados__navPrev}`} aria-label="Anterior">
                <IconArrowLeft />
              </button>

              <div className={styles.certificados__pagination} />

              <button type="button" className={`${styles.certificados__navBtn} ${styles.certificados__navNext}`} aria-label="Próximo">
                <IconArrowRight />
              </button>
            </div>
          )}
        </div>

        {hasItems(itens) && (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{ prevEl: `.${styles.certificados__navPrev}`, nextEl: `.${styles.certificados__navNext}` }}
            pagination={{ clickable: true, el: `.${styles.certificados__pagination}` }}
            loop={itens.length > 1}
            slidesPerView="auto"
            spaceBetween={20}
            className={styles.certificados__gallery}
            data-animate="fade-left"
            data-animate-delay="0.15"
          >
            {itens.map((item, i) => (
              <SwiperSlide key={i}>
                <div className={styles.certificados__item}>
                  <SmartImage image={item.imagem!} className={styles.certificados__image} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
