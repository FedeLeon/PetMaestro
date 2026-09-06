import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { houseImages } from '../../data/assetImages';
import { styles } from '../../styles/house/toothBrushing.styles';
import { styles as activityStyles } from '../../styles/house/bathroomActivity.styles';
import { ActivityProgress, BathroomActivityScene } from './BathroomActivityScene';
import { BathroomParticles } from './BathroomParticles';
import { useBathroomTouch } from './useBathroomTouch';

type Point = { x: number; y: number };
// Centers and sizes measured on tooth-brushing-cat-v2.png (1672 × 941).
// Inset inside each tooth, clear of the lips, gums and tongue.
const TEETH = [
  { x: .250, y: .686, width: .012, height: .030 },
  { x: .272, y: .698, width: .015, height: .033 },
  { x: .297, y: .707, width: .018, height: .034 },
  { x: .327, y: .707, width: .022, height: .038 },
  { x: .363, y: .707, width: .022, height: .038 },
  { x: .395, y: .700, width: .017, height: .034 },
  { x: .418, y: .690, width: .015, height: .030 },
  { x: .438, y: .678, width: .011, height: .029 },
];

export function ToothBrushingGame({ onClose }: { onClose: () => void }) {
  const { improveHygiene } = useProgress();
  const [hasToothpaste, setHasToothpaste] = useState(false);
  const [active, setActive] = useState(false);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [dirt, setDirt] = useState(TEETH.map(() => 1));
  const dirtRef = useRef(dirt);
  const lastPoint = useRef<Point | null>(null);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const completedRef = useRef(false);
  const completed = dirt.every((amount) => amount === 0);

  const cleanAt = useCallback((x: number, y: number) => {
    if (!active || !hasToothpaste || completedRef.current || !layout.width) return;
    setCursor({ x, y });
    const point = { x: x / layout.width, y: y / layout.height };
    const previous = lastPoint.current;
    if (!previous) { lastPoint.current = point; return; }
    if (Math.hypot((point.x - previous.x) * layout.width, (point.y - previous.y) * layout.height) < layout.width * .006) return;
    lastPoint.current = point;
    const next = dirtRef.current.map((amount, index) => {
      const tooth = TEETH[index];
      return Math.abs(point.x - tooth.x) < Math.max(.027, 18 / layout.width) && Math.abs(point.y - tooth.y) < Math.max(.042, 18 / layout.height) ? Math.max(0, amount - .25) : amount;
    });
    dirtRef.current = next;
    setDirt(next);
    if (next.every((amount) => amount === 0)) {
      completedRef.current = true;
      setActive(false);
      setCursor(null);
      void improveHygiene(25);
    }
  }, [active, hasToothpaste, improveHygiene, layout]);
  const touch = useBathroomTouch(active, cleanAt, () => { lastPoint.current = null; setCursor(null); });

  return <BathroomActivityScene aspectRatio={1672 / 941} source={houseImages.toothBrushingCat} onClose={onClose} controls={<>
    <ActivityProgress value={1 - dirt.reduce((a, b) => a + b, 0) / TEETH.length} label={completed ? '¡Dientes brillantes!' : !hasToothpaste ? '1. Poné pasta en el cepillo' : !active ? '2. Elegí el cepillo' : '3. Frotá todos los dientes'} />
    {!completed ? <View style={styles.tools}>
      <TouchableOpacity accessibilityLabel="Poner pasta dental en el cepillo" accessibilityRole="button" onPress={() => setHasToothpaste(true)} style={[styles.toolAction, hasToothpaste && styles.selectedTool]}>
        <Image resizeMode="contain" source={houseImages.toothpasteCat} style={styles.toothpasteAsset} />
      </TouchableOpacity>
      <TouchableOpacity accessibilityLabel="Activar cepillo de dientes" accessibilityRole="button" accessibilityState={{ disabled: !hasToothpaste, selected: active }} disabled={!hasToothpaste} onPress={() => setActive(true)} style={[styles.toolAction, active && styles.selectedTool, !hasToothpaste && activityStyles.disabled]}>
        <Image resizeMode="contain" source={hasToothpaste ? houseImages.toothBrushWithToothpaste : houseImages.toothBrushClean} style={styles.toothbrushAsset} />
      </TouchableOpacity>
    </View> : <><Text style={activityStyles.success}>Higiene +25</Text><TouchableOpacity accessibilityRole="button" onPress={onClose} style={activityStyles.action}><Text style={activityStyles.actionText}>¡Listo!</Text></TouchableOpacity></>}
  </>}>
    <View ref={touch.stageRef} testID="tooth-stage" onLayout={(event) => setLayout(event.nativeEvent.layout)} style={activityStyles.fill} {...touch.panHandlers}>
      <View pointerEvents="none" style={activityStyles.fill}>
        {TEETH.map((tooth, index) => dirt[index] > 0 ? <View key={index} style={[styles.dirtClip, { left: `${(tooth.x - tooth.width * 1.18 / 2) * 100}%`, top: `${(tooth.y - tooth.height * 1.12 / 2) * 100}%`, width: `${tooth.width * 1.18 * 100}%`, height: `${tooth.height * 1.12 * 100}%`, opacity: dirt[index] }]}><Image source={houseImages.toothPlaque} resizeMode="stretch" style={styles.plaque} /></View> : null)}
        {cursor ? <>
          <View style={[styles.brushFoam, { left: cursor.x - 10, top: cursor.y - 5 }]} />
          <Image resizeMode="contain" source={houseImages.toothBrushWithToothpaste} style={[styles.brushCursor, { width: layout.width * .22, height: layout.width * .11, left: cursor.x - layout.width * .034, top: cursor.y - layout.width * .052 }]} />
        </> : null}
        {completed ? <BathroomParticles kind="sparkles" /> : null}
      </View>
    </View>
  </BathroomActivityScene>;
}
