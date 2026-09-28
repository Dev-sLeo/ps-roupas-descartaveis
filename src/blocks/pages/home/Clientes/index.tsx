import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { IconArrowLeft, IconArrowRight } from '../../../../icons';
import { hasItems } from '../../../../utils';
import { ClientesProps } from './types';

export default function Clientes({ titulo, descricao, logos = [] }: ClientesProps) {
  return (
    <section className={styles.clientes}>
      <div className={styles.clientes__container}>
        <div className={styles.clientes__heading} data-animate="fade-up">
          <p className={styles.clientes__eyebrow}>Clientes</p>
          {titulo && <h2 className={styles.clientes__title}>{titulo}</h2>}
          {descricao && <p className={styles.clientes__description}>{descricao}</p>}
        </div>

        {hasItems(logos) && (
          <>
            <button type="button" className={`${styles.clientes__navBtn} ${styles.clientes__navPrev}`} aria-label="Anterior">
              <IconArrowLeft />
            </button>

            <div className={styles.clientes__pagination} />

            <button type="button" className={`${styles.clientes__navBtn} ${styles.clientes__navNext}`} aria-label="Próximo">
              <IconArrowRight />
            </button>

            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{ prevEl: `.${styles.clientes__navPrev}`, nextEl: `.${styles.clientes__navNext}` }}
              pagination={{ clickable: true, el: `.${styles.clientes__pagination}` }}
              loop={logos.length > 1}
              slidesPerView={1}
              spaceBetween={14}
              breakpoints={{
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
              className={styles.clientes__swiper}
              data-animate="fade-up"
              data-animate-delay="0.15"
            >
              {logos.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className={styles.clientes__logoBox}>
                    {item.logo ? (
                      <SmartImage image={item.logo} className={styles.clientes__logo} />
                    ) : (
                      <span className={styles.clientes__logoPlaceholder}>Cliente {i + 1}</span>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>
    </section>
  );
}
