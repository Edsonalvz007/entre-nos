export type GameMode = 'pareja' | 'amigos';
export type Intensity = 'suave' | 'profunda' | 'intima';
export type CardKind = 'pregunta' | 'reto' | 'frase';
export type CardCategory =
  | 'cercania'
  | 'presente'
  | 'huellas'
  | 'rumbo'
  | 'cuidado'
  | 'intuicion';

export type SessionStatus = 'active' | 'paused' | 'finished';

export interface Player {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  mode: GameMode;
  category: CardCategory;
  intensity: Intensity;
  kind: CardKind;
  prompt: string;
  followUp?: string;
  adult?: boolean;
}

export interface SessionConfig {
  mode: GameMode;
  players: Player[];
  intensity: Intensity;
  adultEnabled: boolean;
  totalCards: number;
}

export interface SessionState {
  status: SessionStatus;
  config: SessionConfig;
  deck: Card[];
  currentCard: Card | null;
  drawnIds: string[];
  answeredIds: string[];
  skippedIds: string[];
  cardsPlayed: number;
  turnIndex: number;
  actIndex: 0 | 1 | 2;
  startedAt: string;
}

export interface StoredNote {
  id: string;
  createdAt: string;
  mode: GameMode;
  text: string;
}

export const INTENSITY_LABELS: Record<Intensity, string> = {
  suave: 'Suave',
  profunda: 'Profunda',
  intima: 'Íntima',
};

export const CATEGORY_META: Record<
  CardCategory,
  { label: string; shortLabel: string; color: string; description: string }
> = {
  cercania: {
    label: 'Cercanía',
    shortLabel: 'Cerca',
    color: '#bd6457',
    description: 'Lo que nos acerca, nos sostiene y nos vuelve hogar.',
  },
  presente: {
    label: 'Presente',
    shortLabel: 'Hoy',
    color: '#cf8b45',
    description: 'La persona que eres hoy y aquello que está pidiendo espacio.',
  },
  huellas: {
    label: 'Huellas',
    shortLabel: 'Antes',
    color: '#d3ad4b',
    description: 'Historias, recuerdos y momentos que te hicieron quien eres.',
  },
  rumbo: {
    label: 'Rumbo',
    shortLabel: 'Después',
    color: '#78986d',
    description: 'Deseos, decisiones y futuros que empiezan a tomar forma.',
  },
  cuidado: {
    label: 'Cuidado',
    shortLabel: 'Juntos',
    color: '#63849a',
    description: 'Pequeños gestos para cuidar lo que existe entre ustedes.',
  },
  intuicion: {
    label: 'Intuición',
    shortLabel: 'Dentro',
    color: '#846d91',
    description: 'Lo que aparece cuando te escuchas antes de responder.',
  },
};

export const ACT_META = [
  { label: 'Abrir', description: 'Llegar a la conversación con curiosidad.' },
  { label: 'Profundizar', description: 'Quedarse un poco más en lo que importa.' },
  { label: 'Integrar', description: 'Convertir lo compartido en una forma de cuidado.' },
] as const;

export const MAX_FRIENDS = 8;
export const SESSION_CARDS = 12;

/**
 * Intensidad mínima a partir de la cual la extensión 18+ entra al mazo.
 * Con intensidad "suave" las cartas adultas se quedan fuera aunque estén activadas.
 */
export const ADULT_MIN_INTENSITY: Intensity = 'profunda';
