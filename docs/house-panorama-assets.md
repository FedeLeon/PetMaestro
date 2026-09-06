# Interior panorámico y dormitorio

Assets creados con la herramienta integrada imagegen, usando el interior anterior como referencia visual. Archivos finales en `assets/generated/house/`:

- `interior-panorama-full-v2.png`: único fondo horizontal de 3548×887 utilizado por la escena; contiene cocina, cuadro, jardín, salón, baño y puerta del dormitorio, con las juntas del piso continuas en el centro.
- `interior-panorama-full-v1.png`: consolidación anterior conservada como referencia de la edición.
- `interior-panorama-left-v1.png` e `interior-panorama-right-v1.png`: originales conservados como fuentes, sin referencias en la app.
- `cat-bedroom-v1.png`: dormitorio con puerta de regreso al salón y función de dormir sobre la cama. Mecánica y asset del gatito: `docs/bedroom-sleep.md`.

El fondo es un único PNG 4:1. La versión 2 edita el piso con imagegen para eliminar el salto de las juntas bajo la columna central; se recortaron los márgenes blancos del resultado y se normalizó a 3548×887. Conserva la composición de las cuatro puertas y el estilo del interior. La escena renderiza una sola imagen. El mundo lógico es de 2400×600 y todos sus elementos comparten coordenadas. La vista reserva el espacio del menú inferior; ofrece desplazamiento horizontal arrastrando con mouse o dedo y conserva su posición al volver de un ambiente. No muestra flechas, carteles de puertas ni pastilla de ayuda. Las zonas táctiles siguen correspondiendo a las puertas dibujadas, con nombres accesibles para lectores de pantalla.

Las posiciones de los nueve muebles están en `src/data/houseInteriorLayout.ts`: TV bajo el cuadro, biblioteca a un lado, rincón de lectura con sillón, alfombra y mesita, lámpara pez apoyada en la mesa cuando está colocada, planta junto al acceso y camita/lámpara cerca del dormitorio. Cada imagen conserva su proporción. La alfombra se dibuja debajo y los muebles quedan detrás de la zona de paso del gato. Los toques usan coordenadas de ventana para mantener el destino correcto después del scroll; los gestos de desplazamiento no hacen caminar al gato.

## Validación

Corrección del piso v2: typecheck y `git diff --check` correctos. Chromium a 1280×720 carga una sola imagen de 3548×887, sin errores de página. Inspección de captura tras arrastrar hasta la columna central: juntas horizontales continuas a ambos lados de la antigua unión. No se probó esta revisión en un dispositivo físico.

TypeScript y `git diff --check`. Chromium/Playwright a 1280×720 y 844×390: cuatro rutas de puertas, regreso con posición conservada, nueve muebles dentro del mundo y sin cubrir puertas, activar/desactivar muebles, caminar con límites sobre el piso y arrastre táctil que solo mueve la vista. Se inspeccionaron capturas de ambos extremos, del centro y del dormitorio. Exportación Android; dispositivo físico pendiente.

## Cámara y gestos

`useInteriorCamera.ts` distingue un toque de un arrastre horizontal de más de 8 puntos. Arrastrar sobre el piso o una puerta mueve la cámara y cancela la pulsación del elemento; un toque permite caminar o entrar. El desplazamiento se limita al ancho real de la casa. Al caminar, el gato comunica su posición y la cámara lo acompaña cuando llega a la franja lateral visible. Un movimiento manual interrumpe ese seguimiento hasta que el jugador elige otro destino.

Verificado con mouse a 1280×720 y gestos táctiles CDP a 844×390: arrastre en ambos sentidos, arrastrar una puerta sin abrirla, seguimiento automático a izquierda/derecha, prioridad del gesto manual durante la caminata, límites y regreso del dormitorio con posición conservada. No se probó en dispositivo físico.

## Prompts

### interior-panorama-full-v2.png

Use case: precise-object-edit. Edit target: supplied panoramic game interior. Correct ONLY the wooden floor in the bottom 40%: at the exact middle beneath the teal column the horizontal plank joints currently jump to different heights. Redraw the wooden flooring as ONE continuous coherent surface across the entire room: horizontal board joints must continue perfectly across the midpoint without steps, disconnected ends, vertical seam, or abrupt color change. Keep the same warm orange honey wood, cartoon painted grain, board scale and perspective. Preserve ALL walls, wallpaper, teal trim, column, four doorways, framed picture and their exact positions and proportions. Preserve the entire ultra-wide 4:1 composition of the input, no cropping or reframing; output the complete panorama. No new objects, no furniture, no cat, no text. This is a precise floor continuity repair, everything above the floor unchanged.

### interior-panorama-left-v1.png

NEW panorama LEFT HALF background for a horizontally scrolling cute cat house. Landscape 2:1 image. Use reference style only. Show a STRAIGHT FRONT WALL, yellow subtle paw wallpaper, teal lower wainscot, honey wood floor. The exact wall-floor boundary is at 56% image height. Only TWO open doorways: turquoise KITCHEN doorway at x=9%, spanning x=2..17%, top=18% bottom=56%; sunny GARDEN exit with open wooden doors at x=72%, spanning x=61..83%, same height. Absolutely NO bathroom or bedroom doorway in this half. Empty gold picture frame x=28..44%, y=23..40%. Broad EMPTY yellow wall bays between kitchen and garden, and x=84..100%. Floor totally EMPTY, no furniture no rug no plant no cat. Floor wood planks horizontal. At the very RIGHT image edge, a narrow straight teal vertical structural column from top to floor masks the join with a second panorama image. No side wall perspective, no text no buttons. Polished rounded cartoon game background matching reference.

### interior-panorama-right-v1.png

NEW panorama RIGHT HALF background for a horizontally scrolling cute cat house. Landscape 2:1 image. Reference STYLE ONLY, do not reuse its doors. Straight FRONT WALL yellow subtle paw wallpaper, teal lower wainscot, honey wood floor. Exact wall-floor boundary at 56% image height. Only TWO open doorways: turquoise BATHROOM doorway at x=48%, spanning x=40..56%, top=18% bottom=56%, visible toilet and sink; lavender BEDROOM doorway at x=90%, spanning x=82..98%, same height, visible tiny purple bed and moon decoration. Absolutely NO kitchen, garden or picture frame. Broad empty yellow wall bays x=3..38% and x=58..80% for separately added sofa and bookcase. Floor totally EMPTY no furniture no rug no plant no cat. Horizontal floor planks. At the very LEFT edge a narrow straight teal structural column from top to floor masks the join with left panorama half. No side walls no text no buttons. Polished rounded cartoon game background matching reference.

### cat-bedroom-v1.png

Create a new cozy cat bedroom background in same polished rounded cartoon style as reference. Landscape 3:2. Warm lavender walls with tiny golden stars, teal accents and warm honey wooden floor. Little purple cat bed with moon headboard at right x=70%, cozy blanket and pillow, a small bedside cabinet and warm bedside lamp beside it. Window with lavender curtains at center back. Open arched doorway at LEFT x=10% revealing yellow wallpaper and teal wainscoting of living room beyond. Clear empty walkable floor in foreground lower35%. No cat no people no text no UI. Bedroom ready for a future sleeping feature. Match orange-gold warmth and turquoise trim of app.
