import { adicionarAoCarrinho } from './addToCart';

/**
 * Intercepta o submit do `form.cart` NATIVO do WooCommerce (produto simples
 * na single product — produto variável usa o form próprio do bloco React
 * `produto-variacoes`, que já chama `adicionarAoCarrinho` direto no seu
 * `onSubmit`) e troca o reload de página por `adicionarAoCarrinho` (AJAX).
 * Delegado no `document` porque o form é renderizado pelo template nativo do
 * WC, fora de qualquer root React — não existe um elemento fixo pra escutar.
 */
export function initAjaxAddToCart(): void {
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.classList.contains('cart')) return;

    e.preventDefault();

    const submitBtn = form.querySelector<HTMLButtonElement>('.single_add_to_cart_button');
    if (submitBtn) submitBtn.disabled = true;

    const dados: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') dados[key] = value;
    });

    adicionarAoCarrinho(dados).finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
  });
}
