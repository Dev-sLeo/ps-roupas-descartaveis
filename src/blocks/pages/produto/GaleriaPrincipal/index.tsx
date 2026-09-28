import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { IconArrowLeft, IconArrowRight } from '../../../../icons';
import { hasItems, type AcfImage } from '../../../../utils';
import { GaleriaPrincipalProps } from './types';

export default function GaleriaPrincipal({ imagens: imagensIniciais = [] }: GaleriaPrincipalProps) {
  const [imagens, setImagens] = useState(imagensIniciais);
  const swiperRef = useRef<SwiperClass | null>(null);

  // Troca a imagem principal quando o bloco `produto-variacoes` (root React
  // separado) avisa que a cor selecionada tem uma foto própria — substitui
  // sempre o 1º slide (a "imagem principal") em vez de inserir mais um item,
  // e leva o slider de volta pra ela.
  useEffect(() => {
    const aoTrocarImagem = (e: Event) => {
      const imagem = (e as CustomEvent<{ imagem?: AcfImage }>).detail?.imagem;
      if (!imagem?.url) return;

      setImagens((atual) => {
        if (atual[0]?.url === imagem.url) return atual;
        return [imagem, ...atual.slice(1)];
      });
      swiperRef.current?.slideTo(0);
    };

    window.addEventListener('produto:variacao-imagem', aoTrocarImagem);
    return () => window.removeEventListener('produto:variacao-imagem', aoTrocarImagem);
  }, []);

  if (!hasItems(imagens)) return null;

  const temMultiplas = imagens.length > 1;

  return (
    <div className={styles.galeriaPrincipal}>
      <Swiper
        modules={[Navigation, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        navigation={
          temMultiplas
            ? { prevEl: `.${styles.galeriaPrincipal__navPrev}`, nextEl: `.${styles.galeriaPrincipal__navNext}` }
            : false
        }
        pagination={temMultiplas ? { el: `.${styles.galeriaPrincipal__pagination}`, clickable: true } : false}
        loop={temMultiplas}
        className={styles.galeriaPrincipal__swiper}
      >
        {imagens.map((imagem, i) => (
          <SwiperSlide key={i} className={styles.galeriaPrincipal__slide}>
            <SmartImage image={imagem} className={styles.galeriaPrincipal__image} loading="eager" fetchpriority={i === 0 ? 'high' : undefined} />
          </SwiperSlide>
        ))}
      </Swiper>

      {temMultiplas && (
        <div className={styles.galeriaPrincipal__controls}>
          <button type="button" className={`${styles.galeriaPrincipal__navBtn} ${styles.galeriaPrincipal__navPrev}`} aria-label="Imagem anterior">
            <IconArrowLeft />
          </button>
          <div className={styles.galeriaPrincipal__pagination} />
          <button type="button" className={`${styles.galeriaPrincipal__navBtn} ${styles.galeriaPrincipal__navNext}`} aria-label="Próxima imagem">
            <IconArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}
