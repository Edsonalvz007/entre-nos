import { getDeckForMode, getWildDeckForMode } from '../content/decks';
import { ACT_META, ADULT_MIN_INTENSITY, SESSION_CARDS, WILDCARDS_PER_SESSION } from '../types';
import type { Card, CardCategory, Intensity, SessionConfig, SessionState } from '../types';

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
const pickSlots = (windowSize: number, count: number): Set<number> => {
  const candidates = Array.from({ length: Math.max(0, windowSize - 1) }, (_, index) => index + 1);
  return new Set(shuffle(candidates).slice(0, count));
};

/**
 * Intercala cartas especiales en huecos aleatorios de la sesión en lugar de
 * dejarlas al azar del barajado completo: así siempre aparecen, pero nunca
 * de forma predecible ni todas seguidas.
 */
const interleave = (base: Card[], extras: Card[], windowSize: number, count: number): Card[] => {
  const size = Math.min(windowSize, base.length + extras.length);
  const target = Math.min(extras.length, Math.max(1, count));
  const slots = pickSlots(size, target);

  const session: Card[] = [];
  let baseIndex = 0;
  let extraIndex = 0;
  for (let position = 0; position < size; position += 1) {
    const takesExtra = (slots.has(position) || baseIndex >= base.length) && extraIndex < extras.length;
    session.push(takesExtra ? extras[extraIndex++] : base[baseIndex++]);
  }

  return [...session, ...shuffle([...base.slice(baseIndex), ...extras.slice(extraIndex)])];
};

/**
 * Cada intensidad es un mazo cerrado: elegir "profunda" no arrastra las
 * preguntas de "suave", así que ninguna carta se repite entre niveles.
 */
const buildSessionDeck = (config: SessionConfig): Card[] => {
  const pool = getDeckForMode(config.mode, config.adultEnabled);
  let sequence = shuffle(pool.filter((card) => !card.adult && card.intensity === config.intensity));

  if (isAdultUnlocked(config)) {
    const adult = shuffle(pool.filter((card) => card.adult));
    if (adult.length > 0) {
      sequence = interleave(sequence, adult, SESSION_CARDS, Math.round(SESSION_CARDS * adultShare[config.intensity]));
    }
  }

  if (config.wildcardsEnabled) {
    const wilds = shuffle(getWildDeckForMode(config.mode, config.adultEnabled)).slice(0, WILDCARDS_PER_SESSION);
    if (wilds.length > 0) {
      sequence = interleave(sequence, wilds, SESSION_CARDS + wilds.length, wilds.length);
    }
  }

  return sequence;
};

/**
 * Reserva de cartas suaves para "algo más suave". Queda vacía en una sesión
 * suave, porque ahí ya no hay un escalón más abajo al que bajar.
 */
const buildSoothingDeck = (config: SessionConfig, deck: Card[]): Card[] => {
  if (config.intensity === 'suave') return [];
  const used = new Set(deck.map((card) => card.id));
  return shuffle(
    getDeckForMode(config.mode, false).filter((card) => card.intensity === 'suave' && !used.has(card.id)),
  );
};

export const createSession = (config: SessionConfig): SessionState => {
  const deck = buildSessionDeck(config);
  return {
    status: 'active',
    config: { ...config, totalCards: SESSION_CARDS },
    deck,
    soothingDeck: buildSoothingDeck(config, deck),
    currentCard: null,
    drawnIds: [],
    answeredIds: [],
    skippedIds: [],
    cardsPlayed: 0,
    turnIndex: 0,
    direction: 1,
    forcedCategory: null,
    wildsPlayed: 0,
    actIndex: 0,
    startedAt: new Date().toISOString(),
  };
};

export const drawNextCard = (state: SessionState): SessionState => {
  if (state.cardsPlayed >= state.config.totalCards || state.deck.length === 0) {
    return { ...state, currentCard: null, status: 'finished' };
  }

  // Un comodín de tema empuja al frente la primera carta de la categoría elegida.
  let deck = state.deck;
  if (state.forcedCategory) {
    const wantedIndex = deck.findIndex((card) => card.category === state.forcedCategory && card.kind !== 'comodin');
    if (wantedIndex > 0) {
      const wanted = deck[wantedIndex];
      deck = [wanted, ...deck.slice(0, wantedIndex), ...deck.slice(wantedIndex + 1)];
    }
  }

  const [nextCard, ...remainingDeck] = deck;
  return {
    ...state,
    status: 'active',
    deck: remainingDeck,
    currentCard: nextCard,
    forcedCategory: null,
    drawnIds: [...state.drawnIds, nextCard.id],
  };
};

/** Mueve el turno respetando el sentido actual de la ronda. */
const stepTurn = (state: SessionState, steps: number): number => {
  const count = state.config.players.length;
  if (count === 0) return 0;
  return (((state.turnIndex + state.direction * steps) % count) + count) % count;
};

/** Cuántos lugares avanza el turno después de cada comodín de mecánica. */
const wildTurnSteps: Record<string, number> = { doble: 0, salta: 2 };

export const answerCurrentCard = (state: SessionState): SessionState => {
  const card = state.currentCard;
  if (!card) return drawNextCard(state);

  // Los comodines no consumen una de las doce cartas: son un extra.
  if (card.kind === 'comodin') {
    const reversed = card.wild === 'reversa';
    const direction = (reversed ? -state.direction : state.direction) as 1 | -1;
    const withDirection = { ...state, direction };
    return drawNextCard({
      ...withDirection,
      currentCard: null,
      answeredIds: [...state.answeredIds, card.id],
      wildsPlayed: state.wildsPlayed + 1,
      turnIndex: stepTurn(withDirection, wildTurnSteps[card.wild ?? ''] ?? 1),
    });
  }

  const answeredCount = state.cardsPlayed + 1;
  return drawNextCard({
    ...state,
    currentCard: null,
    answeredIds: [...state.answeredIds, card.id],
    cardsPlayed: answeredCount,
    actIndex: getActIndex(answeredCount),
    turnIndex: stepTurn(state, 1),
  });
};

/** Resuelve un comodín de tema: la siguiente carta será de la categoría elegida. */
export const chooseTheme = (state: SessionState, category: CardCategory): SessionState => {
  if (!state.currentCard || state.currentCard.wild !== 'tema') return state;
  return answerCurrentCard({ ...state, forcedCategory: category });
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
  const card = state.currentCard;
  if (!card) return state;

  // Primero la reserva suave; si la sesión ya era suave, simplemente se cambia de carta.
  const [softerCard, ...restSoothing] = state.soothingDeck;
  if (softerCard) {
    return {
      ...state,
      soothingDeck: restSoothing,
      currentCard: softerCard,
      drawnIds: [...state.drawnIds, softerCard.id],
      skippedIds: [...state.skippedIds, card.id],
    };
  }

  const replacementIndex = state.deck.findIndex(
    (candidate) => !candidate.adult && candidate.kind !== 'comodin' && candidate.id !== card.id,
  );
  if (replacementIndex < 0) return state;

  const replacement = state.deck[replacementIndex];
  const nextDeck = [...state.deck];
  nextDeck.splice(replacementIndex, 1);
  return {
    ...state,
    deck: nextDeck,
    currentCard: replacement,
    drawnIds: [...state.drawnIds, replacement.id],
    skippedIds: [...state.skippedIds, card.id],
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
