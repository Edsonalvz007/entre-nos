import { describe, expect, it, vi } from 'vitest';
import {
  answerCurrentCard,
  createSession,
  drawNextCard,
  isAdultUnlocked,
  pauseSession,
  resumeSession,
  skipCard,
  softenCurrentCard,
} from './game-engine';
import { SESSION_CARDS } from '../types';

const coupleConfig = {
  mode: 'pareja' as const,
  players: [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
  ],
  intensity: 'intima' as const,
  adultEnabled: false,
  totalCards: 12,
};

describe('game engine', () => {
  it('creates a private session with a mode-specific deck', () => {
    const session = createSession(coupleConfig);
    expect(session.deck.length).toBeGreaterThan(60);
    expect(session.deck.every((card) => card.mode === 'pareja')).toBe(true);
    expect(session.deck.every((card) => !card.adult)).toBe(true);
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

  it('pauses and resumes without losing the active card', () => {
    const session = drawNextCard(createSession(coupleConfig));
    const paused = pauseSession(session);
    expect(paused.status).toBe('paused');
    expect(paused.currentCard?.id).toBe(session.currentCard?.id);
    expect(resumeSession(paused).status).toBe('active');
  });
});
