import { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import { htmlContent } from '../../../../utils';
import { FormularioProps } from './types';
import { CarrinhoItem } from '../Itens/types';

// Nome do campo oculto que precisa existir no formulário CF7 cadastrado no
// wp-admin (campo `[hidden carrinho-resumo]`) — preenchido aqui com o resumo
// dos itens do carrinho, pra chegar no corpo do e-mail de cotação.
const CAMPO_RESUMO = 'carrinho-resumo';

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

export default function Formulario({ titulo, descricao, formHtml }: FormularioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itensRef = useRef<CarrinhoItem[]>([]);

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

  if (!formHtml) return null;

  return (
    <section className={styles.formulario}>
      <div className={styles.formulario__container}>
        <div className={styles.formulario__card} ref={containerRef} data-animate="fade-up">
          <div className={styles.formulario__header}>
            {titulo && <h2 className={styles.formulario__title}>{titulo}</h2>}
            {descricao && <p className={styles.formulario__description}>{descricao}</p>}
          </div>

          <div className={styles.formulario__form} {...htmlContent(formHtml)} />
        </div>
      </div>
    </section>
  );
}
