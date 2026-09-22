declare global {
  interface Window {
    prosegAjax?: { url: string; nonce: string };
  }
}

/**
 * Intercepta uma navegação de filtro/paginação (link ou form GET): atualiza a
 * URL via history.pushState (mantendo os parâmetros na barra de endereço) e
 * busca os novos dados via admin-ajax, sem recarregar a página.
 *
 * Dispara `${action}:loading` antes da requisição e `${action}:updated` (com
 * os dados no `detail`) quando a resposta chega — os componentes de listagem
 * escutam esses eventos para mostrar o skeleton e atualizar o grid.
 */
export function submitFiltro(action: string, url: string): void {
  const target = new URL(url, window.location.origin);
  window.history.pushState({}, '', target.pathname + target.search);
  window.dispatchEvent(new CustomEvent(`${action}:loading`));

  const ajax = window.prosegAjax;
  if (!ajax) {
    window.location.href = url;
    return;
  }

  const params = new URLSearchParams(target.search);
  params.set('action', action);
  params.set('nonce', ajax.nonce);

  fetch(`${ajax.url}?${params.toString()}`)
    .then((res) => res.json())
    .then((json) => {
      if (!json?.success) throw new Error('ajax_error');
      window.dispatchEvent(new CustomEvent(`${action}:updated`, { detail: json.data }));
    })
    .catch(() => {
      window.location.href = url;
    });
}

/**
 * Monta a URL de filtro (action + querystring) a partir de um <form method="get">.
 */
export function formFiltroUrl(form: HTMLFormElement): string {
  const formData = new FormData(form);
  const params = new URLSearchParams();

  formData.forEach((value, key) => {
    if (typeof value === 'string' && value !== '') params.set(key, value);
  });

  const action = form.getAttribute('action') || window.location.pathname;
  const query = params.toString();
  return query ? `${action}?${query}` : action;
}
