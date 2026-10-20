# Ovillo que rueda por la habitación

Asset final: `assets/generated/toys/yarn-play-room-v1.png` (1983 × 793). Creado con imagegen integrado el 17 de octubre de 2026, usando la habitación del ratoncito como referencia de estilo. Fondo opaco original, sin edición externa; sin CLI ni API alternativa. El ovillo reutiliza `assets/generated/cat-items/yarn-ball-v2.png`.

## Prompt exacto

```text
Use case: illustration-story
Asset type: opaque panoramic landscape room background for a children's rolling yarn-ball chase game, aspect ratio 2.5:1.
Input image: reference for PetMaestro's cozy illustrated room style, warm golden wood, turquoise accents, softly painted friendly furniture. Create a new room with a much larger clear play floor.
Primary request: cheerful cozy kitten playroom seen from a frontal slightly elevated dollhouse angle. Upper 35 percent contains the back wall with a sunny window, small low turquoise sofa against the wall, low shelves with a few books and a plant, soft cushions at the far edges. Lower 65 percent is a broad continuous uncluttered honey-colored wooden floor for a rolling interactive yarn ball, with one very subtle flat cream oval rug that lies flush with the floor. Leave the ENTIRE lower 60 percent free of obstacles: no furniture legs or toys protruding into the central play floor. Objects only along the distant back wall or extreme upper corners. Show whole room edge to edge in a wide panorama, warm daylight, rounded forms, soft painted outlines and polished children's cartoon game shading matching the reference.
Constraints: landscape only, no UI, no border, no buttons, no text, no letters, no watermark, no cats, no mice, no people, NO BALL OR YARN anywhere. The game adds the yarn separately. Opaque full background.
```

## Mecánica y medidas

El ovillo se mueve continuamente por seis puntos del piso de la habitación, sin esperar un toque. El giro corresponde al desplazamiento horizontal y se invierte al rodar hacia la izquierda. Se acelera y frena suavemente al cambiar de dirección. La imagen no lleva recuadro ni borde; una sombra suave la apoya sobre el piso. Se conserva toda la habitación y su proporción horizontal.

La zona táctil mide entre 72 y 100 puntos. Un margen diagonal mantiene incluso la imagen girada dentro de la habitación. Seis toques completan la ronda; 350 ms de separación impiden sumar dos aciertos con un doble toque. Cada ronda completa entrega cinco monedas, incluso al repetir, y conserva la recuperación de diversión y el progreso de misiones. Los fallos no descuentan puntos ni vidas.

La animación usa el driver nativo y se detiene al salir, al pasar a segundo plano o al terminar. Con movimiento reducido no hay giro ni recorrido automático: tocarlo ofrece una nueva ubicación, manteniendo el juego accesible. La lógica está en `useRollingYarnMotion.ts`, las medidas en `rollingYarn.layout.ts` y los estilos en `rollingYarn.styles.ts`.

Cada acierto muestra las chispas doradas y turquesas existentes (`ui/click-sparkle-01.png` a `04.png`) en el lugar del toque durante 650 ms. El efecto no intercepta toques ni aparece por tocar el piso; los aciertos seguidos pueden tener efectos simultáneos. El último acierto conserva la habitación y el contador 6/6 durante ese intervalo antes del premio. Los efectos y la espera final se cancelan al salir o pasar a segundo plano. El contador está dentro de la esquina inferior izquierda de la habitación, sobre el marco dorado con huellitas `ui/cooking-stir-panel-v1.png`, acompañado por un pequeño ovillo. El recorrido reserva espacio alrededor del contador para evitar superposiciones en pantallas pequeñas. Se reutilizan assets del juego sin modificar sus originales.

## Verificación

`npm run test:yarn` prueba dos tamaños horizontales, movimiento y giro continuos sin toques, límites de la habitación, contador con marco dentro de la vista, ausencia de recuadro del ovillo, chispas solo ante aciertos y en la posición correcta, limpieza de efectos, celebración del último toque, dobles toques, recompensas, repetición, movimiento reducido, salida y conservación del juego de cascabel. Capturas e informe en `/tmp/petmaestro-yarn`.

