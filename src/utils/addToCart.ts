import { mostrarToast } from './toast';

/**
 * Adiciona um produto ao carrinho via AJAX (includes/ajax.php,
 * `wp_ajax_adicionar_carrinho`) — sem reload de página. Usado tanto pelo
 * form.cart nativo do WooCommerce (produto simples, ver ajaxAddToCart.ts)
 * quanto pelo form do bloco React `produto-variacoes` (produto variável).
 *
 * Mostra o toast de sucesso/erro e atualiza o badge do carrinho no header
 * (mesmo evento `carrinho:atualizado` que a página /carrinho/ já dispara —
 * ver src/blocks/global/Header/index.tsx).
 */
export async function adicionarAoCarrinho(dados: Record<string, string | number>): Promise<boolean> {
  const ajax = window.prosegAjax;
  if (!ajax) {
    mostrarToast('Não foi possível adicionar ao orçamento.', 'erro');
    return false;
  }

  const params = new URLSearchParams();
  Object.entries(dados).forEach(([key, value]) => params.set(key, String(value)));
  params.set('action', 'adicionar_carrinho');
  params.set('nonce', ajax.nonce);

  try {
    const res = await fetch(ajax.url, { method: 'POST', body: params });
    const json = await res.json();

    if (!json?.success) {
      mostrarToast(json?.data?.message || 'Não foi possível adicionar ao orçamento.', 'erro');
      return false;
    }

    mostrarToast(json.data.message || 'Produto adicionado ao orçamento.');
    window.dispatchEvent(
      new CustomEvent('carrinho:atualizado', { detail: { itens: [{ quantidade: json.data.count ?? 0 }] } })
    );
    return true;
  } catch {
    mostrarToast('Não foi possível adicionar ao orçamento.', 'erro');
    return false;
  }
}
