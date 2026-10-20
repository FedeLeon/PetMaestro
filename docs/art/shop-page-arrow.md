# Flecha de paginación de la tienda

Asset final: `assets/generated/ui/shop-page-arrow-v1.png` (1254 × 1254, alpha transparente). Creado con imagegen integrado el 17 de octubre de 2026, usando el marco superior como referencia visual. Sin CLI ni API alternativa. Se usa el PNG original sin edición externa; la flecha izquierda se obtiene reflejándolo al dibujar.

## Prompt exacto

```text
Use case: illustration-story
Asset type: transparent PNG paging arrow button for PetMaestro children's cartoon pet game.
Input image: reference for wood, turquoise, golden border and polished painted game UI style only.
Primary request: one large readable RIGHT pointing arrow button, front view. A rounded nearly square medallion with thick warm golden honey-colored carved wooden rim and a rich turquoise enamel inset. In the center a big cream-gold right pointing chevron arrow, chunky rounded shape, subtly embossed, readable at 64px. Friendly hand-painted cartoon shading like the supplied menu frame. A tiny carved paw on the rim at the bottom is allowed but the arrow dominates. Centered isolated single button, square canvas with only 4 percent transparent margin, whole silhouette visible. No lettering, no numbers, no text, no extra UI, no characters, no scenery, no background. Genuine alpha transparency outside the button; no glow, no cast shadow outside the silhouette, no checkerboard. Do not include a left arrow or a second button.
```

## Integración

`ShopPageArrow.tsx` muestra zonas táctiles de 72 a 92 puntos en ambos extremos de la escena, centradas verticalmente. El arte activo aumenta suavemente entre escala 1 y 1.06, en ciclos de 2.2 segundos. Los botones deshabilitados quedan atenuados y quietos. El bucle se detiene al salir, ir a segundo plano, comprar o activar movimiento reducido. La animación usa el driver nativo y no cambia el tamaño de la zona táctil.

Los productos se reducen un 12% en ambos ejes conservando la línea de apoyo sobre los pedestales. Nombres, precios y controles de compra mantienen sus medidas. Todo está diseñado para horizontal.

