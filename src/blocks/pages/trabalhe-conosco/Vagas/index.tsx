import styles from './style.module.scss';
import { IconCheckSquare } from '../../../../icons';
import { scrollToTarget } from '../../../../animations';
import { hasItems } from '../../../../utils';
import { VagasProps } from './types';

// Campo do CF7 de candidatura é `[hidden sua-vaga]` — sem UI própria nenhuma
// (nada de <select>, que tem bug de renderização no CF7 quando populado via
// script, nem <input type="text"> visível, que o navegador confunde com campo
// de nome e oferece autofill). O único requisito é a vaga viajar junto no
// submit; "selecionar" a vaga aqui é só escrever no `value` desse hidden
// (fora do React, é HTML puro vindo do shortcode do CF7 via
// `dangerouslySetInnerHTML`) — o seletor por `name` funciona igual pra
// qualquer tipo de campo do CF7 (`hidden`, `text`, etc.), então não importa
// qual dos dois o admin cadastrar no formulário.
const CANDIDATURA_INPUT_SELECTOR = 'input[name="sua-vaga"]';
const CANDIDATURA_ANCHOR = 'candidatura';

function selecionarVaga(titulo: string): void {
  const input = document.querySelector<HTMLInputElement>(CANDIDATURA_INPUT_SELECTOR);
  if (input) {
    input.value = titulo;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  history.pushState(null, '', `#${CANDIDATURA_ANCHOR}`);
  scrollToTarget(CANDIDATURA_ANCHOR);
}

export default function Vagas({ titulo, descricao, vagas = [] }: VagasProps) {
  return (
    <section id="vagas" className={styles.vagas}>
      <div className={styles.vagas__container}>
        <div className={styles.vagas__heading} data-animate="fade-up">
          {titulo && <h2 className={styles.vagas__title}>{titulo}</h2>}
          {descricao && <p className={styles.vagas__description}>{descricao}</p>}
        </div>

        {hasItems(vagas) && (
          <div className={styles.vagas__grid}>
            {vagas.map((vaga, i) => (
              <article key={i} className={styles.vagas__card} data-animate="fade-up" data-animate-delay={String((i % 3) * 0.1)}>
                <span className={styles.vagas__icon}>
                  <IconCheckSquare />
                </span>
                <div className={styles.vagas__cardBody}>
                  {vaga.titulo && <h3 className={styles.vagas__cardTitle}>{vaga.titulo}</h3>}
                  {vaga.descricao && <p className={styles.vagas__cardText}>{vaga.descricao}</p>}
                  {vaga.titulo && (
                    <button type="button" className={styles.vagas__cardLink} onClick={() => selecionarVaga(vaga.titulo)}>
                      {vaga.link.label}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
