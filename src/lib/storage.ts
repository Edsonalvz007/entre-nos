import type { SessionState, StoredNote } from '../types';

const SESSION_KEY = 'entre-nos:session:v1';
const NOTES_KEY = 'entre-nos:notes:v1';

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const loadPausedSession = (): SessionState | null => {
  if (!canUseStorage()) return null;
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as SessionState) : null;
  } catch {
    return null;
  }
};

export const savePausedSession = (session: SessionState): void => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearPausedSession = (): void => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const loadNotes = (): StoredNote[] => {
  if (!canUseStorage()) return [];
  try {
    const stored = window.localStorage.getItem(NOTES_KEY);
    return stored ? (JSON.parse(stored) as StoredNote[]) : [];
  } catch {
    return [];
  }
};

export const saveNote = (note: StoredNote): void => {
  if (!canUseStorage()) return;
  const nextNotes = [note, ...loadNotes()].slice(0, 20);
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(nextNotes));
};

export const clearAllLocalData = (): void => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(NOTES_KEY);
};
