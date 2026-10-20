export const actionRewards = {
  cook: { coins: 3, label: '¡Comida preparada!' },
  feed: { coins: 5, label: '¡Pancita feliz!' },
  wash: { coins: 5, label: '¡Qué limpito!' },
  teeth: { coins: 5, label: '¡Dientes brillantes!' },
  toilet: { coins: 5, label: '¡Baño terminado!' },
  sleep: { coins: 5, label: '¡Buen descanso!' },
  water: { coins: 3, label: '¡Planta regada!' },
  pet: { coins: 2, label: '¡Animalito feliz!' },
  rest: { coins: 3, label: '¡Una linda siesta!' },
  television: { coins: 2, label: '¡Un ratito de tele!' },
  drawing: { coins: 2, label: '¡Qué lindo dibujo!' },
  story: { coins: 3, label: '¡Cuento terminado!' },
  storyQuiz: { coins: 10, label: '¡Preguntas completadas!' },
  jump: { coins: 1, label: '¡Monedita atrapada!' },
  toy: { coins: 5, label: '¡Jugar tiene premio!' },
  city: { coins: 5, label: '¡Gracias por ayudar!' },
} as const;
export type ActionReward = keyof typeof actionRewards;
export type DirectActionReward = 'cook' | 'pet' | 'rest' | 'television' | 'drawing' | 'story' | 'jump';
