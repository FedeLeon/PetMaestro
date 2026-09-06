# Assets y actividades del baño

Generados el 2026-09-05 con la herramienta integrada `image_gen`. Se conservaron los originales y se copiaron los resultados al proyecto. No se cambió el SDK ni se agregaron dependencias.

## Archivos

- `assets/generated/house/shower-cat-v1.png`: escena de ducha (1536 × 1024).
- `assets/generated/house/toilet-cat-v1.png`: gato sentado en el inodoro (1536 × 1024).
- `assets/generated/house/bath-soap-v1.png`: jabón con transparencia.
- `assets/generated/house/bath-towel-v1.png`: toalla con transparencia.

## Prompts finales

### Ducha

Use case: stylized-concept. Create one landscape 1536x1024 game illustration for PetMaestro shower minigame. Reference image defines the exact orange kitten identity and polished friendly cartoon style. Full body same adorable orange kitten, standing front-facing inside a turquoise tiled shower, golden shower head above, paws relaxed at sides, smiling closed mouth. Clean dry fur, no bubbles, no water streams, no dirt (these will be animated in code). Kitten centered at x=42%, occupies x=24%-60%, y=22%-88%. Shower head x=42%, y=12%. Rightmost 25% is simple turquoise tile empty space for game controls. No text, no buttons, no watermark. Landscape composition.

Referencia: `assets/generated/house/tooth-brushing-cat-v2.png`.

### Inodoro

Use case: stylized-concept. One landscape 1536x1024 illustration for children's PetMaestro toilet minigame. References: image 1 exact orange kitten identity and cartoon style, image 2 turquoise and gold bathroom design. Same adorable kitten seated comfortably on a white ceramic toilet with kitten ear shaped cistern, front three quarter view. Paws on lap, little feet dangling, relaxed smile. Wholesome fully fur covered cartoon animal, no anatomical detail or waste. Kitten and toilet occupy left two thirds, centered x=38%, entire toilet visible bottom y=92%. Gold flush button on cistern. Turquoise tiled bathroom, rightmost 25% empty tile space for controls. No text, UI, bubbles, stars or watermark.

Referencias: `tooth-brushing-cat-v2.png` y `bathroom-interactive-v2.png` de `assets/generated/house/`.

### Toalla

Use case: stylized-concept. Single isolated game tool asset: a plush folded turquoise bath towel with golden embroidered paw print, softly rounded edges, polished adorable children's 3D cartoon PetMaestro style, front three-quarter view, centered filling most square frame. Genuine transparent background, no text, no shadows outside object, no other objects. Used as draggable drying tool.

### Jabón

Use case: stylized-concept. Single isolated game tool asset: a rounded coral pink bar of soap embossed with a golden kitten paw print, a few white foam bubbles hugging its edge, polished adorable children's 3D cartoon PetMaestro style, front three-quarter view, centered filling most square frame. Genuine transparent background, no text, no other objects, no watermark. Used as draggable bath soap tool.

## Funcionamiento

- Dientes: seleccionar pasta, seleccionar cepillo, frotar los ocho dientes. La placa se reduce en cuatro pasos. Completar mejora higiene en 25.
- Ducha: seleccionar jabón y recorrer las seis manchas; seleccionar ducha y recorrer la espuma; seleccionar toalla y secar las seis zonas. Completar mejora higiene en 50.
- Inodoro: iniciar, esperar la cortina (4 s), tirar de la cadena (2,4 s), elegir la ducha y enjuagar ambas patitas sobre la cortina. Completar mejora baño en 70 e higiene en 10 mediante una sola actualización persistida.
- Las mejoras se limitan a 100. Abandonar antes de completar no otorga mejoras. Una misma sesión solo premia una vez.
- Las imágenes conservan sus proporciones. Las coordenadas táctiles y visuales usan el mismo rectángulo de imagen; no se calculan sobre paneles distintos.
- La descarga y el lavado interactivo de patitas usan los assets documentados en `docs/toilet-paw-assets.md`.
- La respiración de los tres accesos usa ciclos de escala y desplazamiento. El agua, el remolino, la cortina y los destellos se animan con React Native Animated; los bucles y temporizadores se limpian al desmontar.
- Toda la interfaz se diseña exclusivamente para horizontal. Los estilos están en `src/styles/house/`.

## Validación realizada

- `npm run typecheck` y `git diff --check`: correctos.
- `npx expo export --platform android --output-dir /tmp/petmaestro-bathroom-final-20260905`: correcto, bundle Hermes y 245 assets.
- Chrome automatizado con Playwright: recorridos completos en 1280 × 720 y 844 × 390, siempre horizontales.
- Eventos táctiles simulados mediante Chrome DevTools: cepillado y las tres fases de ducha completados, incluso con agua y cursor superpuestos.
- Comprobado: cepillo bloqueado sin pasta; frotar fuera de la boca no limpia; mejoras de 25/50/70+10; cancelar el inodoro no otorga mejoras; no se duplican al esperar en la pantalla final; máximo de 100; persistencia después de recargar; movimiento de respiración observable; sin errores de página.
- Capturas revisadas de dientes sucios/limpios, espuma/enjuague, cortina del inodoro y habitación. La escena inicial también conserva el rectángulo completo de la ilustración y escala al gato sobre el suelo.
- Jabón y toalla verificados como RGBA con alfa entre 0 y 255.
- La exportación y la simulación táctil no sustituyen la comprobación en un dispositivo Android físico. El botón Atrás nativo queda pendiente de esa comprobación.
