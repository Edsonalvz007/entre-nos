import type { Card, CardCategory, CardKind, GameMode, Intensity, WildKind } from '../types';

type PromptSeed = {
  prompt: string;
  followUp?: string;
  kind?: CardKind;
};

/**
 * Cada nivel tiene su propio conjunto de preguntas. Elegir "profunda" ya no
 * arrastra las cartas de "suave": son mazos distintos que no se solapan.
 */
type IntensityDeck = Record<Intensity, PromptSeed[]>;

const categoryOrder: CardCategory[] = [
  'cercania',
  'presente',
  'huellas',
  'rumbo',
  'cuidado',
  'intuicion',
];

const intensityOrder: Intensity[] = ['suave', 'profunda', 'intima'];

const pairPrompts: Record<CardCategory, IntensityDeck> = {
  cercania: {
    suave: [
      { prompt: '¿Qué detalle pequeño de mí te hace sentir acompañado/a?', followUp: 'Cuéntame cuándo lo notaste por primera vez.' },
      { prompt: '¿Qué parte de nuestra historia te gusta volver a contar?', followUp: '¿Qué cambia en ti cuando la recuerdas?' },
      { prompt: '¿Qué palabra describe mejor lo que hemos construido?', followUp: '¿Qué imagen te viene cuando la dices?' },
      { prompt: '¿Qué diferencia entre nosotros terminó siendo un regalo?', followUp: '¿Qué nos ayuda a aprender esa diferencia?' },
      { prompt: '¿Qué te gustaría que nunca diéramos por sentado?', followUp: '¿Cómo podríamos recordarlo esta semana?' },
      { prompt: '¿Qué lugar ocupa la ternura en nuestra relación?', followUp: '¿Cómo te gusta recibirla?' },
    ],
    profunda: [
      { prompt: '¿En qué momento sientes que podemos ser completamente nosotros?', followUp: '¿Qué podríamos hacer para tener más momentos así?' },
      { prompt: '¿Qué has aprendido sobre el amor desde que estamos juntos?', followUp: '¿Qué aprendizaje todavía estamos practicando?' },
      { prompt: '¿Qué conversación nuestra te cambió de una manera inesperada?', followUp: '¿Hay algo pendiente alrededor de ese tema?' },
      { prompt: '¿Qué parte de mí te costó entender al principio?', followUp: '¿Qué te ayudó a acercarte a ella?' },
      { prompt: '¿En qué te sientes solo/a aunque estemos juntos?', followUp: '¿Qué haría más corta esa distancia?' },
    ],
    intima: [
      { prompt: '¿Qué admiras de la forma en que enfrento los días difíciles?', followUp: '¿Hay algo que quisieras que yo pudiera ver de mí?' },
      { prompt: '¿Qué versión de ti aparece cuando te sientes seguro/a conmigo?', followUp: '¿Cómo puedo hacerle más espacio?' },
      { prompt: '¿Qué significa para ti elegirnos en este momento de la vida?', followUp: '¿Qué elección concreta podría expresarlo?' },
      { prompt: '¿Qué miedo sobre nosotros no te has atrevido a decir en voz alta?', followUp: '¿Qué necesitas de mí para poder decirlo?' },
      { prompt: '¿Qué te da miedo que yo descubra de ti?', followUp: '¿Qué cambiaría si lo supiera y me quedara?' },
    ],
  },
  presente: {
    suave: [
      { prompt: '¿Qué te está dando energía en estos días?', followUp: '¿Cómo puedo celebrarlo contigo?' },
      { prompt: '¿Qué cosa sencilla te devuelve a ti?', followUp: '¿Cómo podríamos proteger ese ritual?' },
      { prompt: '¿Qué decisión reciente te ha dejado orgulloso/a?', followUp: '¿Qué dice de la persona que estás siendo?' },
      { prompt: '¿Qué te gustaría que yo entendiera mejor de tu rutina?', followUp: '¿Qué pregunta podría hacerte al respecto?' },
      { prompt: '¿Qué te gustaría hacer más lento?', followUp: '¿Qué primer paso sería realista?' },
      { prompt: '¿Qué parte de tu vida está pidiendo más atención últimamente?', followUp: '¿Qué necesitarías para poder dársela?' },
    ],
    profunda: [
      { prompt: '¿Qué estás aprendiendo a aceptar de tu etapa actual?', followUp: '¿Qué se vuelve más ligero al nombrarlo?' },
      { prompt: '¿Qué límite estás intentando cuidar?', followUp: '¿Qué apoyo se siente útil y qué apoyo no?' },
      { prompt: '¿Qué expectativa estás tratando de soltar?', followUp: '¿De quién o de dónde aprendiste a cargarla?' },
      { prompt: '¿Qué parte de tu identidad quieres cuidar más este año?', followUp: '¿Qué espacio merece ocupar en nuestra vida compartida?' },
      { prompt: '¿Qué te cansa de sostener sin que se note?', followUp: '¿Qué parte podría soltar en mis manos?' },
    ],
    intima: [
      { prompt: '¿Qué emoción visitas más seguido de lo que te gustaría?', followUp: '¿Qué te ayudaría a sentirla sin quedarte a solas con ella?' },
      { prompt: '¿Qué te cuesta pedir, incluso cuando lo necesitas?', followUp: 'Prueba a pedirlo ahora en una frase.' },
      { prompt: '¿Qué versión de ti aparece cuando estás al límite?', followUp: '¿Cómo prefieres que te trate cuando llega?' },
      { prompt: '¿Qué necesitas de mí ahora mismo y no has sabido nombrar?', followUp: 'Dilo aunque salga imperfecto.' },
      { prompt: '¿Qué te avergüenza de lo que estás viviendo?', followUp: '¿Qué se afloja al decirlo en voz alta?' },
    ],
  },
  huellas: {
    suave: [
      { prompt: '¿Qué recuerdo de tu infancia todavía te acompaña con cariño?', followUp: '¿Qué sensación de ese momento extrañas?' },
      { prompt: '¿Qué canción, aroma o sabor te devuelve a una época?', followUp: '¿Qué persona aparece en ese recuerdo?' },
      { prompt: '¿Qué persona te enseñó algo que sigues usando hoy?', followUp: '¿Qué le agradecerías si estuviera aquí?' },
      { prompt: '¿Qué lugar guarda una memoria importante de ti?', followUp: '¿Qué cambiaría si pudiéramos volver juntos?' },
      { prompt: '¿Qué tradición familiar te gustaría conservar o transformar?', followUp: '¿Qué parte sí quieres llevar al futuro?' },
      { prompt: '¿Cuándo sentiste por primera vez que podías tomar tus propias decisiones?', followUp: '¿Qué hiciste con esa libertad?' },
    ],
    profunda: [
      { prompt: '¿Qué experiencia te obligó a descubrir una fortaleza?', followUp: '¿Dónde aparece esa fortaleza ahora?' },
      { prompt: '¿Qué etapa de tu vida te gustaría mirar con más compasión?', followUp: '¿Qué le dirías a tu versión de entonces?' },
      { prompt: '¿Qué historia sobre ti ya no te representa?', followUp: '¿Qué historia nueva estás escribiendo?' },
      { prompt: '¿Qué error terminó enseñándote algo esencial?', followUp: '¿Qué te permites perdonarte gracias a eso?' },
      { prompt: '¿Qué aprendiste del amor mirando a quienes te criaron?', followUp: '¿Qué decidiste hacer distinto?' },
    ],
    intima: [
      { prompt: '¿Qué despedida te cambió?', followUp: '¿Qué quedó contigo después de ella?' },
      { prompt: '¿Qué parte de tu pasado te cuesta contar porque temes ser juzgado/a?', followUp: '¿Qué necesitarías para sentirte escuchado/a?' },
      { prompt: '¿Qué herida vieja sigue apareciendo en nuestra relación?', followUp: '¿Cómo la reconocemos cuando llega?' },
      { prompt: '¿A quién no has terminado de perdonar?', followUp: '¿Qué te pediría hoy tu paz?' },
      { prompt: '¿Qué hiciste alguna vez que todavía te cuesta contarme?', followUp: 'Puedes decir solo la parte que quieras.' },
    ],
  },
  rumbo: {
    suave: [
      { prompt: '¿Qué te gustaría experimentar por primera vez conmigo?', followUp: '¿Qué nos detiene y qué nos acercaría?' },
      { prompt: '¿Qué lugar te gustaría conocer en una versión tranquila de la vida?', followUp: '¿Qué haríamos allí?' },
      { prompt: '¿Qué te gustaría aprender a mi lado?', followUp: '¿Cómo sería la primera clase o intento?' },
      { prompt: '¿Qué quieres que recordemos de esta etapa dentro de cinco años?', followUp: '¿Qué podemos hacer esta semana para crearlo?' },
      { prompt: '¿Qué relación quieres tener con tu tiempo en el futuro?', followUp: '¿Qué actividad merece volver a tu agenda?' },
      { prompt: '¿Qué clase de hogar quieres seguir construyendo?', followUp: '¿Qué se sentiría diferente en ese hogar?' },
    ],
    profunda: [
      { prompt: '¿Qué valor quieres que guíe nuestras decisiones?', followUp: '¿Dónde ya lo estamos practicando?' },
      { prompt: '¿Qué riesgo amable te gustaría atreverte a tomar?', followUp: '¿Qué necesitarías escuchar de mí?' },
      { prompt: '¿Qué promesa realista te gustaría hacernos?', followUp: '¿Cómo sabremos que la estamos cumpliendo?' },
      { prompt: '¿Qué quieres proteger cuando nuestra vida cambie?', followUp: '¿Qué necesitamos nombrar desde ahora?' },
      { prompt: '¿Qué tendría que pasar para que esto siga valiendo la pena en diez años?', followUp: '¿Qué depende de nosotros y qué no?' },
    ],
    intima: [
      { prompt: '¿Qué sueño has guardado en silencio?', followUp: '¿Qué sería una manera pequeña de acercarte?' },
      { prompt: '¿Qué futuro te emociona aunque todavía te dé un poco de miedo?', followUp: '¿Qué compañía necesitas en ese miedo?' },
      { prompt: '¿Qué renuncia has hecho por nosotros que nunca mencionaste?', followUp: '¿Qué te gustaría recuperar de eso?' },
      { prompt: '¿Qué deseo tuyo te da miedo que no quepa en esta vida juntos?', followUp: '¿Cómo podríamos hacerle sitio?' },
      { prompt: '¿Qué necesitarías prometernos hoy por si algún día esto se pone cuesta arriba?', followUp: '¿Qué versión de nosotros quieres que sobreviva?' },
    ],
  },
  cuidado: {
    suave: [
      { prompt: 'Reto: mírame en silencio durante veinte segundos y después di algo que agradeces de este momento.', kind: 'reto' },
      { prompt: 'Reto: inventemos una señal secreta para decir “necesito que estés cerca”.', kind: 'reto' },
      { prompt: '¿Qué gesto cotidiano te hace sentir querido/a?', followUp: 'Hagámoslo visible para no dejarlo a la suerte.' },
      { prompt: 'Reto: agradece algo que el otro hace y que quizá no sabe que notas.', kind: 'reto' },
      { prompt: 'Reto: elijan una canción que represente cómo se sienten hoy y escúchenla juntos.', kind: 'reto' },
      { prompt: 'Reto: describe una cualidad mía sin usar las palabras “bueno/a”, “lindo/a” o “especial”.', kind: 'reto' },
    ],
    profunda: [
      { prompt: '¿Cómo te gusta que te acompañen cuando no quieres soluciones?', followUp: '¿Qué frase sí te gustaría escuchar?' },
      { prompt: '¿Qué podemos reparar más rápido cuando aparece un desencuentro?', followUp: 'Diseñemos una frase para volver.' },
      { prompt: '¿Qué espacio individual quieres que celebremos más?', followUp: '¿Cómo podemos cuidarlo sin alejarnos?' },
      { prompt: 'Reto: hagan un plan de quince minutos para cuidarse mutuamente esta semana.', kind: 'reto' },
      { prompt: '¿Qué te hace sentir cuidado/a cuando estás enojado/a conmigo?', followUp: '¿Qué empeora las cosas aunque yo crea que ayuda?' },
    ],
    intima: [
      { prompt: '¿Qué necesitas para sentir que una conversación difícil sigue siendo segura?', followUp: '¿Qué límite debemos respetar?' },
      { prompt: 'Completa la frase: “cuando estoy contigo, me doy permiso de…”', kind: 'frase' },
      { prompt: '¿En qué te he fallado sin darme cuenta?', followUp: '¿Qué reparación se sentiría real?' },
      { prompt: 'Reto: pide algo que llevas tiempo queriendo pedir. Sin explicarlo ni justificarlo.', kind: 'reto' },
      { prompt: '¿Qué parte de cuidarme te pesa?', followUp: '¿Qué necesitas soltar sin culpa?' },
    ],
  },
  intuicion: {
    suave: [
      { prompt: 'Completa sin pensarlo demasiado: “cuando nadie me mira, yo…”', kind: 'frase' },
      { prompt: 'Completa: “me siento más yo cuando…”', kind: 'frase' },
      { prompt: 'Completa: “si confiara un poco más en mí, hoy…”', kind: 'frase' },
      { prompt: '¿Qué crees que estoy intentando decir cuando me quedo en silencio?', followUp: 'Pregúntame si tu intuición se acerca.' },
      { prompt: 'Completa: “una parte de mí todavía espera que…”', kind: 'frase' },
      { prompt: 'Completa: “hoy mi cuerpo me está pidiendo…”', kind: 'frase' },
    ],
    profunda: [
      { prompt: '¿Qué pensamiento automático te visita cuando algo no sale como esperabas?', followUp: '¿Qué alternativa más amable podrías practicar?' },
      { prompt: '¿Qué juicio sobre ti estás listo/a para cuestionar?', followUp: '¿Quién serías sin ese juicio?' },
      { prompt: '¿Qué parte de ti aparece cuando dejas de intentar agradar?', followUp: '¿Qué te gustaría que conociéramos de ella?' },
      { prompt: 'Completa: “lo que todavía no sé cómo pedir es…”', kind: 'frase' },
      { prompt: '¿Qué te dice tu intuición sobre nosotros que la razón discute?', followUp: '¿A cuál de las dos le haces más caso?' },
    ],
    intima: [
      { prompt: 'Completa: “me cuesta admitir que deseo…”', kind: 'frase' },
      { prompt: '¿Qué verdad te ha costado decir en voz alta?', followUp: 'Puedes decirla aquí en una sola frase.' },
      { prompt: '¿Qué necesitas escuchar para recordar que no tienes que poder con todo?', followUp: '¿Quieres que te lo diga ahora?' },
      { prompt: 'Completa: “la mentira más amable que me digo es…”', kind: 'frase' },
      { prompt: '¿Qué sabes de ti que preferirías no saber?', followUp: '¿Qué haría más ligero cargarlo acompañado/a?' },
    ],
  },
};

const friendPrompts: Record<CardCategory, IntensityDeck> = {
  cercania: {
    suave: [
      { prompt: '¿Qué recuerdo compartido te sigue dando risa?', followUp: '¿Qué detalle casi nadie más recuerda?' },
      { prompt: '¿Qué cualidad de alguien en este grupo te gustaría aprender?', followUp: '¿Qué has visto hacerle que te inspira?' },
      { prompt: '¿Qué tema podrías hablar durante horas con alguien de aquí?', followUp: '¿Qué pregunta abriría esa conversación?' },
      { prompt: '¿Qué hace que una amistad se sienta como descanso?', followUp: '¿Qué podemos hacer para tener más de eso?' },
      { prompt: '¿Qué diferencia entre ustedes hace más interesante al grupo?', followUp: '¿Cómo se nota cuando están juntos?' },
      { prompt: '¿Qué agradeces de la forma en que este grupo te recibe?', followUp: 'Dilo mirando a alguien en particular.' },
    ],
    profunda: [
      { prompt: '¿Qué momento te hizo pensar “con estas personas sí puedo ser yo”?', followUp: '¿Qué estaba pasando alrededor?' },
      { prompt: '¿Qué has recibido de esta amistad que no sabías que necesitabas?', followUp: '¿Cuándo lo sentiste?' },
      { prompt: '¿Qué significa para ti que una amistad evolucione?', followUp: '¿Qué cambio estás abrazando?' },
      { prompt: '¿Qué te gustaría que este grupo nunca perdiera?', followUp: '¿Qué gesto lo mantiene vivo?' },
      { prompt: '¿Qué has dejado de contarle al grupo sin querer?', followUp: '¿Qué haría más fácil retomarlo?' },
    ],
    intima: [
      { prompt: '¿Qué versión de ti aparece cuando estás con tus amistades?', followUp: '¿Qué te permite hacer esa versión?' },
      { prompt: '¿Qué conversación pendiente te gustaría tener con alguien de aquí?', followUp: '¿Qué haría más fácil comenzarla?' },
      { prompt: '¿A quién de aquí le debes una disculpa que nunca diste?', followUp: 'Puedes empezarla ahora si quieres.' },
      { prompt: '¿Qué te da miedo que este grupo piense de ti?', followUp: '¿Qué te gustaría escuchar en respuesta?' },
      { prompt: '¿Cuándo te has sentido solo/a dentro de este grupo?', followUp: '¿Qué habría cambiado las cosas?' },
    ],
  },
  presente: {
    suave: [
      { prompt: '¿Qué pequeño logro te gustaría que celebráramos contigo?', followUp: 'Hagámoslo ahora.' },
      { prompt: '¿Qué te entusiasma del momento que estás viviendo?', followUp: '¿Qué parte quieres compartir más?' },
      { prompt: '¿Qué ocupa más espacio en tu cabeza esta semana?', followUp: '¿Quieres compañía, perspectiva o solo escucha?' },
      { prompt: '¿Qué conversación te dejó pensando recientemente?', followUp: '¿Qué conclusión sigues revisando?' },
      { prompt: '¿Qué hábito estás intentando cambiar con paciencia?', followUp: '¿Qué ayuda sí te sirve?' },
      { prompt: '¿Qué estás aprendiendo a priorizar?', followUp: '¿Qué tuviste que dejar fuera para hacerlo?' },
    ],
    profunda: [
      { prompt: '¿Qué te cuesta explicar de tu vida actual?', followUp: '¿Qué pregunta sería más amable?' },
      { prompt: '¿Qué límite te está ayudando a estar mejor?', followUp: '¿Cómo podemos respetarlo como grupo?' },
      { prompt: '¿Qué te gustaría hacer sin sentir que tienes que justificarlo?', followUp: '¿Quién podría darte permiso?' },
      { prompt: '¿Qué deseas que la gente cercana entienda de tu ritmo?', followUp: '¿Cómo pueden acompañarlo?' },
      { prompt: '¿Qué parte de tu vida estás viviendo en automático?', followUp: '¿Qué la despertaría?' },
    ],
    intima: [
      { prompt: '¿Qué emoción has estado escondiendo detrás de “estoy bien”?', followUp: '¿Qué necesitas para nombrarla?' },
      { prompt: '¿Qué parte de ti quieres conocer mejor?', followUp: '¿Qué experimento podrías hacer?' },
      { prompt: '¿Qué te está costando más de lo que aparentas?', followUp: '¿Qué tipo de ayuda no te da vergüenza recibir?' },
      { prompt: '¿De qué te estás escondiendo ahora mismo?', followUp: '¿Qué pasaría si dejaras de hacerlo?' },
      { prompt: '¿Qué envidia sana te ha enseñado algo sobre lo que quieres?', followUp: '¿Qué harías con eso?' },
    ],
  },
  huellas: {
    suave: [
      { prompt: '¿Qué lugar de tu infancia visitarías con este grupo?', followUp: '¿Qué les mostrarías primero?' },
      { prompt: '¿Qué aventura pasada te gustaría repetir con otras personas?', followUp: '¿Qué harías distinto?' },
      { prompt: '¿Qué cosa que antes te daba pena hoy puedes contar con humor?', followUp: '¿Qué cambió dentro de ti?' },
      { prompt: '¿Qué versión adolescente de ti se sorprendería de dónde estás?', followUp: '¿Qué le contarías?' },
      { prompt: '¿Qué tradición entre amistades te gustaría inventar?', followUp: '¿Cómo empezaría?' },
      { prompt: '¿Qué recuerdo te ayuda cuando dudas de ti?', followUp: '¿Quién más aparece en él?' },
    ],
    profunda: [
      { prompt: '¿Qué amistad de tu historia te enseñó cómo quieres ser amigo/a?', followUp: '¿Qué aprendiste también de lo que no funcionó?' },
      { prompt: '¿Qué etapa te hizo cambiar de opinión sobre lo que significa pertenecer?', followUp: '¿Qué significa ahora?' },
      { prompt: '¿Qué error social te hizo más considerado/a?', followUp: '¿Qué haces distinto hoy?' },
      { prompt: '¿Qué persona te enseñó a pedir ayuda?', followUp: '¿Qué te hubiera gustado escuchar entonces?' },
      { prompt: '¿Qué amistad dejaste ir y todavía piensas?', followUp: '¿Qué te dio antes de terminar?' },
    ],
    intima: [
      { prompt: '¿Qué despedida todavía guardas con cariño?', followUp: '¿Qué parte de esa relación permanece?' },
      { prompt: '¿Qué recuerdo de alguien de aquí te gustaría conservar por muchos años?', followUp: 'Díselo sin explicar demasiado.' },
      { prompt: '¿Qué te hicieron alguna vez que cambió tu forma de confiar?', followUp: '¿Qué estás recuperando desde entonces?' },
      { prompt: '¿De qué etapa tuya te avergüenzas sin merecerlo?', followUp: '¿Qué le dirías hoy a esa persona?' },
      { prompt: '¿Qué le debes a alguien que ya no está en tu vida?', followUp: 'Dilo aquí, aunque no pueda escucharlo.' },
    ],
  },
  rumbo: {
    suave: [
      { prompt: '¿Qué plan improbable te gustaría hacer con este grupo?', followUp: '¿Qué parte sí podríamos empezar a organizar?' },
      { prompt: '¿Qué quieres aprender antes de que termine este año?', followUp: '¿Quién podría acompañar el primer intento?' },
      { prompt: '¿Qué celebración te gustaría organizar algún día?', followUp: '¿A quién invitarías y por qué?' },
      { prompt: '¿Qué aventura te da curiosidad?', followUp: '¿Qué necesitarías para decir que sí?' },
      { prompt: '¿Qué te gustaría que cambiara en tus reuniones con amistades?', followUp: '¿Qué podemos probar hoy?' },
      { prompt: '¿Qué proyecto te ilusiona aunque todavía esté en borrador?', followUp: '¿Qué nombre tendría esta etapa?' },
    ],
    profunda: [
      { prompt: '¿Qué versión de tu vida estás intentando construir?', followUp: '¿Qué apoyo concreto agradecerías?' },
      { prompt: '¿Qué valor quieres practicar más en tus vínculos?', followUp: '¿Cómo sabremos que está presente?' },
      { prompt: '¿Qué lugar ocupa la amistad en la vida que imaginas?', followUp: '¿Qué tendría que cambiar para cuidar ese lugar?' },
      { prompt: '¿Qué futuro te gustaría que este grupo pudiera atestiguar?', followUp: '¿Qué primer paso merece compañía?' },
      { prompt: '¿Qué estás postergando porque te da miedo intentarlo?', followUp: '¿Qué haría más pequeño el primer paso?' },
    ],
    intima: [
      { prompt: '¿Qué miedo no quieres que decida por ti?', followUp: '¿Qué te recordaremos cuando aparezca?' },
      { prompt: '¿Qué promesa te harías para no perderte en el camino?', followUp: '¿Cómo podemos recordártela?' },
      { prompt: '¿Qué vida estás viviendo porque alguien más la eligió por ti?', followUp: '¿Qué parte quieres reescribir?' },
      { prompt: '¿Qué te dirías dentro de diez años si no cambias nada?', followUp: '¿Qué haría distinta esa carta?' },
      { prompt: '¿Qué estás dispuesto/a a perder por lo que quieres?', followUp: '¿Qué no estás dispuesto/a a perder?' },
    ],
  },
  cuidado: {
    suave: [
      { prompt: 'Reto: cada persona diga una cosa que agradece de alguien distinto del grupo.', kind: 'reto' },
      { prompt: 'Reto: inventen una palabra para pedir una pausa sin tener que explicarse.', kind: 'reto' },
      { prompt: 'Reto: alguien cuenta una anécdota breve y el grupo responde con una palabra que le dejó.', kind: 'reto' },
      { prompt: 'Reto: hagan una foto mental del momento y describan qué quieren recordar de él.', kind: 'reto' },
      { prompt: '¿Qué hace que puedas confiar en un grupo?', followUp: '¿Qué podemos practicar más?' },
      { prompt: 'Reto: elijan una fecha para volver a reunirse con intención.', kind: 'reto' },
    ],
    profunda: [
      { prompt: '¿Cómo te gusta que una amistad te acompañe cuando estás pasando por algo?', followUp: '¿Qué no ayuda aunque tenga buena intención?' },
      { prompt: '¿Cómo reparas una amistad después de un malentendido?', followUp: '¿Qué parte te cuesta más?' },
      { prompt: '¿Qué señal te dice que alguien necesita compañía aunque no la pida?', followUp: '¿Cómo te acercas sin invadir?' },
      { prompt: 'Reto: manden después de esta sesión un mensaje sincero a alguien que no está aquí.', kind: 'reto' },
      { prompt: '¿Qué te cuesta perdonar en una amistad?', followUp: '¿Dónde está tu límite real?' },
    ],
    intima: [
      { prompt: '¿Qué límite te gustaría que tus amistades entendieran mejor?', followUp: '¿Cómo podemos honrarlo?' },
      { prompt: 'Completa: “en este grupo me siento con permiso de…”', kind: 'frase' },
      { prompt: '¿Cuándo has necesitado a este grupo y no supiste pedirlo?', followUp: '¿Qué señal deberíamos aprender a leer?' },
      { prompt: 'Reto: dile a alguien del grupo algo que te ha costado decirle. Sin adornos.', kind: 'reto' },
      { prompt: '¿Qué te duele que se haya vuelto costumbre entre nosotros?', followUp: '¿Qué querrías recuperar?' },
    ],
  },
  intuicion: {
    suave: [
      { prompt: 'Completa: “una amistad que me hace bien se siente como…”', kind: 'frase' },
      { prompt: 'Completa: “me siento más libre con la gente que…”', kind: 'frase' },
      { prompt: '¿Qué crees que los demás suelen malinterpretar de ti?', followUp: '¿Cómo te gustaría ser preguntado/a?' },
      { prompt: 'Completa: “si pudiera pedirle algo al futuro de nuestras amistades, sería…”', kind: 'frase' },
      { prompt: 'Completa: “una conversación que necesito tener es…”', kind: 'frase' },
      { prompt: 'Completa: “cuando entro a un lugar nuevo, lo primero que hago es…”', kind: 'frase' },
    ],
    profunda: [
      { prompt: '¿Qué pensamiento aparece cuando no responden como esperabas?', followUp: '¿Qué otra lectura podría existir?' },
      { prompt: '¿Qué verdad sobre tu forma de relacionarte estás mirando de frente?', followUp: '¿Qué te gustaría practicar distinto?' },
      { prompt: '¿Qué parte de ti no suele entrar a una reunión?', followUp: '¿Qué la invitaría a pasar?' },
      { prompt: 'Completa: “lo que me cuesta recibir de mis amistades es…”', kind: 'frase' },
      { prompt: '¿Qué papel terminas ocupando siempre en un grupo?', followUp: '¿Lo elegiste o te lo dieron?' },
    ],
    intima: [
      { prompt: 'Completa: “cuando tengo miedo de perder a alguien, yo…”', kind: 'frase' },
      { prompt: '¿Qué elogio te cuesta creer cuando te lo dicen?', followUp: '¿Puedes dejarlo entrar hoy?' },
      { prompt: '¿Qué deseas que este grupo sepa de ti aunque no lo digas seguido?', followUp: 'Ahora es un buen momento.' },
      { prompt: 'Completa: “finjo estar bien sobre todo cuando…”', kind: 'frase' },
      { prompt: '¿Qué crees que la gente ve en ti que tú no ves?', followUp: 'Pregúntaselo al grupo ahora.' },
    ],
  },
};

const adultPairPrompts: PromptSeed[] = [
  { prompt: '¿Qué deseo te gustaría explorar conmigo con más libertad y menos prisa?' },
  { prompt: '¿Qué te ayuda a sentirte deseado/a y respetado/a al mismo tiempo?' },
  { prompt: 'Completa: “cuando me siento más conectado/a a mi cuerpo es cuando…”', kind: 'frase' },
  { prompt: '¿Qué fantasía de intimidad te parece tierna, incluso si nunca la hemos hablado?' },
  { prompt: '¿Qué palabra o gesto te ayuda a comunicar un sí entusiasta?' },
  { prompt: '¿Qué te gustaría que hiciéramos más despacio?', followUp: '¿Qué señal te ayudaría a pedirlo?' },
  { prompt: 'Reto: cada persona mencione una forma de acercamiento que sí disfruta y una que prefiere evitar.', kind: 'reto' },
  { prompt: '¿Qué parte de nuestra intimidad te gustaría cuidar con un ritual?' },
  { prompt: 'Completa: “me siento más libre para desear cuando…”', kind: 'frase' },
  { prompt: '¿Qué pregunta íntima te gustaría que te hiciera más seguido?' },
  { prompt: 'Reto: dense un abrazo largo y nombren qué necesitan después de él.', kind: 'reto' },
  { prompt: '¿Qué significa para ti sentirnos cerca sin necesidad de tener sexo?' },
];

const adultFriendPrompts: PromptSeed[] = [
  { prompt: '¿Qué conversación adulta te gustaría poder tener con tus amistades sin vergüenza?' },
  { prompt: '¿Qué límite te parece importante nombrar cuando una amistad se vuelve muy cercana?' },
  { prompt: 'Completa: “una relación sana me permite…”', kind: 'frase' },
  { prompt: '¿Qué has aprendido de tus relaciones pasadas que quieres llevar a tus amistades?' },
  { prompt: '¿Qué parte de tu vida afectiva proteges más de la opinión ajena?' },
  { prompt: '¿Qué significa para ti la intimidad que no es romántica?' },
  { prompt: 'Reto: cada persona nombra una forma de pedir consentimiento que le parece natural.', kind: 'reto' },
  { prompt: '¿Qué mito sobre la adultez te gustaría dejar atrás?' },
  { prompt: 'Completa: “me siento seguro/a hablando de deseo cuando…”', kind: 'frase' },
  { prompt: '¿Qué conversación sobre límites te habría gustado tener antes?' },
  { prompt: 'Reto: cada persona comparte un cuidado que quiere recibir sin tener que ganárselo.', kind: 'reto' },
  { prompt: '¿Qué relación quieres construir con tu propio deseo?' },
];

type WildSeed = {
  wild: WildKind;
  title: string;
  prompt: string;
  /** Si se omite, el comodín sirve para los dos modos. */
  modes?: GameMode[];
  /** Solo aparece con la extensión 18+ activada. */
  adult?: boolean;
};

const wildSeeds: WildSeed[] = [
  // Mecánicas: alteran el orden de la ronda.
  { wild: 'reversa', title: 'La ronda da media vuelta', prompt: 'A partir de ahora se juega en sentido contrario. Le toca a quien acaba de responder antes.', modes: ['amigos'] },
  { wild: 'salta', title: 'Alguien se salva', prompt: 'La siguiente persona se libra de esta ronda. El turno salta por encima de ella.', modes: ['amigos'] },
  { wild: 'salta', title: 'Te tocó otra vez', prompt: 'Tu persona se salva de esta. La siguiente carta vuelve a ser tuya.', modes: ['pareja'] },
  { wild: 'doble', title: 'Dos seguidas', prompt: 'Te quedas también con la próxima carta. Nadie te va a rescatar.' },
  { wild: 'tema', title: 'Tú mandas', prompt: 'Elige de qué va a hablar la siguiente carta. Escoge con maldad o con cariño, tú decides.' },

  // Prendas: retos con tono pícaro.
  { wild: 'reto', title: 'Sin filtro', prompt: 'Di la primera cosa honesta que se te venga a la cabeza sobre esta conversación. Sin suavizarla.' },
  { wild: 'reto', title: 'Imítalos', prompt: 'Imita a alguien del grupo hasta que adivinen a quién. Si nadie adivina, cuéntales qué intentabas.', modes: ['amigos'] },
  { wild: 'reto', title: 'Cara a cara', prompt: 'Mírense a los ojos sin hablar hasta que alguien se ría. Quien se ría cuenta por qué.', modes: ['pareja'] },
  { wild: 'reto', title: 'Sin usar palabras', prompt: 'Explica cómo te sientes hoy solo con gestos. El resto adivina.' },
  { wild: 'reto', title: 'Cambio de silla', prompt: 'Responde la última pregunta como si fueras la persona de tu derecha.', modes: ['amigos'] },
  { wild: 'reto', title: 'Mensaje pendiente', prompt: 'Abre tu teléfono y lee en voz alta el último mensaje que enviaste. Solo el último.' },

  { wild: 'todos', title: 'Ronda relámpago', prompt: 'Todos responden en una sola palabra: ¿cómo llegaron hoy de verdad?' },
  { wild: 'todos', title: 'La peor idea', prompt: 'Todos cuentan la peor decisión que tomaron con toda la confianza del mundo.' },
  { wild: 'todos', title: 'Voto secreto', prompt: 'Cada quien señala a la vez a la persona que más los sorprendió esta noche. Sin explicar hasta después.', modes: ['amigos'] },
  { wild: 'todos', title: 'Una palabra', prompt: 'Cada persona describe a quien tiene enfrente con una sola palabra. Después explica por qué.' },

  { wild: 'confesion', title: 'Confesión', prompt: 'Cuenta algo que hiciste y nunca contaste aquí. Tú decides cuánto detalle das.' },
  { wild: 'confesion', title: 'La mentira piadosa', prompt: 'Confiesa una mentira pequeña que hayas dicho en esta mesa alguna vez.' },
  { wild: 'confesion', title: 'Lo que no dije', prompt: 'Di algo que quisiste decir en esta conversación y te guardaste.' },

  { wild: 'brindis', title: 'Brindis', prompt: 'Levanten lo que tengan en la mano y digan por qué vale la pena este rato. Sin ironías.' },
  { wild: 'brindis', title: 'A la salud de', prompt: 'Brinden por alguien que no está aquí y que debería estarlo.' },

  // Solo con la extensión 18+ activada.
  { wild: 'reto', title: 'Sin explicar', prompt: 'Pide algo que quieres ahora mismo. Sin justificarlo, sin adornarlo.', modes: ['pareja'], adult: true },
  { wild: 'confesion', title: 'Lo que nunca dije', prompt: 'Cuenta algo que has deseado y nunca te atreviste a poner en palabras.', adult: true },
];

const buildDeck = (mode: GameMode, source: Record<CardCategory, IntensityDeck>): Card[] =>
  categoryOrder.flatMap((category) =>
    intensityOrder.flatMap((intensity) =>
      source[category][intensity].map((seed, index) => ({
        id: `${mode}-${category}-${intensity}-${index + 1}`,
        mode,
        category,
        intensity,
        kind: seed.kind ?? 'pregunta',
        prompt: seed.prompt,
        followUp: seed.followUp,
      })),
    ),
  );

const buildAdultDeck = (mode: GameMode, seeds: PromptSeed[]): Card[] =>
  seeds.map((seed, index) => ({
    id: `${mode}-adult-${index + 1}`,
    mode,
    category: index % 2 === 0 ? 'cuidado' : 'intuicion',
    intensity: 'intima' as const,
    kind: seed.kind ?? 'pregunta',
    prompt: seed.prompt,
    followUp: seed.followUp,
    adult: true,
  }));

const buildWildDeck = (mode: GameMode): Card[] =>
  wildSeeds
    .filter((seed) => !seed.modes || seed.modes.includes(mode))
    .map((seed, index) => ({
      id: `comodin-${seed.wild}-${mode}-${index + 1}`,
      mode,
      category: 'cuidado' as const,
      intensity: 'suave' as const,
      kind: 'comodin' as const,
      prompt: seed.prompt,
      title: seed.title,
      wild: seed.wild,
      adult: seed.adult,
    }));

export const DECKS: Card[] = [
  ...buildDeck('pareja', pairPrompts),
  ...buildDeck('amigos', friendPrompts),
  ...buildAdultDeck('pareja', adultPairPrompts),
  ...buildAdultDeck('amigos', adultFriendPrompts),
];

export const WILD_DECKS: Card[] = [...buildWildDeck('pareja'), ...buildWildDeck('amigos')];

export const getDeckForMode = (mode: GameMode, adultEnabled: boolean): Card[] =>
  DECKS.filter((card) => card.mode === mode && (adultEnabled || !card.adult));

export const getWildDeckForMode = (mode: GameMode, adultEnabled: boolean): Card[] =>
  WILD_DECKS.filter((card) => card.mode === mode && (adultEnabled || !card.adult));
