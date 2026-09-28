let hideTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Toast fixo genérico (canto inferior direito) — feedback rápido de ações
 * sem reload (ex: adicionar ao orçamento). Cria/reaproveita um único elemento
 * no `body`, fora de qualquer root React (não depende de nenhum bloco estar
 * montado na página).
 */
export function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso'): void {
  let el = document.querySelector<HTMLDivElement>('.proseg-toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'proseg-toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }

  el.textContent = mensagem;
  el.classList.toggle('proseg-toast--erro', tipo === 'erro');

  // Força um reflow antes de adicionar a classe de entrada, pra reiniciar a
  // transição CSS mesmo se o toast já estava visível de uma chamada anterior.
  el.classList.remove('proseg-toast--visivel');
  void el.offsetHeight;
  el.classList.add('proseg-toast--visivel');

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    el?.classList.remove('proseg-toast--visivel');
  }, 3200);
}
