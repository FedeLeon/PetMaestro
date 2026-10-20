export const BELL_RUN_SECONDS = 18;
export const BELL_JUMP_SECONDS = .9;
export const BELL_CAT_X = .22;
export const BELL_SPEED = .27;
export const BELL_OBSTACLES = [3.5, 7, 10.5, 14] as const;
export const BELL_OBSTACLE_KINDS = ['log', 'rock', 'bush', 'log'] as const;
export const BELL_RUN_FRAMES = 8;
export function bellRunFrame(time: number) { return Math.floor(time * 14) % BELL_RUN_FRAMES; }
export type BellRunState = {
  time: number; jumpAt: number | null; jumps: number; coins: number;
  hits: number[]; collected: number[]; stumbleUntil: number; done: boolean;
};
export const initialBellRun = (): BellRunState => ({ time: 0, jumpAt: null, jumps: 0, coins: 0, hits: [], collected: [], stumbleUntil: 0, done: false });
export function bellJumpLift(state: BellRunState) {
  if (state.jumpAt === null) return 0;
  const t = Math.max(0, Math.min(1, (state.time - state.jumpAt) / BELL_JUMP_SECONDS));
  return 4 * t * (1 - t);
}
export function startBellJump(state: BellRunState): BellRunState {
  if (state.done || state.time >= BELL_RUN_SECONDS || state.jumpAt !== null || state.time < state.stumbleUntil) return state;
  return { ...state, jumpAt: state.time, jumps: state.jumps + 1 };
}
export function bellObstacleX(at: number, time: number) { return BELL_CAT_X + (at - time) * BELL_SPEED; }
export function stepBellRun(state: BellRunState, delta: number): BellRunState {
  if (state.done || !Number.isFinite(delta) || delta <= 0) return state;
  const time = Math.min(BELL_RUN_SECONDS + BELL_JUMP_SECONDS, state.time + Math.min(.05, delta));
  const next = { ...state, time };
  if (next.jumpAt !== null && time - next.jumpAt >= BELL_JUMP_SECONDS) next.jumpAt = null;
  BELL_OBSTACLES.forEach((at, index) => {
    // Each visible coin travels directly above its obstacle. Jumping in empty
    // space earns nothing; the cat must reach a coin while in the air.
    if (!next.collected.includes(index) && Math.abs(bellObstacleX(at, time) - BELL_CAT_X) < .055 && bellJumpLift(next) >= .55) {
      next.collected = [...next.collected, index]; next.coins += 1;
    }
    if (!next.hits.includes(index) && Math.abs(bellObstacleX(at, time) - BELL_CAT_X) < .025 && bellJumpLift(next) < .30) {
      next.hits = [...next.hits, index]; next.stumbleUntil = time + .5;
    }
  });
  // Let the last accepted jump land before showing the result.
  next.done = time >= BELL_RUN_SECONDS && next.jumpAt === null;
  return next;
}
