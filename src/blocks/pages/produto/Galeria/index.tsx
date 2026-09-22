import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import ImageLightbox from '../../../../components/ImageLightbox';
import { IconArrowLeft, IconArrowRight } from '../../../../icons';
import { hasItems } from '../../../../utils';
import { GaleriaProps } from './types';

export default function Galeria({ imagens = [] }: GaleriaProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!hasItems(imagens)) return null;

  return (
    <section className={styles.galeria}>
      <div className={styles.galeria__container}>
        <h2 className={styles.galeria__title} data-animate="fade-up">
          Galeria
        </h2>

        <button type="button" className={`${styles.galeria__navBtn} ${styles.galeria__navPrev}`} aria-label="Anterior">
          <IconArrowLeft />
        </button>

        <div className={styles.galeria__pagination} />

        <button type="button" className={`${styles.galeria__navBtn} ${styles.galeria__navNext}`} aria-label="Próximo">
          <IconArrowRight />
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{ prevEl: `.${styles.galeria__navPrev}`, nextEl: `.${styles.galeria__navNext}` }}
          pagination={{ clickable: true, el: `.${styles.galeria__pagination}` }}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={styles.galeria__swiper}
          data-animate="fade-up"
          data-animate-delay="0.15"
        >
          {imagens.map((imagem, i) => (
            <SwiperSlide key={i}>
              <button type="button" className={styles.galeria__item} onClick={() => setLightboxIndex(i)} aria-label="Ampliar imagem">
                <SmartImage image={imagem} className={styles.galeria__image} />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox images={imagens} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </section>
  );
}
