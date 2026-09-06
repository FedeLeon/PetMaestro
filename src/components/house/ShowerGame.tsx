import { useCallback, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useProgress } from '../../context/ProgressContext';
import { houseImages } from '../../data/assetImages';
import { styles } from '../../styles/house/bathroomActivity.styles';
import { ActivityProgress, BathroomActivityScene } from './BathroomActivityScene';
import { BathroomParticles } from './BathroomParticles';
import { BathroomWater } from './BathroomWater';
import { useBathroomTouch } from './useBathroomTouch';

type Phase = 'soap' | 'rinse' | 'dry' | 'done';
const ZONES = [{ x: .28, y: .49 }, { x: .44, y: .49 }, { x: .32, y: .64 }, { x: .4, y: .68 }, { x: .31, y: .84 }, { x: .42, y: .85 }];
const PHASES = {
  soap: { label: 'Frotá el jabón por el cuerpo', tool: 'Jabón' },
  rinse: { label: 'Pasá el agua por la espuma', tool: 'Ducha' },
  dry: { label: 'Secá al gato con la toalla', tool: 'Toalla' },
} as const;

export function ShowerGame({ onClose }: { onClose: () => void }) {
  const { improveHygiene } = useProgress();
  const [phase, setPhase] = useState<Phase>('soap');
  const phaseRef = useRef<Phase>('soap');
  const [active, setActive] = useState(false);
  const [zones, setZones] = useState<number[]>([]);
  const zonesRef = useRef<number[]>([]);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const completedRef = useRef(false);

  const rubAt = useCallback((x: number, y: number) => {
    if (!active || phaseRef.current !== phase || phase === 'done' || !layout.width) return;
    setCursor({ x, y });
    const next = [...zonesRef.current];
    ZONES.forEach((zone, index) => {
      if (!next.includes(index) && Math.hypot((x / layout.width - zone.x) * 1.5, y / layout.height - zone.y) < .085) next.push(index);
    });
    zonesRef.current = next;
    setZones(next);
    if (next.length === ZONES.length) {
      const nextPhase = phase === 'soap' ? 'rinse' : phase === 'rinse' ? 'dry' : 'done';
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
      setActive(false);
      setCursor(null);
      zonesRef.current = [];
      setZones([]);
      if (nextPhase === 'done' && !completedRef.current) {
        completedRef.current = true;
        void improveHygiene(50);
      }
    }
  }, [active, improveHygiene, layout, phase]);
  const touch = useBathroomTouch(active, rubAt, () => setCursor(null));
  const step = phase === 'soap' ? 0 : phase === 'rinse' ? 1 : phase === 'dry' ? 2 : 3;
  const tool = phase === 'done' ? null : PHASES[phase];
  const toolImage = phase === 'soap' ? houseImages.bathSoap : phase === 'dry' ? houseImages.bathTowel : houseImages.bathHandShower;

  const toolSize = phase === 'rinse' ? Math.max(118, Math.min(180, layout.height * .32)) : phase === 'dry' ? Math.max(112, Math.min(168, layout.height * .28)) : Math.max(96, Math.min(150, layout.height * .24));

  return <BathroomActivityScene source={houseImages.showerCat} onClose={onClose} controls={<>
    <ActivityProgress value={(step + zones.length / ZONES.length) / 3} label={tool ? active ? tool.label : `Elegí: ${tool.tool}` : '¡Limpito y seco!'} />
    {tool ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={tool.tool} accessibilityState={{ selected: active }} onPress={() => setActive(true)} style={styles.action}><Image source={toolImage} resizeMode="contain" style={styles.toolImage} /><Text style={styles.actionText}>{tool.tool}</Text></TouchableOpacity> : <><Text style={styles.success}>Higiene +50</Text><TouchableOpacity accessibilityRole="button" onPress={onClose} style={styles.action}><Text style={styles.actionText}>¡Listo!</Text></TouchableOpacity></>}
  </>}>
    <View ref={touch.stageRef} testID="shower-stage" style={styles.fill} onLayout={(event) => setLayout(event.nativeEvent.layout)} {...touch.panHandlers}>
      <View pointerEvents="none" style={styles.fill}>
        {ZONES.map((zone, index) => {
          const touched = zones.includes(index);
          const foam = phase === 'soap' && touched || phase === 'rinse' && !touched;
          const dirt = phase === 'soap' && !touched;
          const wet = phase === 'dry' && !touched;
          const width = layout.width * (foam ? .105 : .07);
          const height = layout.height * (foam ? .14 : .10);
          return foam || dirt || wet ? <View key={index} testID={foam ? 'bath-foam' : wet ? 'bath-wet' : 'bath-dirt'} style={[styles.zoneAsset, { left: layout.width * zone.x - width / 2, top: layout.height * zone.y - height / 2, width, height }]}>
            {wet ? <>
              <Image source={houseImages.bathWaterDrop} resizeMode="contain" style={styles.wetDropCenter} />
              <Image source={houseImages.bathWaterDrop} resizeMode="contain" style={styles.wetDropLeft} />
              <Image source={houseImages.bathWaterDrop} resizeMode="contain" style={styles.wetDropRight} />
            </> : <Image source={foam ? houseImages.bathFoam : houseImages.toothPlaque} resizeMode="contain" style={styles.zoneImage} />}
          </View> : null;
        })}
        {phase === 'rinse' && active ? <BathroomParticles kind="water" /> : null}
        {cursor && tool ? <View testID="bath-tool-cursor" style={[styles.cursor, {
          left: cursor.x - toolSize * (phase === 'rinse' ? .3 : .5),
          top: cursor.y - toolSize * (phase === 'rinse' ? .28 : .5),
          width: toolSize, height: toolSize,
        }]}>
          <Image source={toolImage} resizeMode="contain" style={styles.cursorImage} />
          {phase === 'rinse' ? <View style={styles.handShowerWater}><BathroomWater handheld /></View> : null}
        </View> : null}
        {phase === 'done' ? <BathroomParticles kind="sparkles" /> : null}
      </View>
    </View>
  </BathroomActivityScene>;
}
