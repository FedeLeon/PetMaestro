# Memoria del pez de peluche

Asset final: `assets/generated/ui/fish-memory-card-back-v1.png` (1254 × 1254, PNG con alpha). Generado con imagegen integrado el 17 de octubre de 2026, usando la flecha de tienda como referencia del marco de madera y turquesa. Original sin edición externa; sin CLI ni API alternativa.

## Prompt exacto

```text
Use case: illustration-story
Asset type: square memory-game card back, transparent outside rounded corners, for PetMaestro children's kitten game.
Input image: reference for the game's honey-colored wood border, turquoise enamel, softly painted cartoon UI style only. Do not include an arrow.
Primary request: ONE square card back, exact frontal flat view, gently rounded corners, substantial warm honey wooden rim with a thin golden cream inner trim, turquoise center with a subtle repeating pattern of little paw prints and tiny bubbles. Centered in the middle one large friendly cream-and-gold FISH silhouette emblem, very clear at small sizes, slightly raised painted appearance. Symmetrical balanced composition suitable for eight identical cards in a memory matching game. Cozy polished cartoon game art, soft highlights, clean readable shapes. Fill 98 percent of the square canvas with the card, only tiny transparent margin outside corners. Opaque turquoise and wood within the card, actual alpha transparency outside its silhouette. No extra objects, no UI buttons, no letters, no text, no numbers, no watermark, no perspective, no tilt, no glow or shadow outside the silhouette.
```

## Mecánica

El pez usa ocho cartas cuadradas en dos filas de cuatro. Hay cuatro parejas de palabras del vocabulario disponible, priorizadas como en el repaso adaptativo y mezcladas al iniciar. Las cartas giran sobre el eje Y durante 340 ms con perspectiva; la imagen frontal y el dorso no se ven simultáneamente. El frente muestra el dibujo y su palabra inglesa.

Los toques quedan bloqueados durante cada giro y mientras se compara una pareja. Las parejas distintas quedan visibles 950 ms después del segundo giro y se dan vuelta juntas. Las parejas correctas quedan a la vista con borde verde y tilde. Cada pareja correcta registra una respuesta de vocabulario y reproduce su pronunciación. Al encontrar las cuatro se otorgan cinco monedas y recuperación de diversión por cada ronda completa, también al repetir. El resultado espera al giro final y al guardado de las respuestas.

Se detienen animaciones y temporizadores al salir o pasar a segundo plano. Si se vuelve, las cartas sin resolver quedan cerradas. Movimiento reducido muestra los frentes sin giro espacial. La estrella suave conserva sus seis cartas y tres parejas.

Lógica: `FishMemoryGame.tsx` y `fishMemory.ts`. Giro: `FlippingMemoryCard.tsx`. Medidas y estilos horizontales: `fishMemory.styles.ts`.

## Verificación

`npm run test:fish-memory`: dos tamaños horizontales, ocho cuadrados en dos filas, giro real, bloqueo de toques durante la animación, reversión de errores, resolución usando solo cartas vistas, cuatro registros de vocabulario, premios, repetición, movimiento reducido, salida a mitad del giro y conservación de las seis cartas de la estrella. Capturas e informe en `/tmp/petmaestro-fish-memory`.

