const animalOrder = ['farm-cow', 'farm-sheep', 'farm-duck', 'farm-horse', 'farm-pig', 'farm-rabbit'];
const smooth = (t: number) => { const p = Math.max(0, Math.min(1, t)); return p * p * (3 - 2 * p); };

// Seconds of active scene time only. Pausing the app never advances the herd.
export function farmAnimalMotion(id: string, time: number, reducedMotion = false) {
  const index = Math.max(0, animalOrder.indexOf(id));
  const phase = index * 1.31;
  const t = Math.max(0, time - 1 - index * .62) % (18 + index * .7);
  const outbound = t >= 1.8 && t < 5.4;
  const inbound = t >= 7.2 && t < 10.8;
  const walking = !reducedMotion && (outbound || inbound);
  const progress = outbound ? (t - 1.8) / 3.6 : inbound ? (t - 7.2) / 3.6 : 0;
  const position = t < 1.8 ? 0 : t < 5.4 ? smooth((t - 1.8) / 3.6) : t < 7.2 ? 1 : t < 10.8 ? 1 - smooth((t - 7.2) / 3.6) : 0;
  const weight = walking ? Math.sin(Math.PI * progress) : 0;
  const step = progress * Math.PI * 8;
  const stride = Math.sin(step) * weight;
  const blinkAt = (time + phase) % (4.7 + index * .23);
  const blink = blinkAt < .09 ? smooth(blinkAt / .09) : blinkAt < .16 ? 1 : blinkAt < .29 ? 1 - smooth((blinkAt - .16) / .13) : 0;
  const earBeat = (time + phase) % 6.8;
  const ear = earBeat < 1.3 ? Math.sin(earBeat * Math.PI / 1.3) * Math.sin(earBeat * 9) : 0;
  const rabbit = id === 'farm-rabbit';
  return {
    walking,
    x: reducedMotion ? 0 : position * (id === 'farm-duck' ? 44 : 36),
    lift: reducedMotion ? 0 : (rabbit ? Math.max(0, Math.sin(step / 2)) * 19 : Math.abs(stride) * 5),
    stride: reducedMotion ? 0 : stride,
    roll: reducedMotion ? 0 : stride * (id === 'farm-duck' ? 1.5 : rabbit ? .35 : .2),
    breath: reducedMotion ? 1 : 1 + Math.sin(time * 1.8 + phase) * .005,
    ear: reducedMotion ? 0 : ear * (rabbit ? 4 : 2.5),
    tail: reducedMotion ? 0 : Math.sin(time * 2.3 + phase) * 2.5 + stride * 2,
    fur: reducedMotion ? 0 : Math.sin(time * 2 + phase) * .65,
    blink: reducedMotion ? 0 : blink,
  };
}
