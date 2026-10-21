# PetMaestro: guia de arquitectura y desarrollo

## Proposito

PetMaestro es un juego infantil offline para Android, pensado inicialmente para ninos de 4 a 7 anos. El jugador aprende palabras en castellano e ingles mediante ejercicios con imagenes, avanza por un mapa de niveles, gana monedas y cuida a un gatito. El juego se desarrolla exclusivamente en orientacion horizontal.

## Regla de orientacion

La APK siempre se ejecuta en `landscape`, configurado en `app.json`. No existe modo vertical y no se debe agregar logica de deteccion de orientacion ni estilos alternativos para `portrait`. Todas las nuevas pantallas, interacciones, assets y animaciones deben disenarse para el espacio horizontal disponible.

El MVP no tiene cuentas, anuncios, compras reales ni backend. El progreso se guarda localmente y la estructura queda preparada para audio, necesidades de la mascota, mas mascotas, logros y sincronizacion futura.

## Stack

- Expo SDK 57 y React Native 0.86.
- React 19 y TypeScript.
- React Navigation Native Stack.
- AsyncStorage para progreso offline.
- expo-audio para reproducción nativa; adaptador HTMLAudioElement en web.
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
src/styles/screens/             StyleSheet horizontal separado por pantalla
src/types/                      Tipos compartidos
assets/generated/               Ilustraciones y sprites
docs/PROJECT_GUIDE.md           Esta guia
ASSET_CREDITS.md                Procedencia y licencias de imagenes
AUDIO_CREDITS.md                Procedencia y licencias de sonidos
```

## Separacion de pantallas y estilos

Cada pantalla mantiene su logica, estado local y JSX en src/screens/<Screen>.tsx. Su unico StyleSheet horizontal vive en src/styles/screens/<screen>.styles.ts y exporta una constante llamada styles.

Distribución horizontal para celulares: encabezado de una fila con necesidades por icono; navegación inferior de 76 puntos, compartida en `src/styles/layout.ts`. El mapa se desplaza con niveles grandes y flechas. El salón usa cámara cercana y controles laterales; muebles/mascotas se editan en un panel desplegable de dos tarjetas cuadradas por fila, sin quitar ancho a la escena.

```ts
// src/screens/ExampleScreen.tsx
import { styles } from '../styles/screens/exampleScreen.styles';
```

Los componentes reutilizables pueden conservar estilos locales cuando el estilo pertenece exclusivamente al componente. Los estilos propios de una pantalla deben permanecer en su modulo horizontal de estilos. Los archivos de estilos no contienen logica de negocio.

## Navegacion

El stack se declara en App.tsx con el header nativo oculto y headers propios.

- MapScreen: pantalla inicial y mapa de niveles dentro de la experiencia horizontal.
- GameScreen: rondas, respuestas y feedback.
- PetScreen: gatito, vestidor y equipamiento.
- El vestidor usa dos tarjetas cuadradas por fila; el gato puede acercarse y acariciar a los seis animales del exterior. Flujo y pruebas: `docs/animal-petting.md`.
- ShopScreen: local ilustrado con nueve objetos tocables que abren las categorias, sin tarjetas de categorias.
- ShopCategoryScreen: tres productos por pagina sobre pedestales, compras, uso de objetos adquiridos y flecha visible de vuelta al local. Ver `docs/shop-ux.md`.
- HouseScreen: exterior, casa, cocina, bano y muebles fijos.
- Los animales del exterior usan articulación SVG y un reloj compartido que se pausa fuera de foco: `docs/farm-animal-animation.md`.
- DrawingScreen: lienzo cuadrado, paleta, pincel y borrador.

El menu inferior se muestra en las vistas principales y se oculta durante el juego. Revisar siempre la navegacion existente antes de asumir que goBack representa el flujo deseado.

## Estado y persistencia

ProgressContext es la fuente global del progreso. Administra niveles, monedas, items comprados y equipados, muebles, animales, trazos del dibujo y medidores de hambre, higiene, bano, juego y energia.

La clave de AsyncStorage es petmaestro.progress.v1. Al agregar campos, usar valores por defecto al leer datos antiguos y preservar compatibilidad. Las pantallas deben usar las funciones del contexto, no escribir directamente en AsyncStorage.

DEV_INFINITE_COINS está activado temporalmente para pruebas: se muestran 99.999 monedas y las compras de objetos y alimentos conservan el saldo real guardado. Para recuperar la economía habitual, cambiar la constante a `false` en `ProgressContext.tsx`. Las escrituras se serializan y las acciones leen el estado actual desde una referencia para preservar compras, monedas y equipamiento al tocar rápidamente. Un error de guardado muestra un reintento en el encabezado. Un error de lectura impide sobrescribir la partida hasta recuperarla; un JSON ilegible se respalda en `petmaestro.progress.v1.recovery` antes de iniciar un estado nuevo.

Las necesidades bajan 0,2 puntos por minuto y la pérdida por ausencia tiene un límite de 35 puntos por actualización. Completar un nivel recupera 25 puntos de juego. Las acciones de cuidado mantienen sus recompensas y límites de 100.

## Contenido, assets y audio

src/data/gameContent.ts contiene palabras, categorias, niveles, rondas y tienda. Cada nivel debe usar palabras de su tematica y cada palabra debe tener traduccion, asset y audio antes de incluirse en una ronda.

Los imports de imagenes se centralizan en src/data/assetImages.ts y las pronunciaciones locales en src/data/audioAssets.ts. Los nuevos assets se registran en ASSET_CREDITS.md y los sonidos en AUDIO_CREDITS.md. Mantener separados escenas, tarjetas, sprites y items equipables; revisar siempre transparencia, recorte y proporcion.

Resoluciones de distribución: indicadores/navegación 128–256 px, alimentos 384 px, ropa/palabras 512 px y cuentos 640 px por cuadro; fondos y panoramas conservan el detalle necesario. `scripts/optimize-assets.py --assetmap <assetmap.json>` analiza la exportación Android (`expo export --platform android --dump-assetmap`); `--apply --backup-dir <directorio fuera del proyecto>` aplica los límites y guarda los originales. Mantiene lienzos transparentes, coordenadas normalizadas y celdas de atlas, incluyendo archivos idénticos agrupados por Metro.

`AudioContext` administra música, efectos y una única voz para impedir pronunciaciones superpuestas. Las preferencias se guardan en `petmaestro.audio.v1`. `src/data/gameAudio.ts` registra los temas y efectos originales; `scripts/generate_game_audio.py` permite reproducirlos. El audio se inicia con una interacción, se pausa en segundo plano y baja la música durante una palabra. El plugin de audio tiene deshabilitados micrófono y reproducción en segundo plano. La implementación sigue la [documentación de audio de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/audio/).

En React Native Web 0.21, `ImageBackground` transmite `onLayout` a la imagen interior. Los fondos deben declarar `width: '100%'` y `height: '100%'` en `imageStyle`: de otro modo, los metadatos del PNG pueden producir coordenadas del tamaño original de la imagen y dejar los botones fuera del panel visible.

## Reglas para futuras tareas

La biblioteca de cuentos usa las rutas `Library` y `Audiobook`, con acceso desde
el menú inferior y la biblioteca colocada en el salón. `src/data/audiobooks.ts`
registra doce cuentos (dos MP3 y diez lecturas) en una única grilla desplazable, sin paginación, de cuatro tarjetas por fila. `src/data/libraryProgression.ts` define el orden estable y exige completar las cinco preguntas de cada uno de los cuatro libros anteriores, sin exigir aciertos. Las tarjetas bloqueadas son grises y el lector y `ProgressContext` también validan el acceso. `useStoryPlayer` gestiona
reproducción, progreso y errores; `AudioContext.setNarrationActive` pausa la
música durante esta vista. El menú inferior conserva nombres accesibles pero
solo muestra assets. Fuentes, derechos y pruebas: `docs/audiobooks.md`.

Los textos completos actuales están en `src/data/longStoryTexts.json` y `src/data/expandedStories.json`; las sesenta preguntas,
sus respuestas y el cálculo del premio están en `src/data/storyReadingContent.ts`.
`completeStoryQuiz` valida una ronda completa, entrega de 5 a 10 monedas y guarda
`storyQuizResults` con mejor puntuación y último intento para evitar doble cobro.
`npm run test:story-reading` verifica lectura manual, audio y cuestionarios.
`npm run test:library-progression` verifica los doce cuentos, ambos desbloqueos con cero aciertos, repeticiones, cancelación y persistencia en dos tamaños horizontales.

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

Celular: reemplazar el marco superior por pastillas flotantes de necesidades, sonido y monedas; liberar la altura de los escenarios. Juegos y cuidados ocultan la navegación hasta salir o terminar. `ScenePresentation` limita el modo inmersivo a la actividad de la casa; escritorio conserva sus menús. La interfaz se organiza en `src/presentation/mobile` y `desktop` (menú, estilos, medidas y políticas), con bases comunes en `shared`; `usePresentation` selecciona la variante y `ScenePresentation` conserva el ciclo de actividad. Las pantallas, las reglas del juego y el progreso siguen compartidos. Flecha móvil circular dentro de su marco; vestidor sin acceso duplicado a juguetes y cocina con un único botón en el horno.

Para navegador usar npm run web con una ventana horizontal. Para Android usar Expo Go durante desarrollo o EAS preview para una APK instalable horizontal.

Antes de cerrar una tarea ejecutar typecheck y diff --check, probar el flujo afectado y revisar visualmente textos, botones, gestos, audio, animaciones, zonas tactiles, capas y proporcion de assets. TypeScript no sustituye una prueba visual en web o Android.

## Revision del juego 2026-10-16

La revisión abarcó las nueve pantallas, el registro de recursos, las 104 rondas de los 11 niveles, los 62 productos, la persistencia, la navegación y las actividades de cuidado. Se preservaron los cambios de vestidor, zapatos y exterior que ya estaban en el directorio de trabajo.

### Hallazgos y cambios aplicados

| Área | Problema observado | Resultado |
| --- | --- | --- |
| Mapa y tienda | Las coordenadas usaban dimensiones intrínsecas de los fondos. Algunos puntos y categorías quedaban fuera de la vista. | Fondos ajustados al panel, posiciones calculadas con su tamaño visible y espacio reservado para el menú inferior. |
| Tienda | Categorías grandes se superponían en horizontal pequeño; comprar tenía una zona táctil de 26 puntos. | Categorías delimitadas por ancho y alto disponibles, compra de al menos 44 puntos y espacio de desplazamiento para llegar a los productos inferiores. |
| Ejercicios | Las tarjetas se encogían, el dibujo de audio se superponía y las parejas eran poco legibles. | Tarjetas distribuidas en la altura disponible, dibujos ajustados a su contenedor y parejas con ilustraciones sin marcos diminutos. |
| Instrucciones | `promptLanguage` no cambiaba realmente el idioma de la traducción. | Consignas y opciones coherentes con el idioma indicado. Los dibujos en castellano mantienen su consigna en castellano y se corrigieron las tildes de árbol, pájaro y león. |
| Errores y puntuación | Una traducción equivocada avanzaba; otros tipos permitían reintentar. Los reintentos podían conservar el bonus perfecto. | Todos permiten corregir antes de avanzar. Se cuenta como ronda sin ayuda únicamente si no hubo errores; el resultado lo explica. |
| Transiciones | Temporizadores de respuesta podían continuar al salir y admitir acciones repetidas durante un cambio. | Bloqueo inmediato, cancelación al perder foco, entrada breve entre rondas, progreso visible y botón al siguiente nivel. |
| Música y sonido | Solo había pronunciaciones parciales. | Dos temas originales de unos 29 y 40 segundos, nueve efectos, voces exclusivas, volumen de música reducido durante voz y tres controles persistentes. |
| Audio web | El reproductor web de la versión instalada descartaba la promesa de `play()`, produciendo rechazos al cancelar una reproducción. | Adaptador web que gestiona reproducción, cancelación, restricciones del navegador y liberación; Expo Audio se conserva en nativo. |
| Cuidado | El juego apenas recuperaba diversión y todas las necesidades se vaciaban rápidamente. | Los niveles recuperan diversión, el deterioro es más lento y la ausencia tiene un límite. Los medidores llevan a la actividad correspondiente. |
| Interacciones | Las zonas de los botones de cuidado se movían junto con su animación. | Zona táctil fija; la respiración se aplica al icono interior. Los paneles de baño permiten desplazarse si no cabe todo. |
| Animación | Destellos seguían usando temporizadores al terminar y los cambios de imágenes podían recargar frames. | Temporizadores finitos, frames mantenidos para destellos y celebración, brillos desfasados y pausa de parpadeo/caminata del gato al perder foco o pasar a segundo plano. |
| Dibujo | Había una migración que borraba automáticamente el dibujo, puntos que desaparecían al soltar y efectos secundarios dentro de actualizadores de estado. | Se preserva el dibujo, los puntos se guardan y renderizan, y cada gesto se confirma una sola vez. Hay 20 pasos de deshacer. |
| Goma | Un trazo antiguo con pocos puntos podía no borrarse por el medio. | Se muestrea el interior de los segmentos para cortar la línea visible; deshacer restaura el original. |
| Guardado | Varias acciones usaban una copia anterior del estado y las escrituras podían terminar fuera de orden. | Estado actual por referencia, cola de escrituras, validación de campos antiguos y reintento visible ante fallos. |
| Orientación y encuadre | Faltaba protección explícita de las áreas seguras y los modales. | Áreas seguras, barra de estado oculta y modales exclusivamente horizontales. Se agregó un cierre visible al modal del nivel. |
| Final de aventura | Ciudad Gatuna parecía prometer un segundo mundo jugable, aunque solo contenía candados. | Se identifica claramente como adelanto de próximos niveles. |
| Carga | Se añadía una espera fija después de cargar la partida. | La entrada depende de que estén listos los datos y los recursos; se precargan también música y efectos. En Android se conservan los módulos empaquetados sin consultar `Image.getSize` por imagen; los fallos identifican el recurso en el registro nativo y el reintento conserva lo ya cargado. |

### Assets y contenido pendientes

Los 246 PNG se pudieron decodificar sin errores. No se detectaron imports de archivos faltantes ni productos o palabras sin ilustración. Se reutilizó el arte existente; esto no equivale a una revisión visual de todas las combinaciones posibles de ropa ni a una validación de memoria en Android.

Hay 28 pronunciaciones para 38 palabras. Faltan `bread`, `butterfly`, `wave`, `shirt`, `socks`, `table`, `lamp`, `lion`, `elephant` y `monkey`. Se incorporaron `bear` y `boat`, con procedencia y licencias en `AUDIO_CREDITS.md`. Wikimedia limitó las descargas restantes con HTTP 429 y una espera de 600 segundos. Las palabras pendientes conservan texto y no muestran un botón silencioso; completar y revisar estas voces sigue siendo una tarea pendiente. Tampoco hay grabaciones locales de palabras en castellano.

Actualización 2026-10-20: assets de distribución ajustados al uso real; exportación Android reducida de aproximadamente 399 a 158 MiB antes del empaquetado de la APK. Los originales se respaldaron fuera del proyecto; no se eliminaron assets históricos ni se alteraron las coordenadas del juego.

La búsqueda estática encontró nueve PNG sin import actual: cuatro frames de caminata antiguos, las dos mitades antiguas del panorama, su primera versión completa, `bathroom-room.png` y `tooth-plaque-v1.png`. También hay un duplicado idéntico entre `farm/farm-rabbit.png` y `farm-action/rabbit/rabbit-03.png`. Son candidatos de limpieza, no archivos eliminados; debe revisarse su procedencia y cualquier herramienta externa antes de borrarlos.

### Validación y límites

- `npm run typecheck`, `npm run test:content` y `git diff --check`.
- Navegador Chromium en horizontal: 960×540 y 844×390, con capturas para inspección. Las suites se comprobaron también sobre una exportación de producción, sin recarga de desarrollo.
- `test:web`: los 11 niveles y sus 104 rondas, monedas, reintentos, salida durante una celebración, compra, equipamiento, preferencias y persistencia del dibujo.
- `test:care`: ocho dientes, tres fases de ducha, inodoro y lavado de patas, sueño, compra de alimento, arrastre a olla, revolver, enfriar, una cucharada por alimento y riego con espera. Se verifican los medidores y eventos reales de reproducción de medios.
- `test:bell`: carrera del cascabel por el parque, ocho poses de carrera, tres obstáculos ilustrados, física a distintas frecuencias, salto por toque y recogida de monedas visibles que viajan sobre los obstáculos, pausa, abandono, repetición y persistencia. Premios de actividades centralizados en `src/data/actionRewards.ts`; ver `docs/bell-runner-and-rewards.md`.
- `test:storage`: fallos simulados de lectura y escritura, recuperación con reintento, normalización de partidas anteriores y respaldo de JSON ilegible. Estos fallos son pruebas sintéticas de almacenamiento.
- `test:layout`: controles del mapa y tienda en pantalla, modales, adelanto de ciudad, vestidor, goma/deshacer sobre una línea antigua y reapertura de una misma habitación desde su medidor en horizontal pequeño.
- Exportación del bundle Android con Expo SDK 57 y Node 22. La configuración generada mantiene `landscape` y no incluye permisos de micrófono ni servicio de audio en segundo plano.

No había un dispositivo Android conectado. La exportación no reemplaza una prueba de APK, audio percibido, rendimiento, uso de memoria, gestos y áreas seguras en hardware. Las pruebas de audio en Chromium confirman carga y reproducción de medios, no una evaluación auditiva humana de la mezcla.

### Mecánicas recomendadas, por prioridad

Se conservan repaso adaptativo, seis juguetes, tres encargos de Ciudad Gatuna y álbum de 38 pegatinas. Se eliminó la vista Aventuras y misiones junto con sus cobros; el botón inferior se reemplazó por una ilustración de álbum de figuritas, sin texto. Ver [reglas y pruebas actuales](adventures.md). La ciudad ya es jugable al completar el nivel 11; la descripción anterior de adelanto corresponde al estado previo.

1. **Repaso adaptativo por palabra.** Guardar aciertos, errores y última práctica; intercalar palabras que necesitan refuerzo en sesiones cortas. Es la mejora con mayor relación directa con el aprendizaje y reutiliza los cuatro tipos de ronda actuales.
2. **Misiones de cuidado por sesión.** Por ejemplo, completar un nivel, preparar una comida y regar una flor. Mostrar tres objetivos visuales y entregar una recompensa clara al terminarlos.
3. **Juguetes con una actividad propia.** Pelota para perseguir, pluma para coordinación y juego de memoria con imágenes del vocabulario. Darles a los juguetes comprados una interacción además de su uso visual.
4. **Ciudad Gatuna jugable.** Convertir el adelanto en escenas breves: pedir un alimento en la panadería, encontrar objetos y ayudar a un personaje. Cada escena puede introducir una frase corta usando palabras conocidas.
5. **Álbum de palabras y pegatinas.** Desbloquear una pegatina al reconocer una palabra varias veces y permitir escucharla desde el álbum. Aprovecha los 38 dibujos y las pronunciaciones existentes.
6. **Modos de dificultad.** Separar una experiencia centrada en escuchar y reconocer dibujos de otra con lectura y traducción. Ajustar cantidad de distractores y ayudas sin cambiar la orientación horizontal.

Antes de sumar más minijuegos, conviene completar las voces pendientes y medir memoria y tiempos de carga en un Android de prestaciones modestas.
