export interface HeroToggleTab {
  /** Identifica a aba pro evento `tabEvent` — só necessário nas abas sem `href` (toggle in-page). */
  key?: string;
  label: string;
  /** Estado inicial (SSR) — só faz sentido numa aba sem `href`. */
  active?: boolean;
  /** Se vier preenchido, a aba navega pra outra página (comportamento antigo) em vez de trocar conteúdo in-page. */
  href?: string;
}

export interface HeroToggleProps {
  eyebrow?: string;
  titulo?: string;
  descricao?: string;
  tabs?: HeroToggleTab[];
  /** Nome do CustomEvent (`window.dispatchEvent`) disparado ao trocar de aba in-page (sem `href`). */
  tabEvent?: string;
  patternLeft?: string;
  patternRight?: string;
}
