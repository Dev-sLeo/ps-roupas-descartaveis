import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import styles from './style.module.scss';
import { IconClose, IconArrowLeft, IconArrowRight } from '../../icons';
import { imgProps, isAcfImage, useLockScroll } from '../../utils';
import { ImageLightboxProps } from './types';

export default function ImageLightbox({ images, initialIndex = 0, onClose }: ImageLightboxProps) {
  const [prevClass] = useState(() => `lightbox-prev-${Math.random().toString(36).slice(2)}`);
  const [nextClass] = useState(() => `lightbox-next-${Math.random().toString(36).slice(2)}`);
  const [paginationClass] = useState(() => `lightbox-pagination-${Math.random().toString(36).slice(2)}`);
  const swiperRef = useRef<SwiperClass | null>(null);

  const validas = images.filter(isAcfImage);

  useLockScroll(true);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (validas.length === 0) return null;

  const zoomIn = () => swiperRef.current?.zoom.in();
  const zoomOut = () => swiperRef.current?.zoom.out();

  return createPortal(
    <div className={styles.lightbox} role="dialog" aria-modal="true">
      <button type="button" className={styles.lightbox__close} onClick={onClose} aria-label="Fechar galeria">
        <IconClose />
      </button>

      <button type="button" className={`${styles.lightbox__nav} ${styles['lightbox__nav--prev']} ${prevClass}`} aria-label="Imagem anterior">
        <IconArrowLeft />
      </button>
      <button type="button" className={`${styles.lightbox__nav} ${styles['lightbox__nav--next']} ${nextClass}`} aria-label="Próxima imagem">
        <IconArrowRight />
      </button>

      <div className={styles.lightbox__frame} onClick={(e) => e.stopPropagation()}>
        <Swiper
          modules={[Navigation, Pagination, Zoom]}
          navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
          pagination={{ type: 'fraction', el: `.${paginationClass}` }}
          zoom={{ maxRatio: 3, minRatio: 1 }}
          loop={validas.length > 1}
          initialSlide={initialIndex}
          autoHeight
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className={styles.lightbox__swiper}
        >
          {validas.map((imagem, i) => {
            const props = imgProps(imagem);
            return (
              <SwiperSlide key={i} className={styles.lightbox__slide} zoom>
                {props && <img {...props} className={styles.lightbox__image} />}
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className={styles.lightbox__toolbar}>
          <div className={`${styles.lightbox__pagination} ${paginationClass}`} />

          <div className={styles.lightbox__zoomControls}>
            <button type="button" className={styles.lightbox__zoomBtn} onClick={zoomOut} aria-label="Diminuir zoom">
              −
            </button>
            <button type="button" className={styles.lightbox__zoomBtn} onClick={zoomIn} aria-label="Aumentar zoom">
              +
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
