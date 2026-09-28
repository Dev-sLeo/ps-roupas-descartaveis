import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { IconMinus, IconPlus, IconTrash } from '../../../../icons';
import { hasItems } from '../../../../utils';
import { CarrinhoItem, ItensProps } from './types';

declare global {
  interface Window {
    prosegAjax?: { url: string; nonce: string };
  }
}

async function chamarAjax(action: string, body: Record<string, string | number>): Promise<boolean> {
  const ajax = window.prosegAjax;
  if (!ajax) return false;

  const params = new URLSearchParams({ action, nonce: ajax.nonce, ...Object.fromEntries(Object.entries(body).map(([k, v]) => [k, String(v)])) });

  try {
    const res = await fetch(ajax.url, { method: 'POST', body: params });
    const json = await res.json();
    return !!json?.success;
  } catch {
    return false;
  }
}

export default function Itens({ itens: itensIniciais = [] }: ItensProps) {
  const [itens, setItens] = useState<CarrinhoItem[]>(itensIniciais);

  // Avisa o bloco do formulário (root React separado — mesmo padrão de
  // `filtrar_produtos:updated` em src/utils/ajaxFiltro.ts) do estado atual do
  // carrinho, pra ele montar o resumo no campo oculto do CF7 antes do envio.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('carrinho:atualizado', { detail: { itens } }));
  }, [itens]);

  // Disparado pelo bloco `Formulario` quando o CF7 confirma o envio da solicitação
  // (`wpcf7_mail_sent`) — o carrinho (sessão WC) já foi esvaziado no servidor nesse
  // momento, então só precisamos refletir isso na lista sem esperar reload de página.
  useEffect(() => {
    const aoEnviar = () => setItens([]);
    window.addEventListener('carrinho:enviado', aoEnviar);
    return () => window.removeEventListener('carrinho:enviado', aoEnviar);
  }, []);

  async function alterarQuantidade(item: CarrinhoItem, novaQuantidade: number): Promise<void> {
    const quantidade = Math.max(1, novaQuantidade);
    if (quantidade === item.quantidade) return;

    setItens((prev) => prev.map((i) => (i.key === item.key ? { ...i, quantidade } : i)));

    const ok = await chamarAjax('carrinho_atualizar_item', { cart_item_key: item.key, quantidade });
    if (!ok) {
      setItens((prev) => prev.map((i) => (i.key === item.key ? { ...i, quantidade: item.quantidade } : i)));
    }
  }

  async function removerItem(item: CarrinhoItem): Promise<void> {
    const anterior = itens;
    setItens((prev) => prev.filter((i) => i.key !== item.key));

    const ok = await chamarAjax('carrinho_remover_item', { cart_item_key: item.key });
    if (!ok) setItens(anterior);
  }

  return (
    <div className={styles.itens}>
      <div className={styles.itens__container}>
        {hasItems(itens) ? (
          <div className={styles.itens__lista}>
            <div className={styles.itens__cabecalho}>
              <span className={styles.itens__cabecalhoProduto}>Produto</span>
              <span className={styles.itens__cabecalhoPacotes}>Pacotes</span>
              <span className={styles.itens__cabecalhoSpacer} aria-hidden="true" />
            </div>

            {itens.map((item) => {
              const totalPecas = item.pecasPorPacote ? item.pecasPorPacote * item.quantidade : null;

              return (
                <div key={item.key} className={styles.itens__linha}>
                  {item.imagem ? (
                    <img src={item.imagem.url} alt={item.imagem.alt} className={styles.itens__imagem} />
                  ) : (
                    <div className={styles.itens__imagem} aria-hidden="true" />
                  )}

                  <div className={styles.itens__info}>
                    <p className={styles.itens__nome}>{item.nome}</p>
                    {item.variacaoTexto && <p className={styles.itens__variacao}>{item.variacaoTexto}</p>}
                  </div>

                  <div className={styles.itens__acoes}>
                    <div className={styles.itens__acoesTopo}>
                      <div className={styles.itens__qty}>
                        <button
                          type="button"
                          className={styles.itens__qtyBtn}
                          aria-label="Diminuir quantidade"
                          onClick={() => alterarQuantidade(item, item.quantidade - 1)}
                        >
                          <IconMinus />
                        </button>
                        <span className={styles.itens__qtyValue}>{item.quantidade}</span>
                        <button
                          type="button"
                          className={styles.itens__qtyBtn}
                          aria-label="Aumentar quantidade"
                          onClick={() => alterarQuantidade(item, item.quantidade + 1)}
                        >
                          <IconPlus />
                        </button>
                      </div>

                      <button type="button" className={styles.itens__remover} aria-label="Remover item" onClick={() => removerItem(item)}>
                        <IconTrash />
                      </button>
                    </div>

                    {totalPecas !== null && (
                      <p className={styles.itens__pecas}>
                        Qtd. por Pacote: <span>{item.pecasPorPacote} peças</span>
                        <br />
                        Total de peças: <span>{totalPecas}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.itens__vazio}>Seu carrinho de cotação está vazio.</p>
        )}
      </div>
    </div>
  );
}
