export const MOUSE_ROUND_FINDS = 6;
export const mouseCurtainTiming = { reveal: 260, close: 420, covered: 250, open: 500 } as const;

// Coordinates follow the complete room illustration; never crop the room.
export const mouseHidingSpots = [
  { id: 'bookshelf', x: .17, y: .33, cover: '115,381 231,381 231,435 115,435' },
  { id: 'toy-chest', x: .37, y: .458, cover: '290,505 474,495 474,643 290,667' },
  { id: 'shelf-basket', x: .712, y: .216, cover: '683,257 748,257 748,347 683,347' },
  { id: 'armchair', x: .596, y: .40, cover: '580,449 608,449 624,465 624,590 580,590' },
  { id: 'floor-books', x: .742, y: .733, cover: '688,785 741,761 797,804 797,867 688,867' },
  { id: 'slippers', x: .12, y: .755, cover: '84,842 115,850 136,885 133,909 80,909' },
  { id: 'building-blocks', x: .414, y: .665, cover: '388,740 430,741 430,799 388,799' },
  { id: 'cushion-basket', x: .867, y: .462, cover: '810,513 888,518 931,487 931,597 810,597' },
  { id: 'blue-blanket', x: .932, y: .757, cover: '892,839 961,839 981,903 981,950 892,950' },
  { id: 'train', x: .179, y: .634, cover: '163,688 184,683 190,721 171,757 163,741' },
] as const;

// One shuffled tour shows every hiding place before reusing any of them.
export function shuffledMouseSpots(previousId?: string, random = Math.random): number[] {
  const order: number[] = mouseHidingSpots.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (mouseHidingSpots[order[0]].id === previousId) [order[0], order[1]] = [order[1], order[0]];
  return order;
}
