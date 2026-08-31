import { describe, expect, it, vi } from 'vitest';
import {
  answerCurrentCard,
  chooseTheme,
  createSession,
  drawNextCard,
  isAdultUnlocked,
  pauseSession,
  resumeSession,
  skipCard,
  softenCurrentCard,
} from './game-engine';
import { SESSION_CARDS } from '../types';
import type { Card, SessionState } from '../types';
import { DECKS, WILD_DECKS } from '../content/decks';

const coupleConfig = {
  mode: 'pareja' as const,
  players: [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
  ],
  intensity: 'intima' as const,
  adultEnabled: false,
  wildcardsEnabled: false,
  totalCards: 12,
};

const groupConfig = {
  ...coupleConfig,
  mode: 'amigos' as const,
  players: [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
    { id: 'c', name: 'C' },
    { id: 'd', name: 'D' },
  ],
};

/** Coloca un comodín concreto como carta actual para probar su efecto. */
const withWildCard = (state: SessionState, wild: Card['wild']): SessionState => {
  const card = WILD_DECKS.find((candidate) => candidate.wild === wild && candidate.mode === state.config.mode);
  if (!card) throw new Error(`No hay comodín ${wild} para el modo ${state.config.mode}`);
  return { ...state, currentCard: card };
};

describe('game engine', () => {
  it('creates a private session with a mode-specific deck', () => {
    const session = createSession(coupleConfig);
    expect(session.deck.length).toBeGreaterThanOrEqual(SESSION_CARDS * 2);
    expect(session.deck.every((card) => card.mode === 'pareja')).toBe(true);
    expect(session.deck.every((card) => !card.adult)).toBe(true);
  });

  it('gives each intensity its own cards, with no overlap between levels', () => {
    for (const mode of ['pareja', 'amigos'] as const) {
      const byPrompt = new Map<string, string>();
      for (const card of DECKS.filter((candidate) => candidate.mode === mode && !candidate.adult)) {
        const seen = byPrompt.get(card.prompt);
        expect(seen, `"${card.prompt}" aparece en ${seen} y en ${card.intensity}`).toBeUndefined();
        byPrompt.set(card.prompt, card.intensity);
      }
    }
  });

  it('only deals cards of the chosen intensity', () => {
    for (const intensity of ['suave', 'profunda', 'intima'] as const) {
      const session = createSession({ ...coupleConfig, intensity });
      expect(session.deck.every((card) => card.intensity === intensity)).toBe(true);
      expect(session.deck.length).toBeGreaterThanOrEqual(SESSION_CARDS * 2);
    }
  });

  it('draws cards without repeating them and rotates turns', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let session = drawNextCard(createSession(coupleConfig));
    const firstCard = session.currentCard?.id;
    expect(session.cardsPlayed).toBe(0);
    expect(session.turnIndex).toBe(0);

    session = answerCurrentCard(session);
    expect(session.cardsPlayed).toBe(1);
    expect(session.turnIndex).toBe(1);
    expect(session.currentCard?.id).not.toBe(firstCard);
    expect(new Set(session.drawnIds).size).toBe(session.drawnIds.length);
    vi.restoreAllMocks();
  });

  it('skips the current card and advances the conversation', () => {
    let session = drawNextCard(createSession(coupleConfig));
    const skipped = session.currentCard?.id;
    session = skipCard(session);
    expect(session.skippedIds).toContain(skipped);
    expect(session.currentCard?.id).not.toBe(skipped);
    expect(session.cardsPlayed).toBe(0);
    expect(session.answeredIds).not.toContain(skipped);
  });

  it('only increments progress after a card is actually answered', () => {
    let session = drawNextCard(createSession(coupleConfig));
    session = answerCurrentCard(session);
    expect(session.cardsPlayed).toBe(1);
    expect(session.answeredIds).toHaveLength(1);
    expect(session.currentCard).not.toBeNull();
  });

  it('can replace an intimate card with a softer one', () => {
    let session = drawNextCard(createSession(coupleConfig));
    while (session.currentCard?.intensity === 'suave' && session.cardsPlayed < 12) {
      session = answerCurrentCard(session);
      if (session.status === 'finished') break;
    }
    const previousId = session.currentCard?.id;
    const softer = softenCurrentCard(session);
    expect(softer.currentCard?.id).not.toBe(previousId);
    expect(softer.currentCard?.intensity).toBe('suave');
    expect(softer.skippedIds).toContain(previousId);
  });

  it('keeps the 18+ extension out below the "profunda" intensity', () => {
    const session = createSession({ ...coupleConfig, intensity: 'suave', adultEnabled: true });
    expect(isAdultUnlocked({ intensity: 'suave', adultEnabled: true })).toBe(false);
    expect(session.deck.some((card) => card.adult)).toBe(false);
  });

  it('mixes 18+ cards into every session from the "profunda" intensity', () => {
    for (const intensity of ['profunda', 'intima'] as const) {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const session = createSession({ ...coupleConfig, intensity, adultEnabled: true });
        const played = session.deck.slice(0, SESSION_CARDS);
        expect(played.filter((card) => card.adult).length).toBeGreaterThan(0);
        expect(played[0].adult).toBeFalsy();
      }
    }
  });

  it('does not always place the 18+ cards in the same slots', () => {
    const positions = new Set<string>();
    for (let attempt = 0; attempt < 25; attempt += 1) {
      const session = createSession({ ...coupleConfig, intensity: 'intima', adultEnabled: true });
      positions.add(
        session.deck
          .slice(0, SESSION_CARDS)
          .map((card, index) => (card.adult ? index : null))
          .filter((index) => index !== null)
          .join('-'),
      );
    }
    expect(positions.size).toBeGreaterThan(1);
  });

  it('never leaks 18+ cards when the extension is off', () => {
    const session = createSession({ ...coupleConfig, intensity: 'intima', adultEnabled: false });
    expect(session.deck.every((card) => !card.adult)).toBe(true);
  });

  it('keeps wildcards out unless the mode is on', () => {
    const plain = createSession(groupConfig);
    expect(plain.deck.some((card) => card.kind === 'comodin')).toBe(false);

    for (let attempt = 0; attempt < 25; attempt += 1) {
      const session = createSession({ ...groupConfig, wildcardsEnabled: true });
      const played = session.deck.slice(0, SESSION_CARDS + 4);
      expect(played.filter((card) => card.kind === 'comodin').length).toBeGreaterThan(0);
      expect(played[0].kind).not.toBe('comodin');
    }
  });

  it('does not spend one of the twelve cards on a wildcard', () => {
    const session = withWildCard(drawNextCard(createSession({ ...groupConfig, wildcardsEnabled: true })), 'todos');
    const after = answerCurrentCard(session);
    expect(after.cardsPlayed).toBe(session.cardsPlayed);
    expect(after.wildsPlayed).toBe(1);
  });

  it('applies the UNO-style turn effects', () => {
    const base = drawNextCard(createSession({ ...groupConfig, wildcardsEnabled: true }));
    expect(base.turnIndex).toBe(0);

    expect(answerCurrentCard(withWildCard(base, 'doble')).turnIndex).toBe(0);
    expect(answerCurrentCard(withWildCard(base, 'salta')).turnIndex).toBe(2);

    const reversed = answerCurrentCard(withWildCard(base, 'reversa'));
    expect(reversed.direction).toBe(-1);
    expect(reversed.turnIndex).toBe(3);
    expect(answerCurrentCard(reversed).turnIndex).toBe(2);
  });

  it('lets the theme wildcard choose the next category', () => {
    const session = withWildCard(drawNextCard(createSession({ ...groupConfig, wildcardsEnabled: true })), 'tema');
    const after = chooseTheme(session, 'huellas');
    expect(after.currentCard?.category).toBe('huellas');
    expect(after.currentCard?.kind).not.toBe('comodin');
  });

  it('pauses and resumes without losing the active card', () => {
    const session = drawNextCard(createSession(coupleConfig));
    const paused = pauseSession(session);
    expect(paused.status).toBe('paused');
    expect(paused.currentCard?.id).toBe(session.currentCard?.id);
    expect(resumeSession(paused).status).toBe('active');
  });
});
