# PetMaestro: guia de arquitectura y desarrollo

## Proposito

PetMaestro es un juego infantil offline para Android, pensado inicialmente para ninos de 4 a 7 anos. El jugador aprende palabras en castellano e ingles mediante ejercicios con imagenes, avanza por un mapa de niveles, gana monedas y cuida a un gatito.

El MVP no tiene cuentas, anuncios, compras reales ni backend. El progreso se guarda localmente y la estructura queda preparada para audio, necesidades de la mascota, mas mascotas, logros, misiones y sincronizacion futura.

## Stack

- Expo SDK 57 y React Native 0.86.
- React 19 y TypeScript.
- React Navigation Native Stack.
- AsyncStorage para progreso offline.
- expo-speech y expo-audio para sonido.
- react-native-svg para el lienzo de dibujo.
- @expo/vector-icons para iconos.

Antes de cambiar APIs de Expo, leer AGENTS.md y la documentacion versionada de Expo SDK 57.

## Estructura

```text
App.tsx                         Entrada, provider y stack principal
src/components/                 Componentes visuales reutilizables
src/context/ProgressContext.tsx Estado global y persistencia local
src/data/assetImages.ts         Registro de assets importados
src/data/gameContent.ts         Palabras, niveles, rondas y tienda
src/data/audioAssets.ts         Registro de pronunciaciones locales
src/screens/                    Logica y JSX de cada pantalla
src/styles/screens/             StyleSheet separado por pantalla
src/types/                      Tipos compartidos
assets/generated/               Ilustraciones y sprites
docs/PROJECT_GUIDE.md           Esta guia
ASSET_CREDITS.md                Procedencia y licencias de imagenes
AUDIO_CREDITS.md                Procedencia y licencias de sonidos
```

## Separacion de pantallas y estilos

Cada pantalla mantiene su logica, estado local y JSX en src/screens/<Screen>.tsx. Su StyleSheet vive en src/styles/screens/<screen>.styles.ts y exporta una constante llamada styles.

```ts
// src/screens/ExampleScreen.tsx
import { styles } from '../styles/screens/exampleScreen.styles';
```

Los componentes reutilizables pueden conservar estilos locales cuando el estilo pertenece exclusivamente al componente. Los estilos propios de una pantalla deben permanecer en su modulo de estilos. Los archivos de estilos no contienen logica de negocio.

## Navegacion

El stack se declara en App.tsx con el header nativo oculto y headers propios.

- MapScreen: pantalla inicial y mapa vertical de niveles.
- GameScreen: rondas, respuestas y feedback.
- PetScreen: gatito, vestidor y equipamiento.
- ShopScreen: categorias de la tienda.
- ShopCategoryScreen: items y compras de una categoria.
- HouseScreen: exterior, casa, cocina, bano y muebles fijos.
- DrawingScreen: lienzo cuadrado, paleta, pincel y borrador.

El menu inferior se muestra en las vistas principales y se oculta durante el juego. Revisar siempre la navegacion existente antes de asumir que goBack representa el flujo deseado.

## Estado y persistencia

ProgressContext es la fuente global del progreso. Administra niveles, monedas, items comprados y equipados, muebles, animales, trazos del dibujo y medidores de hambre, higiene, bano, juego y energia.

La clave de AsyncStorage es petmaestro.progress.v1. Al agregar campos, usar valores por defecto al leer datos antiguos y preservar compatibilidad. Las pantallas deben usar las funciones del contexto, no escribir directamente en AsyncStorage.

DEV_INFINITE_COINS esta activado en ProgressContext para pruebas de tienda. Debe desactivarse antes de una version de produccion.

## Contenido, assets y audio

src/data/gameContent.ts contiene palabras, categorias, niveles, rondas y tienda. Cada nivel debe usar palabras de su tematica y cada palabra debe tener traduccion, asset y audio antes de incluirse en una ronda.

Los imports de imagenes se centralizan en src/data/assetImages.ts y las pronunciaciones locales en src/data/audioAssets.ts. Los nuevos assets se registran en ASSET_CREDITS.md y los sonidos en AUDIO_CREDITS.md. Mantener separados escenas, tarjetas, sprites y items equipables; revisar siempre transparencia, recorte y proporcion.

## Reglas para futuras tareas

1. Leer AGENTS.md y esta guia antes de modificar el proyecto.
2. Inspeccionar primero la pantalla, contexto, tipos y datos afectados.
3. Preservar cambios existentes del worktree y mantener el alcance acotado.
4. Reutilizar componentes y patrones actuales antes de crear abstracciones.
5. Usar apply_patch para ediciones manuales.
6. Mantener controles grandes, textos cortos y una accion principal clara.
7. No introducir login, red, anuncios o compras reales sin una decision explicita.
8. Si se modifica una pantalla, revisar tambien src/styles/screens/.
9. Si cambia ProgressState, revisar todas sus pantallas consumidoras y la compatibilidad de AsyncStorage.
10. Registrar procedencia y licencia de cada asset nuevo.

## Comandos y validacion

```bash
npm install
npm start
npm run web
npm run android
npm run typecheck
git diff --check
npm run build:android:preview
```

Para navegador usar npm run web y la vista responsive. Para Android usar Expo Go durante desarrollo o EAS preview para una APK instalable.

Antes de cerrar una tarea ejecutar typecheck y diff --check, probar el flujo afectado y revisar visualmente textos, botones, gestos, audio, animaciones, zonas tactiles, capas y proporcion de assets. TypeScript no sustituye una prueba visual en web o Android.
