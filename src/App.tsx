import { useEffect, useReducer, useRef, useState } from 'react';
import {
  answerCurrentCard,
  createSession,
  drawNextCard,
  finishSession,
  getCurrentAct,
  getSessionProgress,
  pauseSession,
  resumeSession,
  skipCard,
  softenCurrentCard,
} from './lib/game-engine';
import { loadSoundPreference, playSound, setSoundEnabled as setSoundPreference } from './lib/sound-effects';
import {
  clearAllLocalData,
  clearPausedSession,
  loadNotes,
  loadPausedSession,
  saveNote,
  savePausedSession,
} from './lib/storage';
import {
  ACT_META,
  CATEGORY_META,
  INTENSITY_LABELS,
  MAX_FRIENDS,
  SESSION_CARDS,
} from './types';
import type { CardCategory, GameMode, Intensity, Player, SessionConfig, SessionState, StoredNote } from './types';
import { BrandMark } from './components/BrandMark';
import { Icon } from './components/Icons';
import { OptionCard } from './components/OptionCard';
import { PromptCard } from './components/PromptCard';

type Screen = 'home' | 'setup' | 'guide' | 'game' | 'pause' | 'finish' | 'settings';
type SessionAction =
  | { type: 'replace'; session: SessionState }
  | { type: 'draw' }
  | { type: 'answer' }
  | { type: 'skip' }
  | { type: 'soften' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'finish' };

const sessionReducer = (state: SessionState | null, action: SessionAction): SessionState | null => {
  if (action.type === 'replace') return action.session;
  if (!state) return state;
  switch (action.type) {
    case 'draw': return drawNextCard(state);
    case 'answer': return answerCurrentCard(state);
    case 'skip': return skipCard(state);
    case 'soften': return softenCurrentCard(state);
    case 'pause': return pauseSession(state);
    case 'resume': return resumeSession(state);
    case 'finish': return finishSession(state);
    default: return state;
  }
};

const makePlayers = (mode: GameMode, count = 2): Player[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${mode}-${index + 1}`,
    name: mode === 'pareja' ? (index === 0 ? 'Yo' : 'Mi persona') : index === 0 ? 'Yo' : `Persona ${index + 1}`,
  }));

const initialNames = makePlayers('amigos', 4);

/** El giro de la carta se salta si la persona pidió menos movimiento en su sistema. */
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FLIP_MS = 270;

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [session, dispatch] = useReducer(sessionReducer, null);
  const [pausedSession, setPausedSession] = useState<SessionState | null>(() => loadPausedSession());
  const [setupMode, setSetupMode] = useState<GameMode>('pareja');
  const [setupIntensity, setSetupIntensity] = useState<Intensity>('profunda');
  const [adultEnabled, setAdultEnabled] = useState(false);
  const [adultGateOpen, setAdultGateOpen] = useState(false);
  const [friendCount, setFriendCount] = useState(4);
  const [names, setNames] = useState<Player[]>(initialNames);
  const [finishNote, setFinishNote] = useState('');
  const [hasClearedData, setHasClearedData] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => loadSoundPreference());

  useEffect(() => {
    if (screen === 'pause' && session) savePausedSession(session);
  }, [screen, session]);

  useEffect(() => {
    if (session?.status === 'finished' && screen === 'game') {
      playSound('finish');
      setScreen('finish');
    }
  }, [screen, session?.status]);

  const toggleSounds = () => {
    const nextEnabled = !soundEnabled;
    setSoundEnabled(nextEnabled);
    setSoundPreference(nextEnabled);
    if (nextEnabled) playSound('toggle');
  };

  const goTo = (nextScreen: Screen) => {
    setScreen(nextScreen);
    window.history.replaceState({}, '', `#${nextScreen}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateMode = (mode: GameMode) => {
    setSetupMode(mode);
    setNames(makePlayers(mode, mode === 'pareja' ? 2 : friendCount));
    if (mode === 'amigos') setAdultEnabled(false);
  };

  const updateFriendCount = (nextCount: number) => {
    const safeCount = Math.min(MAX_FRIENDS, Math.max(2, nextCount));
    setFriendCount(safeCount);
    setNames((current) => {
      const next = makePlayers('amigos', safeCount);
      return next.map((player, index) => ({ ...player, name: current[index]?.name || player.name }));
    });
  };

  const startSession = () => {
    const players = names
      .slice(0, setupMode === 'pareja' ? 2 : friendCount)
      .map((player, index) => ({
        ...player,
        name: player.name.trim() || (setupMode === 'pareja' ? (index === 0 ? 'Yo' : 'Mi persona') : `Persona ${index + 1}`),
      }));
    const config: SessionConfig = {
      mode: setupMode,
      players,
      intensity: setupIntensity,
      adultEnabled: setupMode === 'pareja' ? adultEnabled : false,
      totalCards: SESSION_CARDS,
    };
    const nextSession = drawNextCard(createSession(config));
    playSound('start');
    dispatch({ type: 'replace', session: nextSession });
    clearPausedSession();
    setPausedSession(null);
    setFinishNote('');
    goTo('game');
  };

  const resumeSavedSession = () => {
    if (!pausedSession) return;
    dispatch({ type: 'replace', session: resumeSession(pausedSession) });
    setPausedSession(null);
    goTo('game');
  };

  const leaveSession = () => {
    clearPausedSession();
    setPausedSession(null);
    dispatch({ type: 'finish' });
    goTo('home');
  };

  const saveFinishNote = () => {
    if (!session || !finishNote.trim()) return;
    const note: StoredNote = {
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      mode: session.config.mode,
      text: finishNote.trim(),
    };
    saveNote(note);
    setFinishNote('');
  };

  const startNewSession = () => {
    dispatch({ type: 'finish' });
    setSetupMode('pareja');
    setSetupIntensity('profunda');
    setAdultEnabled(false);
    setNames(makePlayers('pareja', 2));
    goTo('setup');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'setup':
        return (
          <SetupScreen
            mode={setupMode}
            intensity={setupIntensity}
            adultEnabled={adultEnabled}
            adultGateOpen={adultGateOpen}
            names={names}
            friendCount={friendCount}
            onModeChange={updateMode}
            onIntensityChange={setSetupIntensity}
            onAdultRequest={() => setAdultGateOpen(true)}
            onAdultGateClose={() => setAdultGateOpen(false)}
            onAdultConfirm={() => { setAdultEnabled(true); setAdultGateOpen(false); }}
            onFriendCountChange={updateFriendCount}
            onNameChange={(id, name) => setNames((current) => current.map((player) => player.id === id ? { ...player, name } : player))}
            onBack={() => goTo('home')}
            onStart={startSession}
          />
        );
      case 'guide':
        return <GuideScreen onBack={() => goTo('home')} onStart={startNewSession} />;
      case 'game':
        return session ? (
          <GameScreen
            session={session}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSounds}
            onReveal={() => playSound('reveal')}
            onNext={() => { playSound('answer'); dispatch({ type: 'answer' }); }}
            onSkip={() => { playSound('skip'); dispatch({ type: 'skip' }); }}
            onSoften={() => { playSound('soften'); dispatch({ type: 'soften' }); }}
            onPause={() => { playSound('pause'); dispatch({ type: 'pause' }); goTo('pause'); }}
          />
        ) : <HomeScreen onStart={startNewSession} onGuide={() => goTo('guide')} onSettings={() => goTo('settings')} />;
      case 'pause':
        return session ? <PauseScreen session={session} onResume={() => { dispatch({ type: 'resume' }); goTo('game'); }} onLeave={leaveSession} /> : null;
      case 'finish':
        return session ? <FinishScreen session={session} note={finishNote} onNoteChange={setFinishNote} onSaveNote={saveFinishNote} onNew={startNewSession} onHome={() => goTo('home')} /> : null;
      case 'settings':
        return <SettingsScreen hasClearedData={hasClearedData} onClear={() => { clearAllLocalData(); setPausedSession(null); setHasClearedData(true); }} onBack={() => goTo('home')} />;
      case 'home':
      default:
        return <HomeScreen pausedSession={pausedSession} onStart={startNewSession} onResume={resumeSavedSession} onGuide={() => goTo('guide')} onSettings={() => goTo('settings')} />;
    }
  };

  return <main className="app-shell">{renderScreen()}</main>;
}

function PageHeader({ onBack, label = 'entre nos' }: { onBack?: () => void; label?: string }) {
  return (
    <header className="page-header">
      {onBack ? <button type="button" className="icon-button" onClick={onBack} aria-label="Volver"><Icon name="arrow-left" size={19} /></button> : <span className="header-spacer" />}
      <BrandMark compact />
      <span className="page-header__label">{label}</span>
    </header>
  );
}

interface HomeProps {
  pausedSession?: SessionState | null;
  onStart: () => void;
  onResume?: () => void;
  onGuide: () => void;
  onSettings: () => void;
}

function HomeScreen({ pausedSession, onStart, onResume, onGuide, onSettings }: HomeProps) {
  return (
    <div className="home-page page-enter">
      <header className="top-nav">
        <BrandMark />
        <div className="top-nav__actions">
          <button type="button" className="text-button" onClick={onGuide}><Icon name="help" size={15} /> Cómo funciona</button>
          <button type="button" className="icon-button" onClick={onSettings} aria-label="Privacidad y ajustes"><Icon name="settings" size={18} /></button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow eyebrow--with-dot"><span className="eyebrow-dot" />Una pausa para encontrarnos</span>
          <h1>Lo que importa<br /><em>merece espacio.</em></h1>
          <p className="hero-copy__description">Un juego de cartas para conversar con más presencia, escuchar con curiosidad y recordar todo lo que ya existe entre ustedes.</p>
          <div className="hero-actions">
            <button type="button" className="primary-button primary-button--large" onClick={onStart}>Empezar una partida <Icon name="arrow-right" size={17} /></button>
            <span className="hero-note"><Icon name="shield" size={15} /> Sin cuentas · tus respuestas no se guardan</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Ilustración abstracta de cartas de colores" role="img">
          <div className="hero-art__halo" />
          <div className="hero-art__card hero-art__card--back hero-art__card--red"><span>cerca</span></div>
          <div className="hero-art__card hero-art__card--back hero-art__card--blue"><span>juntos</span></div>
          <div className="hero-art__card hero-art__card--front"><span className="hero-art__tiny">una pregunta</span><span>¿Qué quieres<br /><em>compartir hoy?</em></span><span className="hero-art__heart">♥</span></div>
          <span className="hero-art__caption">12 cartas · 3 momentos</span>
        </div>
      </section>

      <section className="home-lower-grid">
        {pausedSession && onResume && (
          <button type="button" className="resume-card" onClick={onResume}>
            <span className="resume-card__icon"><Icon name="play" size={18} fill="currentColor" /></span>
            <span><strong>Tu conversación está aquí</strong><small>{pausedSession.config.mode === 'pareja' ? 'Pareja' : 'Amigos'} · carta {pausedSession.cardsPlayed} de {pausedSession.config.totalCards}</small></span>
            <Icon name="arrow-right" size={17} />
          </button>
        )}
        <div className="intro-strip">
          <div><span className="section-index">01</span><h2>Una conversación no tiene que ser perfecta para ser importante.</h2></div>
          <p>Elige una carta. Tómate tu tiempo. Pasar también es una forma de cuidarse.</p>
        </div>
        <div className="mini-features">
          <span><Icon name="message" size={17} /> Preguntas originales</span>
          <span><Icon name="heart" size={17} /> Sin ganadores</span>
          <span><Icon name="leaf" size={17} /> A tu propio ritmo</span>
        </div>
      </section>
      <footer className="quiet-footer"><span>Hecho para estar un poco más presentes.</span><span>v0.1 · contenido privado en tu dispositivo</span></footer>
    </div>
  );
}

interface SetupProps {
  mode: GameMode;
  intensity: Intensity;
  adultEnabled: boolean;
  adultGateOpen: boolean;
  names: Player[];
  friendCount: number;
  onModeChange: (mode: GameMode) => void;
  onIntensityChange: (intensity: Intensity) => void;
  onAdultRequest: () => void;
  onAdultGateClose: () => void;
  onAdultConfirm: () => void;
  onFriendCountChange: (count: number) => void;
  onNameChange: (id: string, name: string) => void;
  onBack: () => void;
  onStart: () => void;
}

function SetupScreen(props: SetupProps) {
  const visiblePlayers = props.names.slice(0, props.mode === 'pareja' ? 2 : props.friendCount);
  return (
    <div className="setup-page page-enter">
      <PageHeader onBack={props.onBack} label="preparar el encuentro" />
      <div className="setup-layout">
        <div className="setup-intro">
          <span className="eyebrow">Antes de empezar</span>
          <h1>¿Con quién quieres<br /><em>estar aquí?</em></h1>
          <p>No hay una forma correcta de jugar. Solo una invitación a llegar con curiosidad y dejar un poco de espacio para lo inesperado.</p>
          <div className="agreement-note"><Icon name="shield" size={18} /><span><strong>Acuerdos de la casa</strong><br />Escuchar sin arreglar. Pasar sin explicar. Cuidar el ritmo.</span></div>
        </div>
        <div className="setup-form-card">
          <fieldset className="form-section">
            <legend>Elijan su modo</legend>
            <div className="option-grid option-grid--two">
              <OptionCard title="Pareja" description="Dos personas, una pausa compartida." icon={<Icon name="heart" size={21} />} tone="clay" selected={props.mode === 'pareja'} onClick={() => props.onModeChange('pareja')} />
              <OptionCard title="Amigos" description="De 2 a 8 personas, muchas miradas." icon={<Icon name="users" size={21} />} tone="blue" selected={props.mode === 'amigos'} onClick={() => props.onModeChange('amigos')} />
            </div>
          </fieldset>

          {props.mode === 'amigos' && (
            <fieldset className="form-section form-section--compact">
              <legend>¿Cuántas personas?</legend>
              <div className="stepper"><button type="button" onClick={() => props.onFriendCountChange(props.friendCount - 1)} aria-label="Quitar persona" disabled={props.friendCount <= 2}><Icon name="minus" size={17} /></button><strong>{props.friendCount}</strong><button type="button" onClick={() => props.onFriendCountChange(props.friendCount + 1)} aria-label="Añadir persona" disabled={props.friendCount >= MAX_FRIENDS}><Icon name="plus" size={17} /></button><span>personas en la ronda</span></div>
            </fieldset>
          )}

          <fieldset className="form-section">
            <legend>{props.mode === 'pareja' ? 'Sus nombres (opcional)' : 'Nombres (opcional)'}</legend>
            <div className="names-grid">
              {visiblePlayers.map((player, index) => <label key={player.id} className="field-label"><span>{props.mode === 'pareja' ? (index === 0 ? 'Primera persona' : 'Segunda persona') : `Persona ${index + 1}`}</span><input value={player.name} onChange={(event) => props.onNameChange(player.id, event.target.value)} placeholder={player.name} maxLength={28} /></label>)}
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Elijan una intensidad</legend>
            <div className="intensity-list">
              {(Object.keys(INTENSITY_LABELS) as Intensity[]).map((intensity) => <button type="button" key={intensity} className={`intensity-option intensity-option--${intensity}${props.intensity === intensity ? ' is-selected' : ''}`} onClick={() => props.onIntensityChange(intensity)} aria-pressed={props.intensity === intensity}><span className="intensity-option__bar" /><span><strong>{INTENSITY_LABELS[intensity]}</strong><small>{intensity === 'suave' ? 'Para llegar despacio.' : intensity === 'profunda' ? 'Para quedarse un poco más.' : 'Para mirar con más honestidad.'}</small></span><span className="option-card__check">{props.intensity === intensity && <Icon name="check" size={15} />}</span></button>)}
            </div>
          </fieldset>

          {props.mode === 'pareja' && (
            <>
              <div className={`adult-toggle${props.adultEnabled ? ' is-enabled' : ''}`}>
                <div><Icon name={props.adultEnabled ? 'sparkles' : 'lock'} size={17} /><span><strong>Extensión íntima 18+</strong><small>{props.adultEnabled ? 'Se reparten al azar desde intensidad Profunda.' : 'Preguntas sobre deseo, límites y cercanía.'}</small></span></div>
                <button type="button" onClick={props.adultEnabled ? () => undefined : props.onAdultRequest}>{props.adultEnabled ? 'Activada' : 'Desbloquear'}</button>
              </div>
              {props.adultEnabled && props.intensity === 'suave' && (
                <p className="adult-hint"><Icon name="info" size={13} /><span>En intensidad <strong>Suave</strong> las cartas 18+ se quedan fuera. Elige <strong>Profunda</strong> o <strong>Íntima</strong> para que aparezcan.</span></p>
              )}
            </>
          )}
          <button type="button" className="primary-button primary-button--full" onClick={props.onStart}>Abrir la primera carta <Icon name="arrow-right" size={17} /></button>
          <p className="form-footnote"><Icon name="info" size={13} /> Pueden pasar cualquier carta. No se guardan sus respuestas.</p>
        </div>
      </div>
      {props.adultGateOpen && <AgeGate onClose={props.onAdultGateClose} onConfirm={props.onAdultConfirm} />}
    </div>
  );
}

function AgeGate({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return <div className="modal-backdrop" role="presentation"><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="age-title"><button type="button" className="modal-close icon-button" onClick={onClose} aria-label="Cerrar"><Icon name="x" size={18} /></button><span className="modal-card__icon"><Icon name="lock" size={20} /></span><span className="eyebrow">Contenido opcional</span><h2 id="age-title">¿Tienes 18 años o más?</h2><p>Esta extensión conversa sobre deseo, límites y cercanía adulta. Actívala solo si todas las personas presentes se sienten cómodas.</p><div className="modal-card__actions"><button type="button" className="secondary-button" onClick={onClose}>Volver</button><button type="button" className="primary-button" onClick={onConfirm}>Sí, continuar</button></div></section></div>;
}

function GuideScreen({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <div className="guide-page page-enter">
      <PageHeader onBack={onBack} label="la guía" />
      <section className="guide-hero"><span className="eyebrow eyebrow--with-dot"><span className="eyebrow-dot" />No es un examen</span><h1>Jugar es<br /><em>escucharnos.</em></h1><p>Entre nos está hecho para que una pregunta abra otra. No hay respuestas correctas, ni historias demasiado pequeñas.</p></section>
      <section className="guide-section"><div className="section-heading"><span className="section-index">01</span><div><span className="eyebrow">Los seis caminos</span><h2>Cada color mira una parte distinta de la vida.</h2></div></div><div className="category-guide-grid">{(Object.keys(CATEGORY_META) as CardCategory[]).map((category, index) => { const meta = CATEGORY_META[category]; return <article key={category} className="category-guide-card" style={{ '--card-accent': meta.color } as React.CSSProperties}><span className="category-guide-card__number">0{index + 1}</span><span className="category-guide-card__dot" /><h3>{meta.label}</h3><p>{meta.description}</p></article>; })}</div></section>
      <section className="guide-section guide-section--dark"><div className="section-heading"><span className="section-index section-index--light">02</span><div><span className="eyebrow eyebrow--light">Tres momentos</span><h2>Una partida que se abre, se queda y se lleva algo consigo.</h2></div></div><div className="act-list">{ACT_META.map((act, index) => <div className="act-row" key={act.label}><span>0{index + 1}</span><strong>{act.label}</strong><p>{act.description}</p></div>)}</div></section>
      <section className="guide-section guide-section--agreements"><div className="section-heading"><span className="section-index">03</span><div><span className="eyebrow">El acuerdo más importante</span><h2>El cuidado también es parte del juego.</h2></div></div><div className="agreement-grid"><div><Icon name="pause-circle" size={21} /><strong>Pueden pausar</strong><p>El ritmo lo decide quien necesita respirar.</p></div><div><Icon name="arrow-right" size={21} /><strong>Pueden pasar</strong><p>No responder también es una respuesta válida.</p></div><div><Icon name="heart" size={21} /><strong>Pueden volver</strong><p>Lo compartido merece cuidado después de la partida.</p></div></div></section>
      <div className="guide-cta"><p>¿Listos para abrir una pregunta?</p><button type="button" className="primary-button" onClick={onStart}>Preparar una partida <Icon name="arrow-right" size={17} /></button></div>
    </div>
  );
}

interface GameProps {
  session: SessionState;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReveal: () => void;
  onNext: () => void;
  onSkip: () => void;
  onSoften: () => void;
  onPause: () => void;
}

function GameScreen({ session, soundEnabled, onToggleSound, onReveal, onNext, onSkip, onSoften, onPause }: GameProps) {
  const [revealed, setRevealed] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const flipTimer = useRef<number | null>(null);
  const card = session.currentCard;
  const progress = getSessionProgress(session);
  const act = getCurrentAct(session);
  const player = session.config.players[session.turnIndex];
  const currentMeta = card ? CATEGORY_META[card.category] : CATEGORY_META.cercania;

  useEffect(() => {
    setRevealed(false);
    setFlipping(false);
  }, [card?.id]);

  useEffect(() => () => {
    if (flipTimer.current !== null) window.clearTimeout(flipTimer.current);
  }, []);

  const revealCard = () => {
    if (revealed || flipping) return;
    onReveal();
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }
    setFlipping(true);
    flipTimer.current = window.setTimeout(() => {
      setRevealed(true);
      setFlipping(false);
    }, FLIP_MS);
  };

  if (!card) return null;
  return (
    <div className="game-page page-enter" style={{ '--active-accent': currentMeta.color } as React.CSSProperties}>
      <header className="game-header"><BrandMark compact /><div className="game-header__center"><span className="act-label">Acto {session.actIndex + 1} · {act.label}</span><div className="progress-track" aria-label={`${progress}% respondido`}><span style={{ width: `${progress}%` }} /></div></div><div className="game-header__actions"><button type="button" className="sound-button" onClick={onToggleSound} aria-label={soundEnabled ? 'Desactivar sonidos' : 'Activar sonidos'}><Icon name={soundEnabled ? 'volume-on' : 'volume-off'} size={17} /><span>{soundEnabled ? 'Sonido' : 'Silencio'}</span></button><button type="button" className="pause-button" onClick={onPause}><Icon name="pause" size={15} /> Pausar</button></div></header>
      <div className="game-context"><span className="game-context__mode">{session.config.mode === 'pareja' ? 'Pareja' : `${session.config.players.length} personas`}</span><span className="game-context__count">Carta {session.cardsPlayed + 1} de {session.config.totalCards}</span></div>
      <main className="game-main"><div className="turn-message"><span className="turn-message__dot" /><span>Ahora responde <strong>{player?.name || 'la siguiente persona'}</strong></span><span className="turn-message__hint">{session.config.players.length > 2 ? 'Pásale el teléfono cuando terminen.' : 'Tómense todo el tiempo que necesiten.'}</span></div><PromptCard key={card.id} card={card} targetName={player?.name || 'ustedes'} cardNumber={session.cardsPlayed + 1} revealed={revealed} flipping={flipping} onReveal={revealCard} />{revealed ? <div className="game-actions"><button type="button" className="primary-button primary-button--large" onClick={onNext}>Listo, siguiente <Icon name="arrow-right" size={17} /></button><div className="secondary-actions"><button type="button" className="ghost-button" onClick={onSkip}><Icon name="arrow-right" size={15} /> Pasar esta carta</button><button type="button" className="ghost-button" onClick={onSoften}><Icon name="leaf" size={15} /> Algo más suave</button></div></div> : <div className="game-actions game-actions--mystery"><span>La respuesta puede esperar. La curiosidad también.</span><button type="button" className="ghost-button" onClick={onSkip}><Icon name="arrow-right" size={15} /> Pasar sin verla</button></div>}</main>
    </div>
  );
}

function PauseScreen({ session, onResume, onLeave }: { session: SessionState; onResume: () => void; onLeave: () => void }) {
  return <div className="pause-page page-enter"><PageHeader label="una pausa" /><div className="pause-orbit" aria-hidden="true"><span /><span /><span /></div><span className="eyebrow eyebrow--with-dot"><span className="eyebrow-dot" />Sin prisa</span><h1>Lo que se cuida,<br /><em>también respira.</em></h1><p>La conversación queda aquí, esperando sin presión. Cuando quieran volver, la siguiente carta les encontrará en el mismo lugar.</p><div className="pause-card"><div><span className="pause-card__label">Estaban en</span><strong>{getCurrentAct(session).label}</strong><small>Carta {session.cardsPlayed + 1} de {session.config.totalCards} · {session.config.mode === 'pareja' ? 'Pareja' : 'Amigos'}</small></div><span className="pause-card__progress">{getSessionProgress(session)}%</span></div><div className="pause-actions"><button type="button" className="primary-button primary-button--large" onClick={onResume}>Volver a la conversación <Icon name="play" size={16} fill="currentColor" /></button><button type="button" className="ghost-button" onClick={onLeave}>Salir y cerrar esta partida</button></div></div>;
}

function FinishScreen({ session, note, onNoteChange, onSaveNote, onNew, onHome }: { session: SessionState; note: string; onNoteChange: (value: string) => void; onSaveNote: () => void; onNew: () => void; onHome: () => void; }) {
  const touchedCategories = [...new Set(session.drawnIds.map((id) => id.split('-')[1]).filter((value): value is CardCategory => value in CATEGORY_META))];
  return <div className="finish-page page-enter"><PageHeader label="el cierre" /><div className="finish-hero"><div className="finish-confetti" aria-hidden="true">{touchedCategories.map((category) => <span key={category} style={{ backgroundColor: CATEGORY_META[category].color }} />)}</div><span className="eyebrow eyebrow--with-dot"><span className="eyebrow-dot" />Gracias por estar aquí</span><h1>Algo cambió<br /><em>porque se dijo.</em></h1><p>No hace falta resolverlo todo en una conversación. A veces basta con haber mirado juntos en la misma dirección.</p></div><div className="finish-grid"><section className="finish-reflection"><span className="eyebrow">Para llevarse algo</span><h2>¿Qué quieres recordar de este momento?</h2><textarea value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="Una frase, una sensación, algo que quieras cuidar…" maxLength={320} /><div className="finish-note-actions"><span>{note.length}/320 · solo se guarda en este dispositivo</span><button type="button" className="secondary-button" onClick={onSaveNote} disabled={!note.trim()}>Guardar nota <Icon name="check" size={15} /></button></div></section><aside className="finish-summary"><span className="eyebrow">Lo que recorrieron</span><div className="finish-summary__big">{session.cardsPlayed}<small>cartas compartidas</small></div><div className="finish-colors">{touchedCategories.map((category) => <span key={category} style={{ '--card-accent': CATEGORY_META[category].color } as React.CSSProperties}><i />{CATEGORY_META[category].label}</span>)}</div><p>La próxima vez pueden elegir otra intensidad o simplemente volver a una pregunta que se quedó resonando.</p></aside></div><div className="finish-actions"><button type="button" className="primary-button primary-button--large" onClick={onNew}>Abrir otra partida <Icon name="refresh" size={16} /></button><button type="button" className="ghost-button" onClick={onHome}><Icon name="home" size={15} /> Volver al inicio</button></div></div>;
}

function SettingsScreen({ onBack, onClear, hasClearedData }: { onBack: () => void; onClear: () => void; hasClearedData: boolean }) {
  const notes = loadNotes();
  return <div className="settings-page page-enter"><PageHeader onBack={onBack} label="privacidad y ajustes" /><section className="settings-content"><span className="eyebrow">Tu espacio</span><h1>Lo que pasa aquí,<br /><em>se queda aquí.</em></h1><p>Entre nos no usa cuentas, no envía respuestas y no necesita saber quiénes son. Una partida pausada y las notas que decidan guardar viven solamente en este dispositivo.</p><div className="privacy-panel"><div><Icon name="shield" size={20} /><span><strong>Privacidad por diseño</strong><small>No hay respuestas almacenadas ni análisis de lo que comparten.</small></span></div><div><Icon name="leaf" size={20} /><span><strong>Datos mínimos</strong><small>Solo guardamos partidas pausadas y notas que escriben voluntariamente.</small></span></div><div><Icon name="lock" size={20} /><span><strong>Control total</strong><small>Desde aquí pueden borrar todo en cualquier momento.</small></span></div></div><div className="settings-danger"><div><span className="eyebrow">Zona de limpieza</span><h2>Borrar datos locales</h2><p>Elimina la partida pausada y todas las notas guardadas en este dispositivo. No se puede deshacer.</p></div><button type="button" className="danger-button" onClick={onClear} disabled={hasClearedData}>{hasClearedData ? 'Datos eliminados' : 'Borrar todo'}</button></div>{notes.length > 0 && <p className="settings-note-count">Hay {notes.length} nota{notes.length === 1 ? '' : 's'} privada{notes.length === 1 ? '' : 's'} guardada{notes.length === 1 ? '' : 's'}.</p>}</section></div>;
}

export default App;
