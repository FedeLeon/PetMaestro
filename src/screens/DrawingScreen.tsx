import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/screens/drawingScreen.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { PanResponder, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
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
const DRAWING_RESET_KEY = 'petmaestro.drawing.reset.v2';

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

    stroke.points.forEach((point) => {
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
      .filter((points) => points.length > 1)
      .map((points) => ({ ...stroke, points }));
  });
}

export function DrawingScreen({}: Props) {
  const { progress, saveDrawing } = useProgress();
  const [strokes, setStrokes] = useState<DrawingStroke[]>(
    progress.drawingStrokes.filter((stroke) => stroke.color !== '#ffffff'),
  );
  const strokesRef = useRef(strokes);
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null);
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

  useEffect(() => {
    AsyncStorage.getItem(DRAWING_RESET_KEY).then((hasReset) => {
      if (hasReset) {
        return;
      }

      strokesRef.current = [];
      setStrokes([]);
      setCurrentStroke(null);
      void saveDrawing([]);
      void AsyncStorage.setItem(DRAWING_RESET_KEY, '1');
    });
  }, [saveDrawing]);

  const drawingResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        const point = getCanvasPoint(locationX, locationY, canvasWidthRef.current, canvasHeightRef.current);
        setCurrentStroke(point ? { color: colorRef.current, points: [point], width: brushSizeRef.current } : null);
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        const point = getCanvasPoint(locationX, locationY, canvasWidthRef.current, canvasHeightRef.current);

        if (!point) {
          setCurrentStroke((stroke) => {
            if (!stroke) {
              return null;
            }

            const nextStrokes = isEraserRef.current
              ? eraseTouchedStrokes(strokesRef.current, stroke, canvasWidthRef.current, canvasHeightRef.current)
              : [...strokesRef.current, stroke];
            strokesRef.current = nextStrokes;
            setStrokes(nextStrokes);
            void saveDrawing(nextStrokes);
            return null;
          });
          return;
        }

        setCurrentStroke((stroke) => (stroke ? { ...stroke, points: [...stroke.points, point] } : stroke));
      },
      onPanResponderRelease: () => {
        setCurrentStroke((stroke) => {
          if (!stroke) {
            return null;
          }

          const nextStrokes = isEraserRef.current
            ? eraseTouchedStrokes(strokesRef.current, stroke, canvasWidthRef.current, canvasHeightRef.current)
            : [...strokesRef.current, stroke];
          strokesRef.current = nextStrokes;
          setStrokes(nextStrokes);
          void saveDrawing(nextStrokes);
          return null;
        });
      },
      onPanResponderTerminate: () => setCurrentStroke(null),
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
      <View style={styles.header}>
        <HeaderBackButton />
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons color="#26796e" name="palette" size={28} />
          <Text style={styles.title}>Mi dibujo</Text>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>

      <View style={styles.content}>
        <View
          {...drawingResponder.panHandlers}
          onLayout={(event) => {
            canvasWidthRef.current = event.nativeEvent.layout.width;
            canvasHeightRef.current = event.nativeEvent.layout.height;
            setCanvasWidth(event.nativeEvent.layout.width);
            setCanvasHeight(event.nativeEvent.layout.height);
          }}
          style={styles.canvas}
        >
            <Svg height="100%" width="100%">
            {strokes.map((stroke, index) => (
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

        <View style={styles.controls}>
          <Text style={styles.controlLabel}>Colores</Text>
          <View style={styles.palette}>
            {palette.map((itemColor) => (
              <TouchableOpacity
                accessibilityLabel={`Elegir color ${itemColor}`}
                key={itemColor}
                onPress={() => {
                  setColor(itemColor);
                  setIsEraser(false);
                }}
                style={[styles.colorButton, { backgroundColor: itemColor }, color === itemColor && styles.selectedColor]}
              />
            ))}
          </View>

          <View style={styles.brushHeader}>
            <Text style={styles.controlLabel}>Tamaño del pincel</Text>
          </View>
          <View
            {...sliderResponder.panHandlers}
            onLayout={(event) => {
              sliderWidthRef.current = event.nativeEvent.layout.width;
            }}
            style={styles.slider}
          >
            <View style={styles.sliderTrack} />
            <View
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

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              setIsEraser(true);
              setColor('#ffffff');
            }}
            style={[styles.eraserButton, isEraser && styles.activeEraserButton]}
          >
            <MaterialCommunityIcons color="#26796e" name="eraser" size={22} />
            <Text style={styles.eraserButtonText}>Goma de borrar</Text>
          </TouchableOpacity>

        </View>
      </View>
      <AppBottomMenu />
    </View>
  );
}
