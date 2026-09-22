import clsx from 'clsx';
import styles from './style.module.scss';
import { PillTabsProps } from './types';

export default function PillTabs({ items, className, itemClassName, activeItemClassName }: PillTabsProps) {
  if (!items.length) return null;

  return (
    <div className={clsx(styles.pillTabs, className)}>
      {items.map((item, i) => {
        const itemClasses = clsx(
          styles.pillTabs__item,
          itemClassName,
          item.active && styles['pillTabs__item--active'],
          item.active && activeItemClassName
        );

        return item.href ? (
          <a key={i} href={item.href} className={itemClasses}>
            {item.label}
          </a>
        ) : (
          <button key={i} type="button" onClick={item.onClick} className={itemClasses}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
