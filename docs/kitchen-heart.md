# Corazón al comer y botones grandes

`assets/generated/kitchen/feeding-heart-v1.png`: corazón coral/rosa con volumen y fondo transparente, creado con imagegen integrado. En cada cucharada, `FeedingGame` crea una tanda de seis corazones alrededor de la cara. `FeedingHearts` los eleva lentamente con pequeños desplazamientos laterales y tamaños distintos; aparecen con desfases de 120 ms, se desvanecen y se retiran al terminar (3 segundos por tanda). Las tandas pueden superponerse sin cortar la anterior. La última también desaparece después de terminar la comida; no queda un corazón fijo. Al salir se detienen las animaciones. Se aplica tanto al arrastre de cuchara como al botón de cucharada.

Los tres assets de `KitchenAssetButton` pasan de 82×82 a 164×164 puntos: olla con fuego (Cocinar y Encender cocina), gatito soplando y gatito comiendo (Servir al gato). Conservan la respiración; el contenedor reserva margen para la animación y no se comprime. El panel sigue siendo desplazable cuando su contenido excede la altura del celular horizontal.

Validación: typecheck y `git diff --check` correctos. Chromium con toque simulado en 844×390: tamaño calculado de 164×164 en los cuatro pasos, respiración activa, selección y arrastre de ingredientes, encendido, tres soplidos, servir y tres cucharadas con el PNG de corazón visible. Capturas inspeccionadas; completar la comida sigue sumando la nutrición esperada. Dispositivo físico pendiente.

## Prompt

Revisión de corazones flotantes: typecheck y diff check correctos; Chromium 844×390 con toque simulado. Primera cucharada arrastrada y dos mediante botón: seis corazones por tanda, posición ascendente y opacidad decreciente comprobadas en distintos momentos, retiro completo de cada tanda incluida la última y nutrición final sin cambios. Captura inspeccionada.

A single cute plump pink-red heart game reward sprite for a children's orange kitten care game. Polished hand-painted cartoon illustration, softly rounded inflated heart, warm coral pink center, deeper raspberry edges, soft cream highlight on upper left, gentle dimensional shading, crisp clean silhouette. Centered entire heart with modest padding. No face, no letters, no other objects, no shadow outside the heart, no glow. Actual transparent background PNG with alpha, NOT a checkerboard illustration. Matches cozy colorful turquoise and golden cartoon pet game assets.
