type PartKind = 'leg' | 'ear' | 'tail' | 'fur' | 'wing';
type Part = { kind: PartKind; clip: string; cut: string; pivot: readonly [number, number]; phase: number };
type Rig = { parts: Part[]; eyes: string; floor: number };
const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const leg = (x: number, y: number, w: number, phase: number): Part => ({ kind: 'leg', clip: rect(x, y, w, 1000 - y), cut: rect(x, y + 24, w, 1000 - y - 24), pivot: [x + w / 2, y + 16], phase });
const tip = (kind: PartKind, x: number, y: number, w: number, h: number, pivot: readonly [number, number], phase = 1): Part => ({ kind, clip: rect(x, y, w, h), cut: rect(x, y, w, h - 24), pivot, phase });

// Masks on existing 724×724 sprites, normalized to 1000. Joint overlap hides
// seams. Original artwork and legacy grazing/action frames remain untouched.
export const farmAnimalRigs: Record<string, Rig> = {
  'farm-cow': { floor: 980, eyes: rect(300, 255, 190, 185) + rect(530, 175, 155, 180),
    parts: [leg(240, 790, 110, -1), leg(570, 820, 120, 1), leg(350, 810, 165, 1), leg(700, 790, 165, -1),
      tip('tail', 775, 295, 225, 210, [865, 480]), tip('ear', 0, 230, 285, 190, [285, 285]),
      tip('ear', 635, 85, 235, 190, [650, 225], -1), tip('fur', 335, 0, 235, 200, [465, 185])]},
  'farm-horse': { floor: 982, eyes: rect(145, 190, 110, 155) + rect(285, 210, 140, 165),
    parts: [leg(175, 760, 190, -1), leg(515, 760, 170, 1), leg(365, 780, 165, 1), leg(700, 760, 175, -1),
      { kind: 'tail', clip: 'M690 400Q680 310 800 310Q970 300 970 470L1000 500V850H820L795 720L780 610L750 520Z',
        cut: 'M800 320Q970 300 970 470L1000 500V850H820L810 650L810 500Z', pivot: [800, 445], phase: 1 },
      tip('ear', 150, 0, 105, 125, [215, 120]),
      tip('ear', 410, 30, 145, 160, [425, 175], -1), tip('fur', 70, 25, 350, 170, [330, 180])]},
  'farm-sheep': { floor: 960, eyes: rect(245, 275, 125, 160) + rect(420, 325, 140, 150),
    parts: [leg(305, 795, 125, -1), leg(590, 795, 130, 1), leg(430, 815, 135, 1), leg(730, 810, 140, -1),
      tip('tail', 790, 440, 190, 190, [815, 600]), tip('ear', 65, 240, 180, 165, [235, 295]),
      tip('ear', 580, 315, 170, 175, [590, 370], -1), tip('fur', 220, 15, 360, 230, [400, 225])]},
  'farm-pig': { floor: 970, eyes: rect(400, 285, 180, 190) + rect(640, 200, 150, 165),
    parts: [leg(105, 790, 155, -1), leg(290, 790, 155, 1), leg(425, 805, 150, 1), leg(605, 795, 170, -1),
      tip('tail', 80, 420, 155, 140, [180, 530]),
      { kind: 'ear', clip: 'M115 135Q205 90 305 145Q385 125 420 205L370 235Q345 360 260 415Q170 430 115 340Z',
        cut: 'M115 135Q205 90 305 145L365 190Q380 300 260 415Q170 430 115 340Z', pivot: [375, 180], phase: 1 },
      { kind: 'ear', clip: 'M625 0H970V210Q850 250 755 175L650 160Z',
        cut: 'M650 0H970V210Q850 250 755 175L675 120Z', pivot: [680, 145], phase: -1 }]},
  'farm-duck': { floor: 993, eyes: rect(260, 155, 125, 170) + rect(435, 205, 145, 175),
    parts: [leg(305, 845, 225, -1), leg(530, 850, 205, 1),
      { kind: 'wing', clip: 'M500 585Q515 548 570 550Q660 555 735 590Q750 607 713 625Q782 633 748 670L700 692Q754 709 709 734Q692 748 655 742L670 770Q620 770 582 735Q510 700 500 635Z',
        cut: 'M535 585Q570 550 640 575L735 590L713 625L755 642L700 692L727 719L655 742L670 770Q600 740 565 690Z', pivot: [535, 605], phase: 1 },
      tip('fur', 380, 0, 205, 140, [465, 120])]},
  'farm-rabbit': { floor: 970, eyes: rect(270, 345, 135, 180) + rect(460, 405, 160, 170),
    parts: [leg(300, 885, 205, -1), leg(480, 895, 235, 1),
      tip('tail', 795, 655, 145, 220, [815, 830]), tip('ear', 255, 0, 275, 320, [470, 305]),
      tip('ear', 590, 75, 355, 365, [605, 395], -1)]},
};
