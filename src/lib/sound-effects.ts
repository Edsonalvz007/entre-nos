export type SoundName = 'start' | 'reveal' | 'answer' | 'skip' | 'soften' | 'pause' | 'finish' | 'toggle';

const SOUND_KEY = 'entre-nos:sounds:v1';
let audioContext: AudioContext | null = null;
let enabled = true;

const getContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return null;
    audioContext = new AudioContextConstructor();
  }
  return audioContext;
};

export const loadSoundPreference = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const stored = window.localStorage.getItem(SOUND_KEY);
    enabled = stored !== 'off';
  } catch {
    enabled = true;
  }
  return enabled;
};

export const setSoundEnabled = (nextEnabled: boolean): void => {
  enabled = nextEnabled;
  if (typeof window !== 'undefined') window.localStorage.setItem(SOUND_KEY, nextEnabled ? 'on' : 'off');
};

const tone = (context: AudioContext, frequency: number, start: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.025);
};

export const playSound = (name: SoundName): void => {
  if (!enabled) return;
  const context = getContext();
  if (!context) return;
  void context.resume();
  const now = context.currentTime;

  switch (name) {
    case 'start':
      tone(context, 261.63, now, 0.2, 0.035);
      tone(context, 329.63, now + 0.09, 0.32, 0.03);
      break;
    case 'reveal':
      tone(context, 392, now, 0.18, 0.035, 'triangle');
      tone(context, 523.25, now + 0.075, 0.35, 0.028, 'triangle');
      break;
    case 'answer':
      tone(context, 329.63, now, 0.16, 0.025);
      tone(context, 392, now + 0.07, 0.2, 0.025);
      break;
    case 'skip':
      tone(context, 245, now, 0.19, 0.02, 'sine');
      break;
    case 'soften':
      tone(context, 392, now, 0.26, 0.025, 'triangle');
      tone(context, 293.66, now + 0.09, 0.35, 0.025, 'triangle');
      break;
    case 'pause':
      tone(context, 261.63, now, 0.22, 0.025);
      break;
    case 'finish':
      tone(context, 261.63, now, 0.25, 0.03);
      tone(context, 329.63, now + 0.11, 0.25, 0.03);
      tone(context, 392, now + 0.22, 0.42, 0.028);
      break;
    case 'toggle':
      tone(context, 440, now, 0.12, 0.02);
      break;
  }
};
