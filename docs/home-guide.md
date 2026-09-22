# Guia da Home — Proseg

Referência de design + implementação da Home, módulo a módulo. Serve como ponto de partida
para qualquer auditoria futura do site: cada módulo lista o link do Figma (MCP), os arquivos
que o implementam, como deve se comportar e o status da última validação.

**Arquivo Figma**: `6sSLlrS8KgfSOgIUOcYSRX` ("PS Roupas Descartáveis — cópia")

**Links mestre (página inteira)**:
- Desktop: https://www.figma.com/design/6sSLlrS8KgfSOgIUOcYSRX/PS-Roupas-Descartaveis--c%C3%B3pia-?node-id=1-9&m=dev
- Mobile: https://www.figma.com/design/6sSLlrS8KgfSOgIUOcYSRX/PS-Roupas-Descartaveis--c%C3%B3pia-?node-id=112-601&m=dev

---

## Como auditar (metodologia)

1. **Nunca tire um screenshot full-page de uma vez.** Se o módulo usar `data-animate` (ver
   `src/animations`), ele começa em `opacity:0` e só anima quando entra na viewport durante um
   scroll real (GSAP ScrollTrigger). Um screenshot full-page captura a página inteira sem rolar
   por ela, então tudo abaixo da primeira dobra aparece **em branco**. Sempre
   `scrollIntoViewIfNeeded()` (ou scroll manual) por módulo antes do screenshot.
2. Compare contra o node do Figma correspondente (`get_design_context` ou `get_screenshot` via
   MCP) — não confie em memória visual.
3. Rode nos dois breakpoints: desktop ≥1024px (tokens usam `$bp-lg`) e mobile ~390px.
4. Verifique o console do navegador — 0 erros é o esperado em todo módulo.
5. Ao terminar de construir ou ajustar um módulo, **atualize a seção correspondente deste
   arquivo** (link do node, status, diferenças conhecidas) antes de considerar a tarefa concluída.

---

## Arquitetura (para quem for auditar pela primeira vez)

- Fluxo de dados: `render.php` (lê ACF/taxonomia) → `block_render()` → `<div data-block="...">`
  com JSON inline → `src/index.ts` monta o componente React correspondente.
- Página montada via `blocks/pages/home/home.php`, que usa `Tpl` (`includes/class-tpl.php`)
  para encadear `->partial('nome')`.
- Tokens de design: `src/styles/_tokens.scss` (cores, tipografia, espaçamento, breakpoints).
- Blocos **globais** (reutilizados em outras páginas, não só Home) vivem em `blocks/global/` e
  `src/blocks/global/`.
- Blocos **só da Home**: vivem em `blocks/pages/home/` e `src/blocks/pages/home/`.

---

## Ordem dos módulos na Home

`home.php` → hero, beneficios, quem-somos, clientes, produtos, projetos-especiais, fale-conosco. Header/Footer são globais (fora do `home.php`, incluídos em `header.php`/`footer.php`).

Todos os 7 módulos + Header/Footer foram criados nesta sessão a partir do Figma (fileKey `6sSLlrS8KgfSOgIUOcYSRX`, node `1:9` desktop / `112:601` mobile) e validados via build (`npm run build` limpo). Ainda não houve validação visual no navegador (Playwright/Chrome DevTools MCP) nem preenchimento de conteúdo real no wp-admin.

---

## Pendências gerais de conteúdo

- Todas as imagens (hero, produtos, galeria de projetos especiais) são placeholders gerados por IA no Figma (`ChatGPT Image ...`), baixados e commitados em `images/` só como referência de proporção/enquadramento — precisam ser trocadas por fotos reais de produto ao configurar os campos ACF.
- Logo do header/footer: baixado como referência em `images/logo-mark.svg` / `images/logo-wordmark.svg`, mas o campo real é `custom_logo` (Aparência → Personalizar → Identidade) — precisa ser enviado no admin.
- Seção "Embalagens" (node `25:61` do Figma desktop) aparece só no desktop, sem equivalente claro no mobile — não foi implementada; avaliar com o time de design se é uma seção própria ou resquício de outra versão do arquivo.
- Footer no Figma desktop mostra 2 colunas de menu idênticas (mesmo os 4 itens repetidos) — implementado como uma única coluna de menu (via WP nav menu location `footer`), já que replicar os mesmos links duas vezes não fazia sentido de UX.
- Cores/fontes/menu do Header e Footer vêm da nova options page `tema` (`acf-json/group_7a1000000002.json` + `ui_options_page_7a1000000001.json`) — preencher telefone/whatsapp/email/redes sociais/logo do rodapé no admin.
- Nenhuma seção foi comparada pixel a pixel com o Figma via screenshot (Playwright/Chrome DevTools MCP) — recomendado antes de considerar a Home "validada".
