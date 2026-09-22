import { useMemo, useState } from 'react';
import styles from './style.module.scss';
import { IconChevronDown } from '../../../../icons';
import { hasItems } from '../../../../utils';
import { VariacoesProps } from './types';

export default function Variacoes({
  productId,
  attributes = [],
  variations = [],
  pecasPorPacote = 0,
  addToCartUrl,
  ctaLabel = 'Adicionar ao orçamento',
  whatsappHref,
}: VariacoesProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantidade, setQuantidade] = useState(1);

  const matched = useMemo(() => {
    if (!hasItems(attributes) || attributes.some((attr) => !selections[attr.key])) return null;

    return (
      variations.find((variation) =>
        attributes.every((attr) => {
          const value = variation.attributes[attr.key] ?? '';
          return value === '' || value === selections[attr.key];
        })
      ) ?? null
    );
  }, [attributes, variations, selections]);

  if (!hasItems(attributes) || !productId || !addToCartUrl) return null;

  const totalPecas = pecasPorPacote > 0 ? quantidade * pecasPorPacote : null;
  const podeAdicionar = !!matched && matched.inStock;

  return (
    <div className={styles.variacoes}>
      <div className={styles.variacoes__divider} aria-hidden="true" />

      <div className={styles.variacoes__fields}>
        {attributes
          .filter((attr) => attr.isCores)
          .map((attr) => (
            <div key={attr.key} className={styles.variacoes__swatchRow}>
              <span className={styles.variacoes__label}>{attr.label}</span>
              <div className={styles.variacoes__swatches}>
                {attr.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.variacoes__swatch} ${selections[attr.key] === opt.value ? styles['variacoes__swatch--active'] : ''}`}
                    style={{ backgroundColor: opt.hex ?? '#cccccc' }}
                    aria-label={opt.label}
                    aria-pressed={selections[attr.key] === opt.value}
                    onClick={() => setSelections((prev) => ({ ...prev, [attr.key]: opt.value }))}
                  />
                ))}
              </div>
            </div>
          ))}

        <div className={styles.variacoes__row}>
          {attributes
            .filter((attr) => !attr.isCores)
            .map((attr) => (
              <div key={attr.key} className={styles.variacoes__field}>
                <label className={styles.variacoes__label} htmlFor={`variacao-${attr.key}`}>
                  {attr.label}
                </label>
                <div className={styles.variacoes__selectWrap}>
                  <select
                    id={`variacao-${attr.key}`}
                    className={styles.variacoes__select}
                    value={selections[attr.key] ?? ''}
                    onChange={(e) => setSelections((prev) => ({ ...prev, [attr.key]: e.target.value }))}
                  >
                    <option value="">Selecione</option>
                    {attr.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown />
                </div>
              </div>
            ))}

          <div className={styles.variacoes__field}>
            <label className={styles.variacoes__label} htmlFor="variacao-quantidade">
              Quantidade de Pacotes
            </label>
            <div className={styles.variacoes__selectWrap}>
              <input
                id="variacao-quantidade"
                type="number"
                min={1}
                className={styles.variacoes__select}
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
            {pecasPorPacote > 0 && (
              <p className={styles.variacoes__pecas}>
                Qtd. por Pacote: <span>{pecasPorPacote} peças</span>
                <br />
                Total de peças: <span>{totalPecas}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <form method="post" action={addToCartUrl} className={styles.variacoes__acoes}>
        <input type="hidden" name="add-to-cart" value={productId} />
        <input type="hidden" name="product_id" value={productId} />
        <input type="hidden" name="quantity" value={quantidade} />
        {matched && <input type="hidden" name="variation_id" value={matched.id} />}
        {attributes.map((attr) => (
          <input key={attr.key} type="hidden" name={attr.key} value={selections[attr.key] ?? ''} />
        ))}

        <button type="submit" className={styles.variacoes__ctaPrimary} disabled={!podeAdicionar}>
          {matched && !matched.inStock ? 'Sem estoque' : ctaLabel}
        </button>

        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.variacoes__ctaSecondary}>
            Falar com nossa equipe
          </a>
        )}
      </form>
    </div>
  );
}
