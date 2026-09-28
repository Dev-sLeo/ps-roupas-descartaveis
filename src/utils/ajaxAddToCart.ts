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

    // NUNCA reenviar a chave "add-to-cart": WC_Form_Handler::add_to_cart_action()
    // fica de olho em $_REQUEST['add-to-cart'] em QUALQUER request (inclusive
    // admin-ajax.php, via wp_loaded) — se ela vier preenchida, o WooCommerce
    // adiciona o produto pelo fluxo nativo E o nosso handler (includes/ajax.php)
    // adiciona de novo, resultando em 2 itens no carrinho por 1 clique.
    const dados: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string' && key !== 'add-to-cart') dados[key] = value;
    });

    // No template nativo do WC (add-to-cart/simple.php) o product_id só existe
    // como name="add-to-cart" no PRÓPRIO botão de submit — `new FormData(form)`
    // sozinho não inclui o botão que disparou o submit, só o `submitter` do
    // SubmitEvent cobre isso.
    if (!dados.product_id) {
      const submitter = (e as SubmitEvent).submitter;
      if (submitter instanceof HTMLButtonElement && submitter.name === 'add-to-cart') {
        dados.product_id = submitter.value;
      }
    }

    adicionarAoCarrinho(dados).finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
  });
}
