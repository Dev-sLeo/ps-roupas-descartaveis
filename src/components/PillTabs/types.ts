export interface PillTabItem {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface PillTabsProps {
  items: PillTabItem[];
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}
