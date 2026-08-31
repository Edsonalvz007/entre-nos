import { CATEGORY_META, INTENSITY_LABELS } from '../types';
import type { Card } from '../types';
import { Icon } from './Icons';

interface PromptCardProps {
  card: Card;
  targetName: string;
  cardNumber: number;
  revealed: boolean;
  flipping?: boolean;
  onReveal: () => void;
}

export function PromptCard({ card, targetName, cardNumber, revealed, flipping = false, onReveal }: PromptCardProps) {
  const meta = CATEGORY_META[card.category];
  const className = [
    'prompt-card',
    `prompt-card--${card.category}`,
    revealed ? 'prompt-card--revealed' : 'prompt-card--mystery',
    flipping ? 'is-flipping' : '',
    card.adult && revealed ? 'prompt-card--adult' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="prompt-card-stage">
      <span className="prompt-card__shadow" aria-hidden="true" />
      <article
        className={className}
        style={{ '--card-accent': meta.color } as React.CSSProperties}
        aria-label={`Carta ${cardNumber}: ${meta.label}`}
      >
        <div className="prompt-card__texture" aria-hidden="true" />
        <div className="prompt-card__sheen" aria-hidden="true" />
        <div className="prompt-card__topline">
          <span className="card-category"><span className="card-category__dot" />{revealed ? meta.label : 'Carta secreta'}</span>
          <span className="prompt-card__topline-right">
            {card.adult && revealed && <span className="adult-chip"><Icon name="sparkles" size={11} /> 18+</span>}
            <span className="card-number">{String(cardNumber).padStart(2, '0')}</span>
          </span>
        </div>
        {revealed ? <div className="prompt-card__main">
            <span className="prompt-card__eyebrow">
              {card.kind === 'reto' ? 'Un gesto para compartir' : card.kind === 'frase' ? 'Completa la frase' : `Para ${targetName}`}
            </span>
            <h2>{card.prompt}</h2>
            {card.followUp && (
              <details className="follow-up">
                <summary><Icon name="message" size={14} /> Si quieren quedarse un poco más</summary>
                <p>{card.followUp}</p>
              </details>
            )}
          </div> : <div className="prompt-card__mystery">
            <div className="mystery-symbol" aria-hidden="true"><span>?</span><span>?</span><span>?</span></div>
            <span className="prompt-card__eyebrow">Para {targetName}</span>
            <h2>Hay algo aquí<br /><em>para ustedes.</em></h2>
            <p>Revelen la carta cuando estén listos para quedarse un momento.</p>
            <button type="button" className="reveal-button" onClick={onReveal}><Icon name="eye" size={16} /> Revelar carta</button>
          </div>}
        <div className="prompt-card__footer">
          <span>{revealed ? INTENSITY_LABELS[card.intensity] : 'Tómense su tiempo'}</span>
          <span className="prompt-card__mark" aria-hidden="true"><Icon name="heart" size={16} fill="currentColor" /></span>
        </div>
      </article>
    </div>
  );
}
