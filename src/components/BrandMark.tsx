import { Icon } from './Icons';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark${compact ? ' brand-mark--compact' : ''}`} aria-label="Entre nos">
      <span className="brand-mark__glyph" aria-hidden="true">
        <span className="brand-mark__dot brand-mark__dot--one" />
        <span className="brand-mark__dot brand-mark__dot--two" />
        <span className="brand-mark__line" />
      </span>
      <span className="brand-mark__word">entre <em>nos</em></span>
      {!compact && <Icon name="sparkles" size={13} strokeWidth={1.6} />}
    </div>
  );
}
