import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('Entre nos experience', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('guides a person from the home screen into setup', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Empezar una partida' }));
    expect(screen.getByRole('heading', { name: /¿Con quién quieres estar aquí?/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Elijan su modo' })).toBeInTheDocument();
  });

  it('supports the friends mode and starts a real card session', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Empezar una partida' }));
    fireEvent.click(screen.getByRole('button', { name: /Amigos De 2 a 8 personas/i }));
    expect(screen.getByRole('group', { name: '¿Cuántas personas?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir la primera carta' }));
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Revelar carta' }));
    // La carta gira antes de mostrar la pregunta, así que la revelación es asíncrona.
    expect(await screen.findByRole('button', { name: 'Listo, siguiente' })).toBeInTheDocument();
  });

  it('requires an explicit age confirmation for the adult extension', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Empezar una partida' }));
    fireEvent.click(screen.getByRole('button', { name: 'Desbloquear' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '¿Tienes 18 años o más?' })).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Volver' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
