import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

type AnimationType = 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'reveal-up';

const PRESETS: Record<AnimationType, gsap.TweenVars> = {
  'fade':       { opacity: 0 },
  'fade-up':    { opacity: 0, y: 24 },
  'fade-down':  { opacity: 0, y: -24 },
  'fade-left':  { opacity: 0, x: 24 },
  'fade-right': { opacity: 0, x: -24 },
  'zoom-in':    { opacity: 0, scale: 0.94 },
  'zoom-out':   { opacity: 0, scale: 1.06 },
  'reveal-up':  { clipPath: 'inset(0% 0 100% 0)', opacity: 1 },
};

const REVEAL_VARS: gsap.TweenVars = {
  y: 100,
  skewY: 7,
  duration: 1.8,
  ease: 'power4.out',
  stagger: { amount: 0.3 },
  clearProps: 'transform',
};

const DESKTOP_MQ = '(min-width: 1024px)';

export function initAnimations(): void {
  // Filtros das pages Estoque/Vídeos/Notícias trocam o conteúdo via AJAX, mudando a
  // altura da página — reavalia os triggers existentes depois que o novo conteúdo
  // entra no DOM.
  ['filtrar_estoque', 'filtrar_videos', 'filtrar_noticias'].forEach((action) => {
    window.addEventListener(`${action}:updated`, () => {
      if (!window.matchMedia(DESKTOP_MQ).matches) return;
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  });

  // ── Smooth scroll global — leve, sem deixar o scroll "pesado" ────────────────
  // smoothTouch desativado: em telas touch mantém o scroll nativo (mais performático).
  if (document.getElementById('smooth-wrapper')) {
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 0.8,
      smoothTouch: false,
    });
  }

  const mm = gsap.matchMedia();

  mm.add(DESKTOP_MQ, () => {
    // Pré-esconde apenas elementos hero (acima da dobra) para evitar flash antes das fontes
    document.querySelectorAll<HTMLElement>('[data-split-reveal="hero"]').forEach((el) => {
      gsap.set(el, { opacity: 0 });
    });

    ScrollTrigger.refresh();

    // ── data-animate-load: fade on page load (no ScrollTrigger) ──────────────
    document.querySelectorAll<HTMLElement>('[data-animate-load]').forEach((el) => {
      const delay = parseFloat(el.dataset.animateLoadDelay ?? '0');
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      });
    });

    // ── data-animate: fade / slide / zoom (scroll-triggered) ──────────────────
    const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

    elements.forEach((el) => {
      const type = (el.dataset.animate as AnimationType) || 'fade-up';
      const delay = parseFloat(el.dataset.animateDelay ?? '0');
      const duration = parseFloat(el.dataset.animateDuration ?? type === 'reveal-up' ? '1.1' : '0.85');
      const from = PRESETS[type] ?? PRESETS['fade-up'];
      const ease = type === 'reveal-up' ? 'power3.inOut' : 'power2.out';
      const to = type === 'reveal-up' ? { clipPath: 'inset(0% 0 0% 0)' } : {};

      if (type === 'reveal-up') {
        gsap.fromTo(el, from, {
          ...to,
          duration,
          delay,
          ease,
          clearProps: 'opacity,clipPath',
          scrollTrigger: { trigger: el, start: 'top 72%', once: true, invalidateOnRefresh: true },
        });
      } else {
        gsap.from(el, {
          ...from,
          duration,
          delay,
          ease,
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: el, start: 'top 72%', once: true, invalidateOnRefresh: true },
        });
      }
    });

    // ── data-count-up: número cresce de 0 até o valor final (preserva prefixo/sufixo) ──
    document.querySelectorAll<HTMLElement>('[data-count-up]').forEach((el) => {
      const text = el.textContent ?? '';
      const match = text.match(/\d+/);
      if (!match || match.index === undefined) return;

      const target = parseInt(match[0], 10);
      const prefix = text.slice(0, match.index);
      const suffix = text.slice(match.index + match[0].length);
      const delay = parseFloat(el.dataset.countUpDelay ?? '0');
      const counter = { value: 0 };

      const countUpVars: gsap.TweenVars = {
        value: target,
        duration: 1.4,
        delay,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.value}${suffix}`;
        },
      };

      if (el.dataset.countUpLoad !== undefined) {
        gsap.to(counter, countUpVars);
      } else {
        gsap.to(counter, {
          ...countUpVars,
          scrollTrigger: { trigger: el, start: 'top 72%', once: true, invalidateOnRefresh: true },
        });
      }
    });

    // ── data-parallax: imagem de fundo se move mais devagar que o scroll ──────
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const strength = parseFloat(el.dataset.parallaxStrength ?? '12');
      const section = (el.closest('section') ?? el.parentElement) as HTMLElement;

      gsap.fromTo(
        el,
        { yPercent: -strength },
        {
          yPercent: strength,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // ── data-parallax-rise: conteúdo sobe continuamente conforme o scroll passa pela section ──
    document.querySelectorAll<HTMLElement>('[data-parallax-rise]').forEach((el) => {
      const strength = parseFloat(el.dataset.parallaxRiseStrength ?? '80');
      const section = (el.closest('section') ?? el.parentElement) as HTMLElement;

      gsap.fromTo(
        el,
        { y: strength },
        {
          y: -strength,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // ── data-eyebrow-animate: barras crescem e se afastam para as bordas da section
    document.querySelectorAll<HTMLElement>('[data-eyebrow-animate]').forEach((el) => {
      const bars = el.querySelectorAll<HTMLElement>('[data-eyebrow-bar]');
      if (bars.length < 2) return;

      const [leftBar, rightBar] = Array.from(bars);
      const section = (el.closest('section') ?? el.parentElement) as HTMLElement;

      // 1. scaleY: barras crescem quando o eyebrow entra na viewport
      gsap.from(bars, {
        scaleY: 0,
        duration: 1.1,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
          invalidateOnRefresh: true,
        },
      });

      // 2. translateX scrub: barras se afastam para as bordas da section conforme o scroll (limitado)
      const MAX_TRAVEL = 120;
      const getTravelLeft  = () => -Math.min(leftBar.getBoundingClientRect().left  - section.getBoundingClientRect().left, MAX_TRAVEL);
      const getTravelRight = () =>   Math.min(section.getBoundingClientRect().right - rightBar.getBoundingClientRect().right, MAX_TRAVEL);

      gsap.to(leftBar,  { x: getTravelLeft,  ease: 'power1.inOut', scrollTrigger: { trigger: section, start: 'top center', end: 'bottom top', scrub: 2, invalidateOnRefresh: true } });
      gsap.to(rightBar, { x: getTravelRight, ease: 'power1.inOut', scrollTrigger: { trigger: section, start: 'top center', end: 'bottom top', scrub: 2, invalidateOnRefresh: true } });
    });

    // ── data-split-reveal="hero": SplitText reveal on page load ───────────────
    const heroSplitEls = document.querySelectorAll<HTMLElement>('[data-split-reveal="hero"]');
    if (heroSplitEls.length) {
      document.fonts.ready.then(() => {
        heroSplitEls.forEach((el) => {
          gsap.set(el, { opacity: 1 });
          SplitText.create(el, {
            type: 'words,lines',
            autoSplit: true,
            mask: 'lines',
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 100,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'expo.out',
                delay: 0.2,
              });
            },
          });
        });
      });
    }

    // ── data-split-reveal="scroll": SplitText reveal on scroll ────────────────
    const scrollSplitEls = document.querySelectorAll<HTMLElement>('[data-split-reveal="scroll"]');
    if (scrollSplitEls.length) {
      document.fonts.ready.then(() => {
        scrollSplitEls.forEach((el) => {
          gsap.set(el, { opacity: 1 });
          SplitText.create(el, {
            type: 'words,lines',
            autoSplit: true,
            mask: 'lines',
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 100,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'expo.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 75%',
                  once: true,
                  invalidateOnRefresh: true,
                },
              });
            },
          });
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  });
}
