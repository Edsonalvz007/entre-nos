import { CATEGORY_META, INTENSITY_LABELS, WILD_META } from '../types';
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
  const wild = card.wild ? WILD_META[card.wild] : null;
  const accent = wild ? wild.color : meta.color;

  const className = [
    'prompt-card',
    `prompt-card--${card.category}`,
    revealed ? 'prompt-card--revealed' : 'prompt-card--mystery',
    flipping ? 'is-flipping' : '',
    card.adult && revealed && !wild ? 'prompt-card--adult' : '',
    wild && revealed ? 'prompt-card--wild' : '',
    wild && revealed ? `prompt-card--wild-${wild.family}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="prompt-card-stage">
      <span className="prompt-card__shadow" aria-hidden="true" />
      <article
        className={className}
        style={{ '--card-accent': accent } as React.CSSProperties}
        aria-label={wild ? `Comodín ${wild.label}` : `Carta ${cardNumber}: ${meta.label}`}
      >
        <div className="prompt-card__texture" aria-hidden="true" />
        <div className="prompt-card__sheen" aria-hidden="true" />
        <div className="prompt-card__topline">
          <span className="card-category">
            <span className="card-category__dot" />
            {revealed ? (wild ? `Comodín · ${wild.label}` : meta.label) : 'Carta secreta'}
          </span>
          <span className="prompt-card__topline-right">
            {card.adult && revealed && <span className="adult-chip"><Icon name="sparkles" size={11} /> 18+</span>}
            <span className="card-number">{wild && revealed ? '★' : String(cardNumber).padStart(2, '0')}</span>
          </span>
        </div>

        {!revealed && (
          <div className="prompt-card__mystery">
            <div className="mystery-symbol" aria-hidden="true"><span>?</span><span>?</span><span>?</span></div>
            <span className="prompt-card__eyebrow">Para {targetName}</span>
            <h2>Hay algo aquí<br /><em>para ustedes.</em></h2>
            <p>Revelen la carta cuando estén listos para quedarse un momento.</p>
            <button type="button" className="reveal-button" onClick={onReveal}><Icon name="eye" size={16} /> Revelar carta</button>
          </div>
        )}

        {revealed && wild && (
          <div className="prompt-card__wild">
            <span className="wild-symbol" aria-hidden="true">{wild.symbol}</span>
            <span className="prompt-card__eyebrow">{wild.family === 'mecanica' ? 'Cambia la ronda' : 'Prenda para el grupo'}</span>
            <h2>{card.title}</h2>
            <p>{card.prompt}</p>
          </div>
        )}

        {revealed && !wild && (
          <div className="prompt-card__main">
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
          </div>
        )}

        <div className="prompt-card__footer">
          <span>{revealed ? (wild ? 'Comodín' : INTENSITY_LABELS[card.intensity]) : 'Tómense su tiempo'}</span>
          <span className="prompt-card__mark" aria-hidden="true">
            {wild && revealed ? <Icon name="sparkles" size={16} /> : <Icon name="heart" size={16} fill="currentColor" />}
          </span>
        </div>
      </article>
    </div>
  );
}
