import { getDeckForMode } from '../content/decks';
import { ACT_META, ADULT_MIN_INTENSITY, SESSION_CARDS } from '../types';
import type { Card, Intensity, SessionConfig, SessionState } from '../types';

const intensityRank = { suave: 1, profunda: 2, intima: 3 } as const;

/** Proporción de cartas 18+ que se reservan dentro de la ventana de una sesión. */
const adultShare: Record<Intensity, number> = { suave: 0, profunda: 0.25, intima: 0.4 };

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const getActIndex = (cardsPlayed: number): 0 | 1 | 2 => {
  if (cardsPlayed >= 8) return 2;
  if (cardsPlayed >= 4) return 1;
  return 0;
};

/**
 * La extensión 18+ solo entra si está activada y la intensidad elegida llega
 * al mínimo configurado (por defecto, "profunda").
 */
export const isAdultUnlocked = (config: Pick<SessionConfig, 'adultEnabled' | 'intensity'>): boolean =>
  config.adultEnabled && intensityRank[config.intensity] >= intensityRank[ADULT_MIN_INTENSITY];

/** Elige posiciones al azar dentro de la sesión, nunca la primera carta. */
const pickAdultSlots = (windowSize: number, count: number): Set<number> => {
  const candidates = Array.from({ length: Math.max(0, windowSize - 1) }, (_, index) => index + 1);
  return new Set(shuffle(candidates).slice(0, count));
};

/**
 * Reparte las cartas adultas en huecos aleatorios de la sesión en lugar de
 * dejarlas al azar del barajado completo: así siempre aparecen, pero nunca
 * de forma predecible ni todas seguidas.
 */
const mixAdultCards = (base: Card[], adult: Card[], intensity: Intensity, totalCards: number): Card[] => {
  const windowSize = Math.min(totalCards, base.length + adult.length);
  const target = Math.min(adult.length, Math.max(1, Math.round(windowSize * adultShare[intensity])));
  const slots = pickAdultSlots(windowSize, target);

  const session: Card[] = [];
  let baseIndex = 0;
  let adultIndex = 0;
  for (let position = 0; position < windowSize; position += 1) {
    const takesAdult = (slots.has(position) || baseIndex >= base.length) && adultIndex < adult.length;
    session.push(takesAdult ? adult[adultIndex++] : base[baseIndex++]);
  }

  return [...session, ...shuffle([...base.slice(baseIndex), ...adult.slice(adultIndex)])];
};

const getFilteredDeck = (config: SessionConfig): Card[] => {
  const pool = getDeckForMode(config.mode, config.adultEnabled);
  const base = shuffle(
    pool.filter((card) => !card.adult && intensityRank[card.intensity] <= intensityRank[config.intensity]),
  );
  if (!isAdultUnlocked(config)) return base;

  const adult = shuffle(pool.filter((card) => card.adult));
  if (adult.length === 0) return base;
  return mixAdultCards(base, adult, config.intensity, SESSION_CARDS);
};

export const createSession = (config: SessionConfig): SessionState => ({
  status: 'active',
  config: { ...config, totalCards: SESSION_CARDS },
  deck: getFilteredDeck(config),
  currentCard: null,
  drawnIds: [],
  answeredIds: [],
  skippedIds: [],
  cardsPlayed: 0,
  turnIndex: 0,
  actIndex: 0,
  startedAt: new Date().toISOString(),
});

export const drawNextCard = (state: SessionState): SessionState => {
  if (state.cardsPlayed >= state.config.totalCards || state.deck.length === 0) {
    return { ...state, currentCard: null, status: 'finished' };
  }

  const [nextCard, ...remainingDeck] = state.deck;
  return {
    ...state,
    status: 'active',
    deck: remainingDeck,
    currentCard: nextCard,
    drawnIds: [...state.drawnIds, nextCard.id],
  };
};

export const answerCurrentCard = (state: SessionState): SessionState => {
  if (!state.currentCard) return drawNextCard(state);

  const answeredCount = state.cardsPlayed + 1;
  return drawNextCard({
    ...state,
    currentCard: null,
    answeredIds: [...state.answeredIds, state.currentCard.id],
    cardsPlayed: answeredCount,
    actIndex: getActIndex(answeredCount),
    turnIndex: (state.turnIndex + 1) % state.config.players.length,
  });
};

export const skipCard = (state: SessionState): SessionState => {
  if (!state.currentCard) return drawNextCard(state);
  return drawNextCard({
    ...state,
    currentCard: null,
    skippedIds: [...state.skippedIds, state.currentCard.id],
  });
};

export const softenCurrentCard = (state: SessionState): SessionState => {
  if (!state.currentCard) return state;

  const currentRank = intensityRank[state.currentCard.intensity];
  // Se busca primero la carta más suave posible: quien pide bajar el tono
  // merece el escalón más bajo disponible, no solo uno menos.
  const gentlestIndex = state.deck.findIndex((card) => card.intensity === 'suave' && !card.adult);
  const softerIndex = state.deck.findIndex((card) => intensityRank[card.intensity] < currentRank && !card.adult);
  const fallbackIndex = state.deck.findIndex((card) => !card.adult && card.id !== state.currentCard?.id);
  const replacementIndex = gentlestIndex >= 0 ? gentlestIndex : softerIndex >= 0 ? softerIndex : fallbackIndex;
  if (replacementIndex < 0) return state;

  const softerCard = state.deck[replacementIndex];
  const nextDeck = [...state.deck];
  nextDeck.splice(replacementIndex, 1);

  return {
    ...state,
    deck: nextDeck,
    currentCard: softerCard,
    drawnIds: [...state.drawnIds, softerCard.id],
    skippedIds: [...state.skippedIds, state.currentCard.id],
  };
};

export const pauseSession = (state: SessionState): SessionState => ({
  ...state,
  status: 'paused',
});

export const resumeSession = (state: SessionState): SessionState => ({
  ...state,
  status: 'active',
});

export const finishSession = (state: SessionState): SessionState => ({
  ...state,
  currentCard: null,
  status: 'finished',
});

export const getSessionProgress = (state: SessionState): number =>
  Math.min(100, Math.round((state.cardsPlayed / state.config.totalCards) * 100));

export const getCurrentAct = (state: SessionState) => ACT_META[state.actIndex];
