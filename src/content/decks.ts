import type { Card, CardCategory, CardKind, GameMode, Intensity } from '../types';

type PromptSeed = {
  prompt: string;
  followUp?: string;
  kind?: CardKind;
  intensity?: Intensity;
};

const categoryOrder: CardCategory[] = [
  'cercania',
  'presente',
  'huellas',
  'rumbo',
  'cuidado',
  'intuicion',
];

const intensityFor = (index: number): Intensity => {
  if (index % 4 === 0 || index % 4 === 1) return 'suave';
  if (index % 4 === 2) return 'profunda';
  return 'intima';
};

const pairPrompts: Record<CardCategory, PromptSeed[]> = {
  cercania: [
    { prompt: '¿Qué detalle pequeño de mí te hace sentir acompañado/a?', followUp: 'Cuéntame cuándo lo notaste por primera vez.' },
    { prompt: '¿Qué parte de nuestra historia te gusta volver a contar?', followUp: '¿Qué cambia en ti cuando la recuerdas?' },
    { prompt: '¿En qué momento sientes que podemos ser completamente nosotros?', followUp: '¿Qué podríamos hacer para tener más momentos así?' },
    { prompt: '¿Qué admiras de la forma en que enfrento los días difíciles?', followUp: '¿Hay algo que quisieras que yo pudiera ver de mí?' },
    { prompt: '¿Qué has aprendido sobre el amor desde que estamos juntos?', followUp: '¿Qué aprendizaje todavía estamos practicando?' },
    { prompt: '¿Qué conversación nuestra te cambió de una manera inesperada?', followUp: '¿Hay algo pendiente alrededor de ese tema?' },
    { prompt: '¿Qué lugar ocupa la ternura en nuestra relación?', followUp: '¿Cómo te gusta recibirla?' },
    { prompt: '¿Qué versión de ti aparece cuando te sientes seguro/a conmigo?', followUp: '¿Cómo puedo hacerle más espacio?' },
    { prompt: '¿Qué diferencia entre nosotros terminó siendo un regalo?', followUp: '¿Qué nos ayuda a aprender esa diferencia?' },
    { prompt: '¿Qué te gustaría que nunca diéramos por sentado?', followUp: '¿Cómo podríamos recordarlo esta semana?' },
    { prompt: '¿Qué palabra describe mejor lo que hemos construido?', followUp: '¿Qué imagen te viene cuando la dices?' },
    { prompt: '¿Qué significa para ti elegirnos en este momento de la vida?', followUp: '¿Qué elección concreta podría expresarlo?' },
  ],
  presente: [
    { prompt: '¿Qué parte de tu vida está pidiendo más atención últimamente?', followUp: '¿Qué necesitarías para poder dársela?' },
    { prompt: '¿Qué te está dando energía en estos días?', followUp: '¿Cómo puedo celebrarlo contigo?' },
    { prompt: '¿Qué emoción visitas más seguido de lo que te gustaría?', followUp: '¿Qué te ayudaría a sentirla sin quedarte a solas con ella?' },
    { prompt: '¿Qué estás aprendiendo a aceptar de tu etapa actual?', followUp: '¿Qué se vuelve más ligero al nombrarlo?' },
    { prompt: '¿Qué te gustaría que yo entendiera mejor de tu rutina?', followUp: '¿Qué pregunta podría hacerte al respecto?' },
    { prompt: '¿Qué límite estás intentando cuidar?', followUp: '¿Qué apoyo se siente útil y qué apoyo no?' },
    { prompt: '¿Qué te gustaría hacer más lento?', followUp: '¿Qué primer paso sería realista?' },
    { prompt: '¿Qué decisión reciente te ha dejado orgulloso/a?', followUp: '¿Qué dice de la persona que estás siendo?' },
    { prompt: '¿Qué expectativa estás tratando de soltar?', followUp: '¿De quién o de dónde aprendiste a cargarla?' },
    { prompt: '¿Qué cosa sencilla te devuelve a ti?', followUp: '¿Cómo podríamos proteger ese ritual?' },
    { prompt: '¿Qué te cuesta pedir, incluso cuando lo necesitas?', followUp: 'Prueba a pedirlo ahora en una frase.' },
    { prompt: '¿Qué parte de tu identidad quieres cuidar más este año?', followUp: '¿Qué espacio merece ocupar en nuestra vida compartida?' },
  ],
  huellas: [
    { prompt: '¿Qué recuerdo de tu infancia todavía te acompaña con cariño?', followUp: '¿Qué sensación de ese momento extrañas?' },
    { prompt: '¿Qué persona te enseñó algo que sigues usando hoy?', followUp: '¿Qué le agradecerías si estuviera aquí?' },
    { prompt: '¿Qué etapa de tu vida te gustaría mirar con más compasión?', followUp: '¿Qué le dirías a tu versión de entonces?' },
    { prompt: '¿Qué tradición familiar te gustaría conservar o transformar?', followUp: '¿Qué parte sí quieres llevar al futuro?' },
    { prompt: '¿Qué experiencia te obligó a descubrir una fortaleza?', followUp: '¿Dónde aparece esa fortaleza ahora?' },
    { prompt: '¿Qué lugar guarda una memoria importante de ti?', followUp: '¿Qué cambiaría si pudiéramos volver juntos?' },
    { prompt: '¿Qué error terminó enseñándote algo esencial?', followUp: '¿Qué te permites perdonarte gracias a eso?' },
    { prompt: '¿Qué canción, aroma o sabor te devuelve a una época?', followUp: '¿Qué persona aparece en ese recuerdo?' },
    { prompt: '¿Cuándo sentiste por primera vez que podías tomar tus propias decisiones?', followUp: '¿Qué hiciste con esa libertad?' },
    { prompt: '¿Qué historia sobre ti ya no te representa?', followUp: '¿Qué historia nueva estás escribiendo?' },
    { prompt: '¿Qué despedida te cambió?', followUp: '¿Qué quedó contigo después de ella?' },
    { prompt: '¿Qué parte de tu pasado te cuesta contar porque temes ser juzgado/a?', followUp: '¿Qué necesitarías para sentirte escuchado/a?' },
  ],
  rumbo: [
    { prompt: '¿Qué te gustaría experimentar por primera vez conmigo?', followUp: '¿Qué nos detiene y qué nos acercaría?' },
    { prompt: '¿Qué sueño has guardado en silencio?', followUp: '¿Qué sería una manera pequeña de acercarte?' },
    { prompt: '¿Qué clase de hogar quieres seguir construyendo?', followUp: '¿Qué se sentiría diferente en ese hogar?' },
    { prompt: '¿Qué quieres que recordemos de esta etapa dentro de cinco años?', followUp: '¿Qué podemos hacer esta semana para crearlo?' },
    { prompt: '¿Qué riesgo amable te gustaría atreverte a tomar?', followUp: '¿Qué necesitarías escuchar de mí?' },
    { prompt: '¿Qué relación quieres tener con tu tiempo en el futuro?', followUp: '¿Qué actividad merece volver a tu agenda?' },
    { prompt: '¿Qué valor quieres que guíe nuestras decisiones?', followUp: '¿Dónde ya lo estamos practicando?' },
    { prompt: '¿Qué lugar te gustaría conocer en una versión tranquila de la vida?', followUp: '¿Qué haríamos allí?' },
    { prompt: '¿Qué te gustaría aprender a mi lado?', followUp: '¿Cómo sería la primera clase o intento?' },
    { prompt: '¿Qué promesa realista te gustaría hacernos?', followUp: '¿Cómo sabremos que la estamos cumpliendo?' },
    { prompt: '¿Qué quieres proteger cuando nuestra vida cambie?', followUp: '¿Qué necesitamos nombrar desde ahora?' },
    { prompt: '¿Qué futuro te emociona aunque todavía te dé un poco de miedo?', followUp: '¿Qué compañía necesitas en ese miedo?' },
  ],
  cuidado: [
    { prompt: 'Reto: mírame en silencio durante veinte segundos y después di algo que agradeces de este momento.', kind: 'reto', intensity: 'suave' },
    { prompt: 'Reto: inventemos una señal secreta para decir “necesito que estés cerca”.', kind: 'reto', intensity: 'suave' },
    { prompt: '¿Qué gesto cotidiano te hace sentir querido/a?', followUp: 'Hagámoslo visible para no dejarlo a la suerte.' },
    { prompt: 'Reto: describe una cualidad mía sin usar las palabras “bueno/a”, “lindo/a” o “especial”.', kind: 'reto' },
    { prompt: '¿Cómo te gusta que te acompañen cuando no quieres soluciones?', followUp: '¿Qué frase sí te gustaría escuchar?' },
    { prompt: 'Reto: agradece algo que el otro hace y que quizá no sabe que notas.', kind: 'reto' },
    { prompt: '¿Qué podemos reparar más rápido cuando aparece un desencuentro?', followUp: 'Diseñemos una frase para volver.' },
    { prompt: 'Reto: elijan una canción que represente cómo se sienten hoy y escúchenla juntos.', kind: 'reto' },
    { prompt: '¿Qué necesitas para sentir que una conversación difícil sigue siendo segura?', followUp: '¿Qué límite debemos respetar?' },
    { prompt: 'Reto: completa la frase “cuando estoy contigo, me doy permiso de…”', kind: 'frase' },
    { prompt: '¿Qué espacio individual quieres que celebremos más?', followUp: '¿Cómo podemos cuidarlo sin alejarnos?' },
    { prompt: 'Reto: hagan un plan de quince minutos para cuidarse mutuamente esta semana.', kind: 'reto' },
  ],
  intuicion: [
    { prompt: 'Completa sin pensarlo demasiado: “cuando nadie me mira, yo…”', kind: 'frase', intensity: 'suave' },
    { prompt: '¿Qué crees que estoy intentando decir cuando me quedo en silencio?', followUp: 'Pregúntame si tu intuición se acerca.' },
    { prompt: 'Completa: “me cuesta admitir que deseo…”', kind: 'frase' },
    { prompt: '¿Qué pensamiento automático te visita cuando algo no sale como esperabas?', followUp: '¿Qué alternativa más amable podrías practicar?' },
    { prompt: 'Completa: “una parte de mí todavía espera que…”', kind: 'frase' },
    { prompt: '¿Qué verdad te ha costado decir en voz alta?', followUp: 'Puedes decirla aquí en una sola frase.' },
    { prompt: '¿Qué juicio sobre ti estás listo/a para cuestionar?', followUp: '¿Quién serías sin ese juicio?' },
    { prompt: 'Completa: “si confiara un poco más en mí, hoy…”', kind: 'frase' },
    { prompt: '¿Qué necesitas escuchar para recordar que no tienes que poder con todo?', followUp: '¿Quieres que te lo diga ahora?' },
    { prompt: 'Completa: “me siento más yo cuando…”', kind: 'frase' },
    { prompt: '¿Qué parte de ti aparece cuando dejas de intentar agradar?', followUp: '¿Qué te gustaría que conociéramos de ella?' },
    { prompt: 'Completa: “lo que todavía no sé cómo pedir es…”', kind: 'frase' },
  ],
};

const friendPrompts: Record<CardCategory, PromptSeed[]> = {
  cercania: [
    { prompt: '¿Qué momento te hizo pensar “con estas personas sí puedo ser yo”?', followUp: '¿Qué estaba pasando alrededor?' },
    { prompt: '¿Qué cualidad de alguien en este grupo te gustaría aprender?', followUp: '¿Qué has visto hacerle que te inspira?' },
    { prompt: '¿Qué recuerdo compartido te sigue dando risa?', followUp: '¿Qué detalle casi nadie más recuerda?' },
    { prompt: '¿Qué hace que una amistad se sienta como descanso?', followUp: '¿Qué podemos hacer para tener más de eso?' },
    { prompt: '¿Qué tema podrías hablar durante horas con alguien de aquí?', followUp: '¿Qué pregunta abriría esa conversación?' },
    { prompt: '¿Qué diferencia entre ustedes hace más interesante al grupo?', followUp: '¿Cómo se nota cuando están juntos?' },
    { prompt: '¿Qué has recibido de esta amistad que no sabías que necesitabas?', followUp: '¿Cuándo lo sentiste?' },
    { prompt: '¿Qué versión de ti aparece cuando estás con tus amistades?', followUp: '¿Qué te permite hacer esa versión?' },
    { prompt: '¿Qué conversación pendiente te gustaría tener con alguien de aquí?', followUp: '¿Qué haría más fácil comenzarla?' },
    { prompt: '¿Qué significa para ti que una amistad evolucione?', followUp: '¿Qué cambio estás abrazando?' },
    { prompt: '¿Qué agradeces de la forma en que este grupo te recibe?', followUp: 'Dilo mirando a alguien en particular.' },
    { prompt: '¿Qué te gustaría que este grupo nunca perdiera?', followUp: '¿Qué gesto lo mantiene vivo?' },
  ],
  presente: [
    { prompt: '¿Qué ocupa más espacio en tu cabeza esta semana?', followUp: '¿Quieres compañía, perspectiva o solo escucha?' },
    { prompt: '¿Qué pequeño logro te gustaría que celebráramos contigo?', followUp: 'Hagámoslo ahora.' },
    { prompt: '¿Qué hábito estás intentando cambiar con paciencia?', followUp: '¿Qué ayuda sí te sirve?' },
    { prompt: '¿Qué te entusiasma del momento que estás viviendo?', followUp: '¿Qué parte quieres compartir más?' },
    { prompt: '¿Qué te cuesta explicar de tu vida actual?', followUp: '¿Qué pregunta sería más amable?' },
    { prompt: '¿Qué estás aprendiendo a priorizar?', followUp: '¿Qué tuviste que dejar fuera para hacerlo?' },
    { prompt: '¿Qué te gustaría hacer sin sentir que tienes que justificarlo?', followUp: '¿Quién podría darte permiso?' },
    { prompt: '¿Qué emoción has estado escondiendo detrás de “estoy bien”?', followUp: '¿Qué necesitas para nombrarla?' },
    { prompt: '¿Qué límite te está ayudando a estar mejor?', followUp: '¿Cómo podemos respetarlo como grupo?' },
    { prompt: '¿Qué parte de ti quieres conocer mejor?', followUp: '¿Qué experimento podrías hacer?' },
    { prompt: '¿Qué conversación te dejó pensando recientemente?', followUp: '¿Qué conclusión sigues revisando?' },
    { prompt: '¿Qué deseas que la gente cercana entienda de tu ritmo?', followUp: '¿Cómo pueden acompañarlo?' },
  ],
  huellas: [
    { prompt: '¿Qué amistad de tu historia te enseñó cómo quieres ser amigo/a?', followUp: '¿Qué aprendiste también de lo que no funcionó?' },
    { prompt: '¿Qué lugar de tu infancia visitarías con este grupo?', followUp: '¿Qué les mostrarías primero?' },
    { prompt: '¿Qué aventura pasada te gustaría repetir con otras personas?', followUp: '¿Qué harías distinto?' },
    { prompt: '¿Qué recuerdo te ayuda cuando dudas de ti?', followUp: '¿Quién más aparece en él?' },
    { prompt: '¿Qué etapa te hizo cambiar de opinión sobre lo que significa pertenecer?', followUp: '¿Qué significa ahora?' },
    { prompt: '¿Qué persona te enseñó a pedir ayuda?', followUp: '¿Qué te hubiera gustado escuchar entonces?' },
    { prompt: '¿Qué error social te hizo más considerado/a?', followUp: '¿Qué haces distinto hoy?' },
    { prompt: '¿Qué cosa que antes te daba pena hoy puedes contar con humor?', followUp: '¿Qué cambió dentro de ti?' },
    { prompt: '¿Qué despedida todavía guardas con cariño?', followUp: '¿Qué parte de esa relación permanece?' },
    { prompt: '¿Qué versión adolescente de ti se sorprendería de dónde estás?', followUp: '¿Qué le contarías?' },
    { prompt: '¿Qué tradición entre amistades te gustaría inventar?', followUp: '¿Cómo empezaría?' },
    { prompt: '¿Qué recuerdo de alguien de aquí te gustaría conservar por muchos años?', followUp: 'Díselo sin explicar demasiado.' },
  ],
  rumbo: [
    { prompt: '¿Qué plan improbable te gustaría hacer con este grupo?', followUp: '¿Qué parte sí podríamos empezar a organizar?' },
    { prompt: '¿Qué versión de tu vida estás intentando construir?', followUp: '¿Qué apoyo concreto agradecerías?' },
    { prompt: '¿Qué quieres aprender antes de que termine este año?', followUp: '¿Quién podría acompañar el primer intento?' },
    { prompt: '¿Qué miedo no quieres que decida por ti?', followUp: '¿Qué te recordaremos cuando aparezca?' },
    { prompt: '¿Qué lugar ocupa la amistad en la vida que imaginas?', followUp: '¿Qué tendría que cambiar para cuidar ese lugar?' },
    { prompt: '¿Qué celebración te gustaría organizar algún día?', followUp: '¿A quién invitarías y por qué?' },
    { prompt: '¿Qué proyecto te ilusiona aunque todavía esté en borrador?', followUp: '¿Qué nombre tendría esta etapa?' },
    { prompt: '¿Qué valor quieres practicar más en tus vínculos?', followUp: '¿Cómo sabremos que está presente?' },
    { prompt: '¿Qué aventura te da curiosidad?', followUp: '¿Qué necesitarías para decir que sí?' },
    { prompt: '¿Qué te gustaría que cambiara en tus reuniones con amistades?', followUp: '¿Qué podemos probar hoy?' },
    { prompt: '¿Qué futuro te gustaría que este grupo pudiera atestiguar?', followUp: '¿Qué primer paso merece compañía?' },
    { prompt: '¿Qué promesa te harías para no perderte en el camino?', followUp: '¿Cómo podemos recordártela?' },
  ],
  cuidado: [
    { prompt: 'Reto: cada persona diga una cosa que agradece de alguien distinto del grupo.', kind: 'reto', intensity: 'suave' },
    { prompt: 'Reto: inventen una palabra para pedir una pausa sin tener que explicarse.', kind: 'reto', intensity: 'suave' },
    { prompt: '¿Cómo te gusta que una amistad te acompañe cuando estás pasando por algo?', followUp: '¿Qué no ayuda aunque tenga buena intención?' },
    { prompt: 'Reto: alguien cuenta una anécdota breve y el grupo responde con una palabra que le dejó.', kind: 'reto' },
    { prompt: '¿Qué hace que puedas confiar en un grupo?', followUp: '¿Qué podemos practicar más?' },
    { prompt: 'Reto: manden después de esta sesión un mensaje sincero a alguien que no está aquí.', kind: 'reto' },
    { prompt: '¿Cómo reparas una amistad después de un malentendido?', followUp: '¿Qué parte te cuesta más?' },
    { prompt: 'Reto: hagan una foto mental del momento y describan qué quieren recordar de él.', kind: 'reto' },
    { prompt: '¿Qué límite te gustaría que tus amistades entendieran mejor?', followUp: '¿Cómo podemos honrarlo?' },
    { prompt: 'Reto: completa “en este grupo me siento con permiso de…”', kind: 'frase' },
    { prompt: '¿Qué señal te dice que alguien necesita compañía aunque no la pida?', followUp: '¿Cómo te acercas sin invadir?' },
    { prompt: 'Reto: elijan una fecha para volver a reunirse con intención.', kind: 'reto' },
  ],
  intuicion: [
    { prompt: 'Completa: “una amistad que me hace bien se siente como…”', kind: 'frase', intensity: 'suave' },
    { prompt: '¿Qué crees que los demás suelen malinterpretar de ti?', followUp: '¿Cómo te gustaría ser preguntado/a?' },
    { prompt: 'Completa: “cuando tengo miedo de perder a alguien, yo…”', kind: 'frase' },
    { prompt: '¿Qué pensamiento aparece cuando no responden como esperabas?', followUp: '¿Qué otra lectura podría existir?' },
    { prompt: 'Completa: “lo que me cuesta recibir de mis amistades es…”', kind: 'frase' },
    { prompt: '¿Qué verdad sobre tu forma de relacionarte estás mirando de frente?', followUp: '¿Qué te gustaría practicar distinto?' },
    { prompt: 'Completa: “me siento más libre con la gente que…”', kind: 'frase' },
    { prompt: '¿Qué parte de ti no suele entrar a una reunión?', followUp: '¿Qué la invitaría a pasar?' },
    { prompt: 'Completa: “si pudiera pedirle algo al futuro de nuestras amistades, sería…”', kind: 'frase' },
    { prompt: '¿Qué elogio te cuesta creer cuando te lo dicen?', followUp: '¿Puedes dejarlo entrar hoy?' },
    { prompt: 'Completa: “una conversación que necesito tener es…”', kind: 'frase' },
    { prompt: '¿Qué deseas que este grupo sepa de ti aunque no lo digas seguido?', followUp: 'Ahora es un buen momento.' },
  ],
};

const adultPairPrompts: PromptSeed[] = [
  { prompt: '¿Qué deseo te gustaría explorar conmigo con más libertad y menos prisa?', intensity: 'intima' },
  { prompt: '¿Qué te ayuda a sentirte deseado/a y respetado/a al mismo tiempo?', intensity: 'intima' },
  { prompt: 'Completa: “cuando me siento más conectado/a a mi cuerpo es cuando…”', kind: 'frase', intensity: 'intima' },
  { prompt: '¿Qué fantasía de intimidad te parece tierna, incluso si nunca la hemos hablado?', intensity: 'intima' },
  { prompt: '¿Qué palabra o gesto te ayuda a comunicar un sí entusiasta?', intensity: 'intima' },
  { prompt: '¿Qué te gustaría que hiciéramos más despacio?', followUp: '¿Qué señal te ayudaría a pedirlo?', intensity: 'intima' },
  { prompt: 'Reto: cada persona mencione una forma de acercamiento que sí disfruta y una que prefiere evitar.', kind: 'reto', intensity: 'intima' },
  { prompt: '¿Qué parte de nuestra intimidad te gustaría cuidar con un ritual?', intensity: 'intima' },
  { prompt: 'Completa: “me siento más libre para desear cuando…”', kind: 'frase', intensity: 'intima' },
  { prompt: '¿Qué pregunta íntima te gustaría que te hiciera más seguido?', intensity: 'intima' },
  { prompt: 'Reto: dense un abrazo largo y nombren qué necesitan después de él.', kind: 'reto', intensity: 'intima' },
  { prompt: '¿Qué significa para ti sentirnos cerca sin necesidad de tener sexo?', intensity: 'intima' },
];

const adultFriendPrompts: PromptSeed[] = [
  { prompt: '¿Qué conversación adulta te gustaría poder tener con tus amistades sin vergüenza?', intensity: 'intima' },
  { prompt: '¿Qué límite te parece importante nombrar cuando una amistad se vuelve muy cercana?', intensity: 'intima' },
  { prompt: 'Completa: “una relación sana me permite…”', kind: 'frase', intensity: 'intima' },
  { prompt: '¿Qué has aprendido de tus relaciones pasadas que quieres llevar a tus amistades?', intensity: 'intima' },
  { prompt: '¿Qué parte de tu vida afectiva proteges más de la opinión ajena?', intensity: 'intima' },
  { prompt: '¿Qué significa para ti la intimidad que no es romántica?', intensity: 'intima' },
  { prompt: 'Reto: cada persona nombra una forma de pedir consentimiento que le parece natural.', kind: 'reto', intensity: 'intima' },
  { prompt: '¿Qué mito sobre la adultez te gustaría dejar atrás?', intensity: 'intima' },
  { prompt: 'Completa: “me siento seguro/a hablando de deseo cuando…”', kind: 'frase', intensity: 'intima' },
  { prompt: '¿Qué conversación sobre límites te habría gustado tener antes?', intensity: 'intima' },
  { prompt: 'Reto: cada persona comparte un cuidado que quiere recibir sin tener que ganárselo.', kind: 'reto', intensity: 'intima' },
  { prompt: '¿Qué relación quieres construir con tu propio deseo?', intensity: 'intima' },
];

const buildDeck = (mode: GameMode, source: Record<CardCategory, PromptSeed[]>): Card[] =>
  categoryOrder.flatMap((category) =>
    source[category].map((seed, index) => ({
      id: `${mode}-${category}-${index + 1}`,
      mode,
      category,
      intensity: seed.intensity ?? intensityFor(index),
      kind: seed.kind ?? 'pregunta',
      prompt: seed.prompt,
      followUp: seed.followUp,
    })),
  );

const buildAdultDeck = (mode: GameMode, seeds: PromptSeed[]): Card[] =>
  seeds.map((seed, index) => ({
    id: `${mode}-adult-${index + 1}`,
    mode,
    category: index % 2 === 0 ? 'cuidado' : 'intuicion',
    intensity: 'intima',
    kind: seed.kind ?? 'pregunta',
    prompt: seed.prompt,
    followUp: seed.followUp,
    adult: true,
  }));

export const DECKS: Card[] = [
  ...buildDeck('pareja', pairPrompts),
  ...buildDeck('amigos', friendPrompts),
  ...buildAdultDeck('pareja', adultPairPrompts),
  ...buildAdultDeck('amigos', adultFriendPrompts),
];

export const getDeckForMode = (mode: GameMode, adultEnabled: boolean): Card[] =>
  DECKS.filter((card) => card.mode === mode && (adultEnabled || !card.adult));
