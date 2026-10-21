import { usePresentation } from '../presentation/usePresentation';
import { styles } from '../styles/screens/drawingScreen.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { PanResponder, ScrollView, Text, TouchableOpacity, View, type GestureResponderEvent } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { useProgress } from '../context/ProgressContext';
import { DrawingPoint, DrawingStroke, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Drawing'>;

const palette = [
  '#f04f5f',
  '#ff7a59',
  '#ff9f1c',
  '#f4c430',
  '#9ed14f',
  '#58b957',
  '#2e9fd0',
  '#42c7c0',
  '#6d55c7',
  '#9b59d0',
  '#e85bb5',
  '#8d552c',
  '#372413',
  '#111827',
];

const CANVAS_SIZE = 360;

function pointsToPath(points: DrawingPoint[], width: number, height: number) {
  if (points.length === 0) {
    return '';
  }

  const [firstPoint, ...rest] = points;
  const safeFirstPoint = clampDrawingPoint(firstPoint);
  return [
    `M ${safeFirstPoint.x * width} ${safeFirstPoint.y * height}`,
    ...rest.map((point) => {
      const safePoint = clampDrawingPoint(point);
      return `L ${safePoint.x * width} ${safePoint.y * height}`;
    }),
  ].join(' ');
}

function clampDrawingPoint(point: DrawingPoint): DrawingPoint {
  return {
    x: Math.max(0, Math.min(1, point.x)),
    y: Math.max(0, Math.min(1, point.y)),
  };
}

function getCanvasPoint(locationX: number, locationY: number, width: number, height: number) {
  if (locationX < 0 || locationY < 0 || locationX > width || locationY > height) {
    return null;
  }

  return clampDrawingPoint({ x: locationX / width, y: locationY / height });
}

function eraseTouchedStrokes(strokes: DrawingStroke[], eraser: DrawingStroke, canvasWidth: number, canvasHeight: number) {
  const scale = Math.max(canvasWidth, canvasHeight);
  const eraserPoints = eraser.points;

  return strokes.flatMap((stroke) => {
    const radius = (stroke.width + eraser.width) / (2 * scale);
    const radiusSquared = radius * radius;
    const segments: DrawingPoint[][] = [];
    let segment: DrawingPoint[] = [];

    // Older drawings can contain long segments with very few sample points.
    // Sample their interiors too so the eraser cuts the visible line itself.
    const sampled = stroke.points.flatMap((point, index) => {
      if (!index) return [point];
      const previous = stroke.points[index - 1];
      const distance = Math.hypot((point.x - previous.x) * canvasWidth, (point.y - previous.y) * canvasHeight);
      const count = Math.max(1, Math.ceil(distance / 3));
      return Array.from({ length: count }, (_, i) => ({ x: previous.x + (point.x - previous.x) * (i + 1) / count, y: previous.y + (point.y - previous.y) * (i + 1) / count }));
    });
    sampled.forEach((point) => {
      const touched = eraserPoints.some((eraserPoint) => {
        const distanceX = point.x - eraserPoint.x;
        const distanceY = point.y - eraserPoint.y;
        return distanceX * distanceX + distanceY * distanceY <= radiusSquared;
      });

      if (touched) {
        if (segment.length > 0) {
          segments.push(segment);
          segment = [];
        }
      } else {
        segment.push(point);
      }
    });

    if (segment.length > 0) {
      segments.push(segment);
    }

    return segments
      .filter((points) => points.length > 0)
      .map((points) => ({ ...stroke, points }));
  });
}

export function DrawingScreen({}: Props) {
  const presentation = usePresentation();
  const { progress, saveDrawing, rewardAction } = useProgress();
  const rewardedDrawing = useRef(false);
  const [strokes, setStrokes] = useState<DrawingStroke[]>(
    progress.drawingStrokes.filter((stroke) => stroke.color !== '#ffffff'),
  );
  const strokesRef = useRef(strokes);
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null);
  const currentStrokeRef = useRef<DrawingStroke | null>(null);
  const history = useRef<DrawingStroke[][]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canvasSide, setCanvasSide] = useState(1);
  const canvasRef = useRef<View>(null);
  const canvasOrigin = useRef<{ x: number; y: number } | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1);
  const [canvasHeight, setCanvasHeight] = useState(CANVAS_SIZE);
  const canvasWidthRef = useRef(1);
  const canvasHeightRef = useRef(CANVAS_SIZE);
  const [color, setColor] = useState(palette[0]);
  const [isEraser, setIsEraser] = useState(false);
  const [brushSize, setBrushSize] = useState(10);
  const colorRef = useRef(color);
  const brushSizeRef = useRef(brushSize);
  const isEraserRef = useRef(isEraser);
  const sliderWidthRef = useRef(1);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    isEraserRef.current = isEraser;
  }, [isEraser]);

  const commitStroke = () => {
    const stroke = currentStrokeRef.current;
    if (!stroke) return;
    const next = isEraserRef.current
      ? eraseTouchedStrokes(strokesRef.current, stroke, canvasWidthRef.current, canvasHeightRef.current)
      : [...strokesRef.current, stroke];
    history.current = [...history.current.slice(-19), strokesRef.current];
    setCanUndo(true);
    strokesRef.current = next;
    currentStrokeRef.current = null;
    setStrokes(next);
    setCurrentStroke(null);
    void saveDrawing(next);
    if (!isEraserRef.current && !rewardedDrawing.current) { rewardedDrawing.current = true; void rewardAction('drawing'); }
  };

  const eventPoint = (event: GestureResponderEvent) => {
    const { pageX, pageY, locationX, locationY } = event.nativeEvent;
    const origin = canvasOrigin.current;
    // SVG paths and dots can become the event target; their local coordinates
    // are not the origin of the canvas.
    return getCanvasPoint(origin ? pageX - origin.x : locationX, origin ? pageY - origin.y : locationY, canvasWidthRef.current, canvasHeightRef.current);
  };

  const drawingResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const point = eventPoint(event);
        const stroke = point ? { color: colorRef.current, points: [point], width: brushSizeRef.current } : null;
        currentStrokeRef.current = stroke;
        setCurrentStroke(stroke);
      },
      onPanResponderMove: (event) => {
        const point = eventPoint(event);

        if (!point) {
          commitStroke();
          return;
        }

        const stroke = currentStrokeRef.current;
        if (!stroke) return;
        const last = stroke.points[stroke.points.length - 1];
        const distance = Math.hypot((point.x - last.x) * canvasWidthRef.current, (point.y - last.y) * canvasHeightRef.current);
        if (distance < 1) return;
        const count = Math.min(256, Math.ceil(distance / 3));
        const points = Array.from({ length: count }, (_, i) => ({ x: last.x + (point.x - last.x) * (i + 1) / count, y: last.y + (point.y - last.y) * (i + 1) / count }));
        const next = { ...stroke, points: [...stroke.points, ...points] };
        currentStrokeRef.current = next;
        setCurrentStroke(next);
      },
      onPanResponderRelease: commitStroke,
      onPanResponderTerminate: commitStroke,
    }),
  ).current;

  const sliderResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const nextSize = 4 + (Math.max(0, Math.min(event.nativeEvent.locationX, sliderWidthRef.current)) / sliderWidthRef.current) * 26;
        setBrushSize(Math.round(nextSize));
      },
      onPanResponderMove: (event) => {
        const nextSize = 4 + (Math.max(0, Math.min(event.nativeEvent.locationX, sliderWidthRef.current)) / sliderWidthRef.current) * 26;
        setBrushSize(Math.round(nextSize));
      },
    }),
  ).current;

  return (
    <View style={styles.screen}>
      <AppTopMenu compact icon="palette" title="Mi dibujo" />

      <View style={presentation.styles.drawingContent}>
        <View style={styles.canvasArea} onLayout={event => setCanvasSide(Math.min(460, event.nativeEvent.layout.width, event.nativeEvent.layout.height))}>
        <View
          ref={canvasRef}
          testID="drawing-canvas"
          {...drawingResponder.panHandlers}
          onLayout={(event) => {
            canvasWidthRef.current = event.nativeEvent.layout.width;
            canvasHeightRef.current = event.nativeEvent.layout.height;
            setCanvasWidth(event.nativeEvent.layout.width);
            setCanvasHeight(event.nativeEvent.layout.height);
            canvasRef.current?.measureInWindow((x, y) => { canvasOrigin.current = { x, y }; });
          }}
          style={[styles.canvas, { width: canvasSide, height: canvasSide }]}
        >
            <Svg height="100%" width="100%">
            {strokes.map((stroke, index) => stroke.points.length === 1 ? <Circle key={`${index}-dot`} cx={stroke.points[0].x * canvasWidth} cy={stroke.points[0].y * canvasHeight} fill={stroke.color} r={stroke.width / 2} /> : (
              <Path
                d={pointsToPath(stroke.points, canvasWidth, canvasHeight)}
                key={`${index}-${stroke.points.length}`}
                fill="none"
                stroke={stroke.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={stroke.width}
              />
            ))}
            {currentStroke ? (
              <>
                <Path
                  d={pointsToPath(currentStroke.points, canvasWidth, canvasHeight)}
                  fill="none"
                  stroke={currentStroke.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={currentStroke.width}
                />
                {currentStroke.points.length === 1 ? (
                  <Circle
                    cx={currentStroke.points[0].x * canvasWidth}
                    cy={currentStroke.points[0].y * canvasHeight}
                    fill={currentStroke.color}
                    r={currentStroke.width / 2}
                  />
                ) : null}
              </>
            ) : null}
          </Svg>
        </View>
        </View>

        <View style={styles.controls}>
          <ScrollView style={styles.paletteScroll} contentContainerStyle={styles.palette} accessibilityLabel="Colores del pincel">
            {palette.map((itemColor) => (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Elegir color ${itemColor}`}
                aria-pressed={!isEraser && color === itemColor}
                key={itemColor}
                onPress={() => {
                  setColor(itemColor);
                  setIsEraser(false);
                }}
                style={[styles.colorButton, { backgroundColor: itemColor }, !isEraser && color === itemColor && styles.selectedColor]}
              >{!isEraser && color === itemColor && <MaterialCommunityIcons name="check" color="#fff" size={22} />}</TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.brushRow}>
            <Text style={styles.controlLabel}>Tamaño</Text>
          <View
            {...sliderResponder.panHandlers}
            accessibilityRole="adjustable"
            accessibilityLabel="Tamaño del pincel"
            aria-valuemin={4}
            aria-valuemax={30}
            aria-valuenow={brushSize}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={event => setBrushSize(value => Math.max(4, Math.min(30, value + (event.nativeEvent.actionName === 'increment' ? 2 : -2))))}
            onLayout={(event) => {
              sliderWidthRef.current = event.nativeEvent.layout.width;
            }}
            style={styles.slider}
          >
            <View pointerEvents="none" style={styles.sliderTrack} />
            <View
              pointerEvents="none"
              style={[
                styles.sliderThumb,
                {
                  height: brushSize + 12,
                  left: `${((brushSize - 4) / 26) * 100}%`,
                  marginLeft: -(brushSize + 12) / 2,
                  width: brushSize + 12,
                },
              ]}
            />
          </View>
          </View>

          <View style={styles.toolRow}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Goma de borrar"
            aria-pressed={isEraser}
            onPress={() => {
              setIsEraser(true);
              setColor('#ffffff');
            }}
            style={[styles.eraserButton, isEraser && styles.activeEraserButton]}
          >
            <MaterialCommunityIcons color="#26796e" name="eraser" size={22} />
            <Text style={styles.eraserButtonText}>Goma</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Deshacer último trazo" disabled={!canUndo} style={[styles.eraserButton, !canUndo && styles.disabledButton]} onPress={() => {
            const previous = history.current.pop();
            if (!previous) return;
            strokesRef.current = previous;
            setStrokes(previous);
            setCanUndo(history.current.length > 0);
            void saveDrawing(previous);
          }}><MaterialCommunityIcons color="#26796e" name="undo" size={22} /><Text style={styles.eraserButtonText}>Deshacer</Text></TouchableOpacity>
          </View>
        </View>
      </View>
      <AppBottomMenu />
    </View>
  );
}
