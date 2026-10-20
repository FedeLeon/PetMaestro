import type { ImageSourcePropType } from 'react-native';
import { storyImages } from './assetImages';
import texts from './longStoryTexts.json';
import expandedStories from './expandedStories.json';
import type { StoryId } from './libraryProgression';
export type { StoryId } from './libraryProgression';

export const storyAudio: Record<StoryId, number | null> = {
  'abeja-haragana': require('../../assets/audio/stories/abeja-haragana.mp3'),
  'medias-flamencos': require('../../assets/audio/stories/medias-flamencos.mp3'),
  'liebre-tortuga': null,
  'leon-raton': null,
  'cigarra-hormiga': null,
  'zorro-ciguena': null,
  'raton-campo-ciudad': null,
  'viento-sol': null,
  'semilla-impaciente': null,
  'puente-amigos': null,
  'farol-luciernaga': null,
  'barrilete-colores': null,
};
export type Audiobook = {
  id: StoryId; title: string; description: string; duration: number;
  author: string; narrator: string | null; voiceDescription?: string;
  credits: string; color: string; image: ImageSourcePropType;
  scenes: { at: number; description: string }[];
};
const quirogaCredits = 'Texto: Horacio Quiroga (1878–1937), Cuentos de la selva (1918), transcripción de Wikisource (colaboradores, CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/) de la edición original. Se restituyeron las letras capitulares y se corrigieron erratas de transcripción. Audio original de LibriVox (2016), con declaración de dominio público basada en la legislación de Estados Unidos. Ilustraciones, enseñanza y preguntas creadas para PetMaestro.';
const aesopCredits = 'Fábula tradicional atribuida a Esopo. Versión extensa escrita para PetMaestro en español rioplatense, sin copiar una traducción moderna. Texto de esta adaptación ofrecido bajo CC0 1.0. Ilustraciones y preguntas creadas para PetMaestro. Este libro está preparado para leer en pantalla o en voz alta, sin grabación.';
export const audiobooks: Audiobook[] = [
  { id: 'abeja-haragana', title: 'La abeja haragana', description: 'Una noche de aventuras le enseña a una abejita a colaborar.', duration: 846.863673, author: 'Horacio Quiroga', narrator: 'AnabelleC', voiceDescription: 'Voz femenina · Español', color: '#b58624', image: storyImages['abeja-haragana'], credits: quirogaCredits, scenes: [
    { at: 0, description: 'La abejita pasea entre las flores mientras sus compañeras reúnen néctar.' },
    { at: 310, description: 'Durante la noche, la abejita conoce a una culebra en el hueco de un árbol.' },
    { at: 730, description: 'La abejita regresa a la colmena y aprende a colaborar con sus compañeras.' },
  ] },
  { id: 'medias-flamencos', title: 'Las medias de los flamencos', description: 'Un baile en la selva y una elección que trae una gran lección.', duration: 647.08, author: 'Horacio Quiroga', narrator: 'Charbelí Ramos Chávez', voiceDescription: 'Voz femenina · Español latino', color: '#b95878', image: storyImages['medias-flamencos'], credits: quirogaCredits, scenes: [
    { at: 0, description: 'Los flamencos quieren participar de una fiesta junto al río.' },
    { at: 260, description: 'Los flamencos bailan con medias rayadas rojas, blancas y negras.' },
    { at: 560, description: 'Los flamencos descansan con las patas rosadas dentro del agua.' },
  ] },
  { id: 'liebre-tortuga', title: 'La liebre y la tortuga', description: 'Una carrera para descubrir el valor de avanzar sin rendirse.', duration: 0, author: 'Fábula de Esopo · Versión PetMaestro', narrator: null, color: '#58864a', image: storyImages['liebre-tortuga'], credits: aesopCredits, scenes: [
    { at: 0, description: 'La liebre y la tortuga se preparan para una carrera entre amigos.' },
    { at: 0, description: 'La tortuga avanza paso a paso mientras la liebre duerme bajo un árbol.' },
    { at: 0, description: 'La tortuga llega a la meta y la liebre la felicita.' },
  ] },
  { id: 'leon-raton', title: 'El león y el ratón', description: 'Una pequeña ayuda puede cambiar una gran historia.', duration: 0, author: 'Fábula de Esopo · Versión PetMaestro', narrator: null, color: '#b57434', image: storyImages['leon-raton'], credits: aesopCredits, scenes: [
    { at: 0, description: 'Un ratoncito conoce a un león bajo la sombra de un árbol.' },
    { at: 0, description: 'El ratón corta con sus dientes una cuerda para ayudar al león.' },
    { at: 0, description: 'El león y el ratón celebran su nueva amistad.' },
  ] },
  ...Object.entries(expandedStories).map(([id, story]): Audiobook => ({
    id: id as StoryId, title: story.title, description: story.description, author: story.author,
    duration: 0, narrator: null, color: story.color, image: storyImages[id as StoryId],
    credits: `${story.author}. Texto extenso escrito para PetMaestro en español rioplatense, ofrecido bajo CC0 1.0. Las versiones de fábulas tradicionales no copian traducciones modernas. Ilustraciones y cinco preguntas creadas para el juego. Libro para leer en pantalla o en voz alta, sin grabación.`,
    scenes: story.scenes.map(description => ({ at: 0, description })),
  })),
];
const allTexts = { ...texts, ...expandedStories };
export function storyReadingMinutes(id: StoryId) { return Math.max(1, Math.ceil(allTexts[id].paragraphs.join(' ').split(/\s+/).length / 130)); }
export function storyTime(seconds: number) {
  const value = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}
