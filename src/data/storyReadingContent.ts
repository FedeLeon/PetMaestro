import type { StoryId } from './audiobooks';
import texts from './longStoryTexts.json';
import expandedStories from './expandedStories.json';

export type StoryQuestion = { id: string; prompt: string; options: { id: string; text: string }[]; answerId: string; explanation: string };
type Reading = { paragraphs: string[]; moral: string; questions: StoryQuestion[] };
const question = (id: string, prompt: string, options: string[], correct: number, explanation: string): StoryQuestion => ({ id, prompt, options: options.map((text, i) => ({ id: `${id}-${i}`, text })), answerId: `${id}-${correct}`, explanation });
export const storyReadingContent: Record<StoryId, Reading> = {
  'abeja-haragana': { ...texts['abeja-haragana'], questions: [
    question('abeja-nectar', 'Al principio, ¿qué hacía la abeja con el jugo de las flores?', ['Lo llevaba a la colmena', 'Se lo tomaba todo', 'Lo guardaba en una hoja'], 1, 'La abejita se tomaba el jugo en vez de llevarlo para fabricar miel.'),
    question('abeja-companeras', '¿Qué le pedían sus compañeras?', ['Que colaborara con el trabajo', 'Que dejara de volar para siempre', 'Que aprendiera a nadar'], 0, 'Todas colaboraban para alimentar a la colmena y le pedían que también ayudara.'),
    question('abeja-cueva', '¿A quién encontró en el hueco del árbol?', ['A un flamenco', 'A una liebre', 'A una culebra'], 2, 'Durante la noche, la abeja cayó en un hueco donde vivía una culebra.'),
    question('abeja-escondite', '¿Cómo logró esconderse de la culebra?', ['Detrás de una piedra', 'Dentro de las hojas de una plantita', 'En un panal de miel'], 1, 'La abeja tocó las hojas de una planta sensitiva, que se cerraron y la ocultaron.'),
    question('abeja-colaborar', '¿Qué aprendió al volver a la colmena?', ['Que colaborar ayuda al bienestar de todos', 'Que nunca hay que pedir ayuda', 'Que prometer es lo mismo que cumplir'], 0, 'La abeja aprendió a cumplir sus compromisos y a colaborar con sus compañeras.'),
  ] },
  'medias-flamencos': { ...texts['medias-flamencos'], questions: [
    question('flamencos-baile', '¿Qué estaban organizando las víboras?', ['Una carrera', 'Un gran baile', 'Una clase de cocina'], 1, 'Las víboras invitaron a muchos animales a un baile junto al río.'),
    question('flamencos-deseo', '¿Por qué los flamencos buscaron medias?', ['Querían un adorno para ir al baile', 'Iban a jugar al fútbol', 'Querían abrigar un árbol'], 0, 'Los flamencos querían adornarse para que los demás los admiraran en el baile.'),
    question('flamencos-colores', '¿De qué colores eran las medias que buscaban?', ['Azul, verde y amarillo', 'Violeta y naranja', 'Rojo, blanco y negro'], 2, 'Pidieron medias con franjas rojas, blancas y negras.'),
    question('flamencos-lechuza', '¿Quién les entregó las medias?', ['La tortuga', 'La lechuza', 'El león'], 1, 'La lechuza les dio unos adornos que en realidad eran cueros de víboras.'),
    question('flamencos-final', '¿Qué podemos aprender de lo que les pasó?', ['Hay que imitar siempre a los demás', 'Conviene preguntar y pensar antes de aceptar algo', 'No se puede disfrutar de una fiesta sin medias'], 1, 'Los flamencos no conocían el origen de las medias: conviene preguntar y no decidir solo por las apariencias.'),
  ] },
  'liebre-tortuga': { ...texts['liebre-tortuga'], questions: [
    question('liebre-nombres', '¿Cómo se llamaban la liebre y la tortuga?', ['Lila y Tita', 'Nilo y Milo', 'Lola y Nina'], 0, 'La liebre se llamaba Lila y la tortuga se llamaba Tita.'),
    question('liebre-meta', '¿Dónde terminaba la carrera?', ['En una cueva', 'En la colmena', 'Junto al gran sauce'], 2, 'Las amigas acordaron correr hasta el gran sauce del otro lado del prado.'),
    question('liebre-descanso', '¿Qué hizo Lila durante la carrera?', ['Se puso a fabricar miel', 'Se quedó dormida bajo un árbol', 'Se escondió en el río'], 1, 'Lila se confió y decidió dormir una siesta porque creía que tenía mucho tiempo.'),
    question('tortuga-barro', '¿Qué hizo Tita cuando encontró barro?', ['Buscó tierra firme y siguió', 'Abandonó la carrera', 'Empujó a la liebre'], 0, 'Tita rodeó el barro con paciencia y continuó avanzando hacia la meta.'),
    question('tortuga-moraleja', '¿Por qué Tita pudo terminar primero?', ['Porque hizo trampa', 'Porque tenía alas', 'Porque mantuvo su esfuerzo hasta el final'], 2, 'Tita avanzó a su ritmo, prestó atención y no abandonó lo que había empezado.'),
  ] },
  'leon-raton': { ...texts['leon-raton'], questions: [
    question('leon-encuentro', '¿Cómo llegó Milo hasta la pata del león?', ['Buscaba un panal', 'Siguió distraído a una mariposa', 'Saltó desde una nube'], 1, 'Milo seguía una mariposa azul y no se dio cuenta de que Nilo estaba durmiendo.'),
    question('leon-promesa', '¿Qué prometió Milo cuando Nilo lo dejó pasar?', ['Ayudarlo si alguna vez lo necesitaba', 'Ganar una carrera', 'Llevarle unas medias'], 0, 'Milo agradeció la ayuda y le prometió al león que también podía contar con él.'),
    question('leon-red', '¿Qué le pasó a Nilo en el sendero?', ['Perdió una flauta', 'Se cayó a la colmena', 'Quedó atrapado en una red'], 2, 'Una red de cuerdas se cerró alrededor del león y le impidió avanzar.'),
    question('raton-dientes', '¿Cómo ayudó Milo a liberar al león?', ['Tiró de su cola', 'Cortó una cuerda con los dientes', 'Le prestó sus orejas'], 1, 'Milo cortó las fibras de una cuerda con paciencia mientras Nilo mantenía quieta la red.'),
    question('leon-ensenanza', '¿Qué descubrieron los dos amigos?', ['Todos podemos ayudar con nuestras habilidades', 'Solo los animales grandes pueden ayudar', 'Pedir ayuda está mal'], 0, 'El tamaño no determina nuestro valor: cada uno puede aportar algo y también pedir ayuda.'),
  ] },
  ...Object.fromEntries(Object.entries(expandedStories).map(([id, story]) => [id, {
    paragraphs: story.paragraphs, moral: story.moral,
    questions: story.questions.map(([prompt, options, correct, explanation], index) =>
      question(`${id}-${index + 1}`, prompt as string, options as string[], correct as number, explanation as string)),
  }])) as Record<keyof typeof expandedStories, Reading>,
};

export function storyQuizReward(score: number) { return 5 + Math.max(0, Math.min(5, Math.floor(score))); }
export type StoryQuizResult = { best: number; completed: number; lastAttemptId: string };
export function restoreStoryQuizResults(value: unknown): Record<string, StoryQuizResult> {
  const restored: Record<string, StoryQuizResult> = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return restored;
  // Keep results from the retired library without showing those books again.
  const knownIds = [...Object.keys(storyReadingContent), 'burro-flautista', 'pato-serpiente', 'abeja-cuclillo', 'ardilla-caballo'];
  for (const id of knownIds) {
    const raw = (value as Record<string, Partial<StoryQuizResult>>)[id];
    if (!raw || typeof raw !== 'object' || typeof raw.lastAttemptId !== 'string' || !/^[a-z0-9-]{1,160}$/.test(raw.lastAttemptId)) continue;
    if (!Number.isFinite(raw.best) || !Number.isFinite(raw.completed)) continue;
    restored[id] = { best: Math.max(0, Math.min(5, Math.floor(raw.best!))), completed: Math.max(0, Math.min(1e9, Math.floor(raw.completed!))), lastAttemptId: raw.lastAttemptId };
  }
  return restored;
}
