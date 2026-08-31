# Entre nos

Un juego de cartas para abrir conversaciones que sí importan.

**En vivo:** https://entre-nos-iota.vercel.app

## Qué es

Una sesión de 12 cartas repartidas en tres actos — Abrir, Profundizar, Integrar —
para jugar en pareja o entre amigos (hasta 8 personas). Se elige la intensidad
(suave, profunda o íntima) y el juego va guiando los turnos.

No hay cuentas ni servidor: la partida pausada y las notas viven solo en el
`localStorage` del dispositivo. Es una PWA, así que se puede instalar y usar sin
conexión.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm test         # tests con Vitest
npm run build    # build de producción
```

## Estructura

- `src/lib/game-engine.ts` — motor de partida, sin dependencias de UI
- `src/content/decks.ts` — los mazos de preguntas
- `src/App.tsx` — la interfaz
- `src/lib/storage.ts` — persistencia en `localStorage`

## Despliegue

Conectado a Vercel: cada push a `main` construye y publica en producción
automáticamente.
