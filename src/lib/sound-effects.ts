export type SoundName =
  | 'start'
  | 'reveal'
  | 'answer'
  | 'skip'
  | 'soften'
  | 'pause'
  | 'finish'
  | 'toggle'
  | 'comodin'
  | 'reversa'
  | 'salta'
  | 'doble'
  | 'tema'
  | 'prenda';

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

const tone = (
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
  glideTo?: number,
) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (glideTo) oscillator.frequency.exponentialRampToValueAtTime(glideTo, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.025);
};

/** Ruido filtrado, para el roce de las cartas al barajar. */
const shuffleNoise = (context: AudioContext, start: number, duration: number, volume: number) => {
  const frames = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frames, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < frames; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / frames);
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1900, start);
  const gain = context.createGain();
  gain.gain.setValueAtTime(volume, start);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(start);
};

/** Arpegio ascendente, la firma sonora de los comodines. */
const arpeggio = (context: AudioContext, notes: number[], start: number, gap: number, volume: number, type: OscillatorType = 'triangle') => {
  notes.forEach((frequency, index) => tone(context, frequency, start + index * gap, 0.24, volume, type));
};

export const playSound = (name: SoundName): void => {
  if (!enabled) return;
  const context = getContext();
  if (!context) return;
  void context.resume();
  const now = context.currentTime;

  switch (name) {
    case 'start':
      shuffleNoise(context, now, 0.26, 0.05);
      tone(context, 261.63, now + 0.12, 0.2, 0.035);
      tone(context, 329.63, now + 0.21, 0.32, 0.03);
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
      tone(context, 523.25, now + 0.34, 0.6, 0.024, 'triangle');
      break;
    case 'toggle':
      tone(context, 440, now, 0.12, 0.02);
      break;

    // Comodines: cada mecánica suena distinto para reconocerla sin leerla.
    case 'comodin':
      shuffleNoise(context, now, 0.18, 0.045);
      arpeggio(context, [392, 523.25, 659.25, 783.99], now + 0.06, 0.075, 0.03);
      break;
    case 'reversa':
      tone(context, 659.25, now, 0.42, 0.032, 'triangle', 261.63);
      tone(context, 329.63, now + 0.16, 0.3, 0.022, 'sine');
      break;
    case 'salta':
      tone(context, 587.33, now, 0.1, 0.03, 'square');
      tone(context, 880, now + 0.11, 0.13, 0.024, 'square');
      break;
    case 'doble':
      tone(context, 440, now, 0.13, 0.03, 'triangle');
      tone(context, 554.37, now + 0.1, 0.13, 0.03, 'triangle');
      tone(context, 659.25, now + 0.2, 0.26, 0.028, 'triangle');
      break;
    case 'tema':
      tone(context, 523.25, now, 0.5, 0.026, 'sine', 1046.5);
      tone(context, 784, now + 0.14, 0.36, 0.02, 'triangle');
      break;
    case 'prenda':
      tone(context, 349.23, now, 0.14, 0.032, 'triangle');
      tone(context, 466.16, now + 0.1, 0.14, 0.03, 'triangle');
      tone(context, 349.23, now + 0.2, 0.22, 0.026, 'triangle');
      break;
  }
};
