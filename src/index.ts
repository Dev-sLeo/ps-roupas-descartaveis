import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

import './styles/global.scss';
import { initAnimations, bindAnchorScroll, scrollToTarget } from './animations';

/**
 * Contrato de um bloco registrável.
 * Cada entrada em /src/blocks deve exportar um componente React como default
 * e ser registrada aqui com o atributo `data-block` correspondente.
 */
interface BlockModule {
  default: React.ComponentType<Record<string, unknown>>;
}

/**
 * Mapa de blocos disponíveis.
 * Chave: valor do atributo `data-block` na âncora HTML.
 * Valor: import dinâmico do componente React correspondente.
 *
 * Adicione novos blocos aqui conforme forem criados.
 */
const blockRegistry: Record<string, () => Promise<BlockModule>> = {
  // Global blocks
  'header': () => import(/* webpackChunkName: "blocks/global/Header" */ './blocks/global/Header'),
  'footer': () => import(/* webpackChunkName: "blocks/global/Footer" */ './blocks/global/Footer'),
  'fale-conosco': () => import(/* webpackChunkName: "blocks/global/FaleConosco" */ './blocks/global/FaleConosco'),
  'beneficios': () => import(/* webpackChunkName: "blocks/global/Beneficios" */ './blocks/global/Beneficios'),
  'quem-somos': () => import(/* webpackChunkName: "blocks/global/QuemSomos" */ './blocks/global/QuemSomos'),
  'hero-estatico': () => import(/* webpackChunkName: "blocks/global/HeroEstatico" */ './blocks/global/HeroEstatico'),
  'conteudo-texto': () => import(/* webpackChunkName: "blocks/global/ConteudoTexto" */ './blocks/global/ConteudoTexto'),
  // Home
  'home-hero': () => import(/* webpackChunkName: "blocks/home/Hero" */ './blocks/pages/home/Hero'),
  'home-clientes': () => import(/* webpackChunkName: "blocks/home/Clientes" */ './blocks/pages/home/Clientes'),
  'home-produtos': () => import(/* webpackChunkName: "blocks/home/Produtos" */ './blocks/pages/home/Produtos'),
  'home-embalagens': () => import(/* webpackChunkName: "blocks/home/Embalagens" */ './blocks/pages/home/Embalagens'),
  'home-projetos-especiais': () => import(/* webpackChunkName: "blocks/home/ProjetosEspeciais" */ './blocks/pages/home/ProjetosEspeciais'),
  // Quem somos (página)
  'quem-somos-galeria': () => import(/* webpackChunkName: "blocks/quem-somos/Galeria" */ './blocks/pages/quem-somos/Galeria'),
  'quem-somos-certificados': () => import(/* webpackChunkName: "blocks/quem-somos/Certificados" */ './blocks/pages/quem-somos/Certificados'),
  // Trabalhe Conosco (página)
  'trabalhe-conosco-hero': () => import(/* webpackChunkName: "blocks/trabalhe-conosco/Hero" */ './blocks/pages/trabalhe-conosco/Hero'),
  'trabalhe-conosco-vagas': () => import(/* webpackChunkName: "blocks/trabalhe-conosco/Vagas" */ './blocks/pages/trabalhe-conosco/Vagas'),
  'trabalhe-conosco-candidatura': () => import(/* webpackChunkName: "blocks/trabalhe-conosco/Candidatura" */ './blocks/pages/trabalhe-conosco/Candidatura'),
  // Carrinho (página)
  'carrinho-itens': () => import(/* webpackChunkName: "blocks/carrinho/Itens" */ './blocks/pages/carrinho/Itens'),
  'carrinho-formulario': () => import(/* webpackChunkName: "blocks/carrinho/Formulario" */ './blocks/pages/carrinho/Formulario'),
  // Contato (página)
  'contato-hero': () => import(/* webpackChunkName: "blocks/global/HeroToggle" */ './blocks/global/HeroToggle'),
  'contato-formulario': () => import(/* webpackChunkName: "blocks/contato/Formulario" */ './blocks/pages/contato/Formulario'),
  'contato-certificados': () => import(/* webpackChunkName: "blocks/contato/Certificados" */ './blocks/pages/contato/Certificados'),
  // Ouvidoria (página)
  'ouvidoria-hero': () => import(/* webpackChunkName: "blocks/global/HeroToggle" */ './blocks/global/HeroToggle'),
  'ouvidoria-contato': () => import(/* webpackChunkName: "blocks/ouvidoria/Contato" */ './blocks/pages/ouvidoria/Contato'),
  'ouvidoria-documentos': () => import(/* webpackChunkName: "blocks/ouvidoria/Documentos" */ './blocks/pages/ouvidoria/Documentos'),
  // Blog (posts page)
  'blog-hero': () => import(/* webpackChunkName: "blocks/blog/Hero" */ './blocks/pages/blog/Hero'),
  'blog-listagem': () => import(/* webpackChunkName: "blocks/blog/Listagem" */ './blocks/pages/blog/Listagem'),
  // Single (post do blog)
  'single-post': () => import(/* webpackChunkName: "blocks/single-noticia/Post" */ './blocks/pages/single-noticia/Post'),
  'single-relacionados': () => import(/* webpackChunkName: "blocks/single-noticia/Relacionados" */ './blocks/pages/single-noticia/Relacionados'),
  // Produto (single WooCommerce)
  'produto-galeria-principal': () => import(/* webpackChunkName: "blocks/produto/GaleriaPrincipal" */ './blocks/pages/produto/GaleriaPrincipal'),
  'produto-especificacoes': () => import(/* webpackChunkName: "blocks/produto/Especificacoes" */ './blocks/pages/produto/Especificacoes'),
  'produto-instrucoes': () => import(/* webpackChunkName: "blocks/produto/Instrucoes" */ './blocks/pages/produto/Instrucoes'),
  'produto-galeria': () => import(/* webpackChunkName: "blocks/produto/Galeria" */ './blocks/pages/produto/Galeria'),
  'produto-variacoes': () => import(/* webpackChunkName: "blocks/produto/Variacoes" */ './blocks/pages/produto/Variacoes'),
  // Produtos (arquivo WooCommerce)
  'produtos-hero': () => import(/* webpackChunkName: "blocks/produtos/Hero" */ './blocks/pages/produtos/Hero'),
  'produtos-catalogo': () => import(/* webpackChunkName: "blocks/produtos/Catalogo" */ './blocks/pages/produtos/Catalogo'),
};

// Rastreia elementos já montados para não montar duas vezes
const mounted = new WeakSet<HTMLElement>();

/**
 * Monta um único elemento `[data-block]` como raiz React isolada.
 * Ignora elementos já montados (idempotente).
 */
async function mountBlock( anchor: HTMLElement ): Promise<void> {
  if ( mounted.has( anchor ) ) return;
  mounted.add( anchor );

  const blockName = anchor.dataset.block;

  if ( ! blockName || ! ( blockName in blockRegistry ) ) {
    if ( process.env.NODE_ENV === 'development' ) {
      console.warn( `[theme] Bloco não registrado: "${blockName}"` );
    }
    return;
  }

  let payload: Record<string, unknown> = {};

  const scriptTag = anchor.querySelector<HTMLScriptElement>( 'script[type="application/json"]' );
  if ( scriptTag ) {
    try {
      payload = JSON.parse( scriptTag.textContent ?? '{}' );
    } catch {
      console.error( `[theme] Payload JSON inválido no bloco "${blockName}".`, anchor );
      return;
    }
  }

  try {
    const { default: BlockComponent } = await blockRegistry[ blockName ]();
    const root = createRoot( anchor );
    root.render( createElement( BlockComponent, payload ) );
  } catch ( error ) {
    console.error( `[theme] Falha ao montar o bloco "${blockName}".`, error );
  }
}

/**
 * Escaneia o DOM em busca de todas as âncoras `[data-block]` e as monta.
 * Fluxo: render.php → data-payload (JSON) → index.ts → createRoot → Componente React
 */
async function mountBlocks(): Promise<void> {
  const anchors = document.querySelectorAll<HTMLElement>( '[data-block]' );
  await Promise.all( Array.from( anchors ).map( mountBlock ) );
}

/**
 * MutationObserver: captura blocos adicionados dinamicamente ao DOM
 * (ex: preview de blocos no editor Gutenberg / ACF).
 */
const observer = new MutationObserver( ( mutations ) => {
  for ( const mutation of mutations ) {
    for ( const node of Array.from( mutation.addedNodes ) ) {
      if ( ! ( node instanceof HTMLElement ) ) continue;

      const candidates: HTMLElement[] = node.matches( '[data-block]' )
        ? [ node ]
        : Array.from( node.querySelectorAll<HTMLElement>( '[data-block]' ) );

      for ( const el of candidates ) {
        mountBlock( el );
      }
    }
  }
} );

function scrollToHash(): void {
  const id = window.location.hash.slice( 1 );
  if ( ! id ) return;

  let attempts = 0;
  const tryScroll = () => {
    if ( document.getElementById( id ) ) {
      scrollToTarget( id );
      return;
    }
    if ( ++attempts < 30 ) requestAnimationFrame( tryScroll );
  };
  requestAnimationFrame( tryScroll );
}

async function boot(): Promise<void> {
  await mountBlocks();
  bindAnchorScroll();
  scrollToHash();
  observer.observe( document.body, { childList: true, subtree: true } );
  // Aguarda todas as imagens carregarem para o layout estabilizar antes do GSAP medir posições
  window.addEventListener('load', initAnimations, { once: true });
}

if ( document.readyState === 'loading' ) {
  document.addEventListener( 'DOMContentLoaded', boot );
} else {
  boot();
}
