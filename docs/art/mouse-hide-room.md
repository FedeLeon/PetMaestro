# Habitación del ratoncito

Asset final: `assets/generated/toys/mouse-hide-room-v1.png` (1983 × 793). Generado con la herramienta integrada imagegen, sin API ni CLI alternativos. Ilustración original generada con IA el 17 de octubre de 2026. El ratoncito reutiliza `assets/generated/cat-items/mouse-toy-v2.png`.

El fondo se muestra completo, conservando su proporción horizontal. Los escondites y sus máscaras están definidos en `src/data/mouseHideAndSeek.ts`; cada máscara vuelve a dibujar un fragmento exacto del fondo delante del ratón.

## Prompt exacto

```text
Use case: illustration-story
Asset type: landscape background for a children's mouse hide-and-seek game, wide panorama aspect ratio 2.5:1.
Primary request: A cozy colorful children's playroom full of mixed objects to search among. No mouse anywhere: the interactive mouse is added separately by the game.
Style: polished hand-painted cartoon game illustration, warm rounded shapes, clear soft outlines, golden wood, turquoise and coral accents, cheerful soft shading, matching a cute orange kitten pet game.
Composition: frontal dollhouse view, whole room visible edge to edge. Many medium-sized clearly readable objects with interesting gaps between them: low bookcase on the left with colorful books and blocks, a toy train and slippers on the floor, a big open toy chest with a ball and plush toys left-center, small round rug with building blocks center, a low armchair and cushions center-right, a wicker basket and a potted plant on the far right. Upper half contains low shelves with stuffed toys, books, lamp, colorful storage boxes; window in back wall. Foreground contains small clusters of toys, stack of books, ball, rolled blanket. Objects evenly distributed across entire room and at different heights, plenty of little spaces beside and between objects for hiding a small mouse sprite, no huge empty central area, child-friendly readable detail rather than visual noise. Show all furniture fully, no closeup, horizontal only.
Constraints: no text, no letters, no UI, no buttons, no frame, no watermark, no children, no cats, absolutely no mice or mouse drawings. Opaque background.
```

## Mecánica

Diez escondites aleatorios, sin repetir dentro de una partida. Seis hallazgos completan una ronda. Cada hallazgo revela el ratón durante 260 ms; después se cierra una cortina coral de dos paños durante 420 ms. El escondite cambia únicamente cuando está completamente cerrada. Permanece cerrada 250 ms y se abre durante 500 ms. La ilustración SVG de la tela tiene pliegues, ribete dorado y solapamiento en el centro para tapar toda la habitación. La última transición también termina antes del premio. Los toques y las pistas quedan bloqueados hasta abrirse por completo.

La pista ilumina el escondite durante tres segundos. Sin reloj, vidas ni penalización por tocar otro objeto. Las zonas táctiles miden al menos 44 puntos. Se conserva la recompensa existente: cinco monedas la primera vez y recuperación de diversión en cada ronda completada. Al salir o pasar a segundo plano se cancelan animaciones y temporizadores; al regresar se retoma la cortina sin volver a contar el hallazgo ni duplicar la mudanza. Con movimiento reducido, los desplazamientos duran 80 ms.

Lógica de transición: `src/components/useMouseCurtain.ts`. Dibujo: `src/components/MouseRoomCurtain.tsx`. Medidas y estilos: `src/styles/components/mouseHideAndSeek.styles.ts`.

