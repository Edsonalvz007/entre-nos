import type { ReactNode } from 'react';
import { Icon } from './Icons';

interface OptionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
  tone?: 'clay' | 'blue' | 'yellow';
  badge?: string;
}

export function OptionCard({ title, description, icon, selected, onClick, tone = 'clay', badge }: OptionCardProps) {
  return (
    <button
      type="button"
      className={`option-card option-card--${tone}${selected ? ' is-selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="option-card__icon">{icon}</span>
      <span className="option-card__content">
        <span className="option-card__title-row">
          <span className="option-card__title">{title}</span>
          {badge && <span className="tiny-badge">{badge}</span>}
        </span>
        <span className="option-card__description">{description}</span>
      </span>
      <span className="option-card__check" aria-hidden="true">
        {selected && <Icon name="check" size={15} strokeWidth={2.4} />}
      </span>
    </button>
  );
}
