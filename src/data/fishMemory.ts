export const FISH_MEMORY_PAIRS = 4;
export const FISH_MEMORY_FLIP_MS = 340;
export const FISH_MEMORY_LOOK_MS = 950;

export function fishMemoryDeck(wordIds: string[], random = Math.random) {
  const deck = [...new Set(wordIds)].slice(0, FISH_MEMORY_PAIRS).flatMap(id => [id, id]);
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck;
}
