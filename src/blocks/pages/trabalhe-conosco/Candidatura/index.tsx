import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './style.module.scss';
import SmartImage from '../../../../components/SmartImage';
import { IconChevronDown } from '../../../../icons';
import { htmlContent, hasItems } from '../../../../utils';
import { CandidaturaProps } from './types';

// O campo `sua-vaga` do CF7 é `[hidden sua-vaga]` (sem UI própria) — um <select>
// populado via script tem bug de renderização no CF7 (ver includes/cpt-vagas.php).
// O formulário só carrega um placeholder vazio `.js-vaga-select` no lugar onde o
// campo deveria aparecer; o menu customizado abaixo é montado via portal dentro
// dele e escreve no hidden ao selecionar, do mesmo jeito que Vagas/index.tsx faz
// a partir dos cards da lista de vagas.
const VAGA_PLACEHOLDER_SELECTOR = '.js-vaga-select';
const VAGA_INPUT_SELECTOR = 'input[name="sua-vaga"]';

// Input nativo de arquivo não mostra feedback nenhum quando um arquivo é
// selecionado (o botão SVG cobre a área inteira do input via CSS) — sem isso
// não dá pra saber se o anexo realmente foi escolhido antes do submit.
const FILE_INPUT_SELECTOR = '.file-wrap input[type="file"]';
const FILE_LABEL_SELECTOR = '.file-label-text';
const FILE_LABEL_DEFAULT = 'Anexar arquivo';

export default function Candidatura({ titulo, descricao, imagem, formTitulo, formHtml, vagas = [] }: CandidaturaProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [vagaPlaceholder, setVagaPlaceholder] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [selecionada, setSelecionada] = useState('');

  useEffect(() => {
    setVagaPlaceholder(formRef.current?.querySelector<HTMLElement>(VAGA_PLACEHOLDER_SELECTOR) ?? null);
  }, [formHtml]);

  // O card "Candidatar a vaga" da seção de vagas (Vagas/index.tsx) escreve
  // direto no mesmo `input[name="sua-vaga"]` via querySelector + dispatchEvent
  // de fora deste componente — escutar o `change` aqui é o que sincroniza o
  // texto exibido no trigger do menu com essa seleção externa.
  useEffect(() => {
    const input = formRef.current?.querySelector<HTMLInputElement>(VAGA_INPUT_SELECTOR);
    if (!input) return;

    function onChange() {
      setSelecionada(input!.value);
    }

    input.addEventListener('change', onChange);
    return () => input.removeEventListener('change', onChange);
  }, [formHtml]);

  useEffect(() => {
    const fileInput = formRef.current?.querySelector<HTMLInputElement>(FILE_INPUT_SELECTOR);
    const label = formRef.current?.querySelector<HTMLElement>(FILE_LABEL_SELECTOR);
    if (!fileInput || !label) return;

    function onChange() {
      const fileName = fileInput!.files?.[0]?.name;
      label!.textContent = fileName || FILE_LABEL_DEFAULT;
      label!.classList.toggle('is-filled', Boolean(fileName));
    }

    fileInput.addEventListener('change', onChange);
    return () => fileInput.removeEventListener('change', onChange);
  }, [formHtml]);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function selecionarVaga(titulo: string): void {
    const input = formRef.current?.querySelector<HTMLInputElement>(VAGA_INPUT_SELECTOR);
    if (input) {
      input.value = titulo;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      // Dispara o `change` que o listener acima escuta pra atualizar `selecionada`
      // — mesmo caminho usado pela seleção via card da seção de vagas.
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    setOpen(false);
  }

  return (
    <section id="candidatura" className={styles.candidatura}>
      <div className={styles.candidatura__container}>
        <div className={styles.candidatura__intro} data-animate="fade-right">
          <div className={styles.candidatura__introText}>
            {titulo && <h2 className={styles.candidatura__title}>{titulo}</h2>}
            {descricao && <p className={styles.candidatura__description}>{descricao}</p>}
          </div>

          {imagem && (
            <div className={styles.candidatura__media}>
              <SmartImage image={imagem} className={styles.candidatura__image} />
            </div>
          )}
        </div>

        {formHtml && (
          <div className={styles.candidatura__formCard} data-animate="fade-left" data-animate-delay="0.15">
            {formTitulo && <h3 className={styles.candidatura__formTitle}>{formTitulo}</h3>}
            <div ref={formRef} className={styles.candidatura__form} {...htmlContent(formHtml)} />

            {vagaPlaceholder &&
              hasItems(vagas) &&
              createPortal(
                <div ref={menuRef} className={styles.candidatura__vagaMenu}>
                  <button
                    type="button"
                    className={styles.candidatura__vagaTrigger}
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                  >
                    <span className={selecionada ? '' : styles.candidatura__vagaPlaceholder}>
                      {selecionada || 'Qual vaga deseja?'}
                    </span>
                    <span className={styles.candidatura__vagaIcon}>
                      <IconChevronDown />
                    </span>
                  </button>

                  {open && (
                    <ul className={styles.candidatura__vagaList} role="listbox">
                      {vagas.map((vaga) => (
                        <li key={vaga.titulo} role="option" aria-selected={vaga.titulo === selecionada}>
                          <button type="button" onClick={() => selecionarVaga(vaga.titulo)}>
                            {vaga.titulo}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>,
                vagaPlaceholder
              )}
          </div>
        )}
      </div>
    </section>
  );
}
