import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { htmlContent } from '../../../../utils';
import { IconCheckCircle } from '../../../../icons';
import { FormularioProps } from './types';
import { CarrinhoItem } from '../Itens/types';

// Nome do campo oculto que precisa existir no formulário CF7 cadastrado no
// wp-admin (campo `[hidden carrinho-resumo]`) — preenchido aqui com o resumo
// dos itens do carrinho, pra chegar no corpo do e-mail de cotação.
const CAMPO_RESUMO = 'carrinho-resumo';

type Status = 'idle' | 'submitting' | 'sent';

function formatarResumo(itens: CarrinhoItem[]): string {
  if (!itens.length) return 'Carrinho vazio.';

  return itens
    .map((item) => {
      const variacao = item.variacaoTexto ? ` (${item.variacaoTexto})` : '';
      const pecas = item.pecasPorPacote ? ` — ${item.pecasPorPacote * item.quantidade} peças` : '';
      return `${item.quantidade}x ${item.nome}${variacao}${pecas}`;
    })
    .join('\n');
}

export default function Formulario({ titulo, descricao, formHtml, produtosUrl }: FormularioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itensRef = useRef<CarrinhoItem[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const aoAtualizarCarrinho = (e: Event) => {
      itensRef.current = (e as CustomEvent<{ itens: CarrinhoItem[] }>).detail?.itens ?? [];
    };
    window.addEventListener('carrinho:atualizado', aoAtualizarCarrinho);
    return () => window.removeEventListener('carrinho:atualizado', aoAtualizarCarrinho);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fase de captura: roda antes do próprio listener de submit do CF7 (que
    // escuta em bubble no <form>), garantindo que o campo oculto já está
    // preenchido quando o CF7 monta o payload do envio via AJAX.
    const aoSubmeter = (e: Event) => {
      const form = (e.target as HTMLElement)?.closest('form');
      const campo = form?.elements.namedItem(CAMPO_RESUMO) as HTMLInputElement | null;
      if (campo) campo.value = formatarResumo(itensRef.current);
    };

    container.addEventListener('submit', aoSubmeter, true);
    return () => container.removeEventListener('submit', aoSubmeter, true);
  }, []);

  // O JS do CF7 só chama `wpcf7.init(form)` — o que liga o AJAX real — nos
  // formulários já presentes no DOM no momento do "DOMContentLoaded" dele.
  // Como este form só existe depois que o bloco React monta (chunk carregado
  // sob demanda), o CF7 nunca o encontra e o navegador cai no submit nativo
  // (POST + reload da página inteira) em vez de AJAX. Inicializando o form
  // manualmente aqui, assim que ele entra no DOM, resolve isso reaproveitando
  // o próprio mecanismo de AJAX do CF7 (mesmos eventos, mesma validação),
  // em vez de reimplementar o envio via fetch.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !formHtml) return;

    const form = container.querySelector<HTMLFormElement>('.wpcf7 > form');
    if (!form || form.dataset.themeCf7Init) return;

    const wpcf7 = (window as unknown as { wpcf7?: { init?: (form: HTMLFormElement) => void } }).wpcf7;
    if (typeof wpcf7?.init !== 'function') return;

    wpcf7.init(form);
    form.dataset.themeCf7Init = '1';

    const aoIniciarEnvio = () => setStatus('submitting');
    const aoFinalizarEnvio = (e: Event) => {
      const detailStatus = (e as CustomEvent<{ status?: string }>).detail?.status;

      if (detailStatus === 'mail_sent') {
        setStatus('sent');
        // `wpcf7_mail_sent` já esvazia o carrinho (sessão WC) no servidor — avisa o
        // bloco `Itens` (root React separado) pra zerar a lista na hora, já que sem
        // reload de página (ver `wpcf7.init` acima) ela ficaria presa no estado antigo.
        window.dispatchEvent(new CustomEvent('carrinho:enviado'));
      } else {
        setStatus('idle');
      }
    };

    form.addEventListener('wpcf7beforesubmit', aoIniciarEnvio);
    form.addEventListener('wpcf7submit', aoFinalizarEnvio);

    return () => {
      form.removeEventListener('wpcf7beforesubmit', aoIniciarEnvio);
      form.removeEventListener('wpcf7submit', aoFinalizarEnvio);
    };
  }, [formHtml]);

  if (!formHtml) return null;

  return (
    <section className={styles.formulario}>
      <div className={styles.formulario__container}>
        <div className={styles.formulario__card} data-animate="fade-up">
          <div className={styles.formulario__header}>
            {titulo && <h2 className={styles.formulario__title}>{titulo}</h2>}
            {descricao && <p className={styles.formulario__description}>{descricao}</p>}
          </div>

          {/* O form injetado (formHtml) fica sempre montado no DOM — mesmo depois do
              envio — pra não perder o `wpcf7.init()`/listeners ligados nele numa 2ª
              solicitação. Os overlays de loading/sucesso só cobrem visualmente por cima. */}
          <div className={styles.formulario__formWrap} ref={containerRef}>
            <div className={styles.formulario__form} {...htmlContent(formHtml)} />

            {status === 'submitting' && (
              <div className={styles.formulario__loading} role="status" aria-live="polite">
                <span className={styles.formulario__spinner} />
                <span>Enviando solicitação...</span>
              </div>
            )}

            {status === 'sent' && (
              <div className={styles.formulario__success} role="status" aria-live="polite">
                <span className={styles.formulario__successIcon}>
                  <IconCheckCircle />
                </span>
                <h3 className={styles.formulario__successTitle}>Solicitação enviada com sucesso!</h3>
                <p className={styles.formulario__successText}>
                  Recebemos os dados do seu pedido de cotação. Nossa equipe vai analisar e entrar em contato em breve.
                </p>
                <a href={produtosUrl || '/produtos/'} className={styles.formulario__successCta}>
                  Fazer nova cotação
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
