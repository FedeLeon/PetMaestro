import { yarnFloorTrail } from '../../data/rollingYarn';

const ROOM_ASPECT = 1983 / 793;
export const yarnCounterLayout = { left: 8, bottom: 8, width: 132, height: 44 };
export function rollingYarnLayout(width: number, height: number) {
  const roomWidth = Math.min(width, height * ROOM_ASPECT);
  const roomHeight = roomWidth / ROOM_ASPECT;
  return { width: roomWidth, height: roomHeight, size: Math.max(72, Math.min(100, roomHeight * .26)) };
}

export function yarnTrack(width: number, height: number, size: number) {
  // The diagonal margin keeps the entire rotating sprite inside the room.
  const margin = size * .72;
  return yarnFloorTrail.map(([x, y]) => {
    const centerY = Math.max(margin, Math.min(height - margin, height * y));
    let centerX = Math.max(margin, Math.min(width - margin, width * x));
    // Keep the rotating ball clear of the in-room counter on compact screens.
    if (centerY + margin > height - yarnCounterLayout.bottom - yarnCounterLayout.height - 8) {
      centerX = Math.max(centerX, yarnCounterLayout.left + yarnCounterLayout.width + 8 + margin);
    }
    return { x: centerX - size / 2, y: centerY - size / 2 };
  });
}
