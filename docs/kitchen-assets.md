# Cocina interactiva

Assets generados con imagegen el 2026-09-06. Uso local en PetMaestro. Formato horizontal; fondos 3:2 sin recorte y sprites PNG con transparencia. Originales conservados en el directorio de generación de Codex.

Flujo: abrir heladera → comprar/desbloquear permanentemente → elegir hasta tres ingredientes → agregarlos a la olla → encender → revolver mediante arrastre → soplar tres veces → servir → tres cucharadas. La mejora de hambre se aplica al finalizar, con máximo 100. Los alimentos no se consumen del inventario. Los desbloqueos se guardan en unlockedFoodIds dentro de petmaestro.progress.v1; partidas antiguas comienzan sin alimentos comprados y conservan el resto de su progreso. Se desactivó el saldo infinito de desarrollo para usar las monedas guardadas.

Coordenadas relativas al rectángulo real de cada fondo: heladera dos columnas y tres estantes; olla centro (0.445,0.48); boca (0.445,0.455); plato (0.445,0.82). La cuchara usa coordenadas de ventana para evitar saltos entre los elementos superpuestos. Animaciones de caída, vapor, calor, traslado de cuchara y cambio de expresión. El botón de cucharada ofrece una alternativa al arrastre.

## Prompts

### kitchen-interactive-v2.png

Use case: stylized-concept. Landscape 1536x1024 game room illustration for PetMaestro. Reference 1 defines polished 3D cartoon detail, reference 2 defines kitchen objects and warm cream/turquoise palette. Create a NEW beautiful cozy kitten kitchen, front view: tall turquoise refrigerator with cat ears and golden paw emblem at left x=18%, stove with empty hob at center x=48%, cream cupboards, gold taps, window and sink at x=68%, arched wooden exit door at far right x=90%. Wooden table at lower right, otherwise clear walkable warm tiled floor in bottom 35%. No cat, no food, no pot, no text or UI. Keep all fixtures fully in frame, rounded friendly materials, consistent perspective. Landscape only.

### fridge-interior-v1.png

Landscape 1536x1024 game background, inside an open cute turquoise refrigerator for PetMaestro. Front view perfectly straight, warm cream white clean interior, gold trim and tiny paw details, soft cool interior lighting. Three wide EMPTY shelf compartments spanning x=12% to 88%, shelf surfaces at y=35%, 64%, 92%, with ample empty space above each for two selectable ingredient sprites. Open door edges visible at sides, no food, no bottles, no text, no UI. Polished rounded 3D cartoon matching cream/turquoise/gold children's cat game. Landscape only.

### cooking-counter-v1.png

Landscape 1536x1024 children's cooking game background PetMaestro, polished rounded 3D cartoon turquoise cream and gold kitchen. High three-quarter view looking down at a broad clean cream countertop, a turquoise induction cooktop with one large EMPTY circular heating ring centered x=45% y=65%, diameter about 42% of frame width, simple gold trim. Upper background warm yellow tiled backsplash, a few utensils hanging near top, gentle window light. No pot, no food, no text or UI. Clear uncluttered work surface around hob. Landscape only.

### feeding-cat-v1.png

Landscape 1536x1024 PetMaestro feeding game illustration. Same adorable orange tabby kitten identity as reference, large shiny amber eyes, cream muzzle, tiny pink nose, polished friendly 3D cartoon. Kitten seated at a wooden kitchen table, upper body front-facing, centered x=43%, head spans x=25%-60%, ears near y=8%, cheerful slightly open mouth at x=43% y=44% ready for spoonfuls. Both paws resting on tabletop. Wooden tabletop occupies bottom 38%, empty area centered x=43% y=76% for food bowl added in code. Warm yellow turquoise gold kitchen softly blurred behind. No food, no bowl, no spoon, no text or UI. Landscape only.

### food-carrot-v1.png

Single isolated ingredient game sprite for PetMaestro: one plump bright orange carrot with a short fresh green leafy top, friendly rounded polished 3D cartoon, three-quarter view, centered filling 85% of square frame. Transparent background PNG alpha cutout. No plate, no face, no text, no shadow outside object.

### food-potato-v1.png

Single isolated ingredient game sprite for PetMaestro: two small golden tan potatoes, one whole and one cut in half revealing pale yellow flesh, friendly rounded polished 3D cartoon, three-quarter view, centered filling 85% of square frame. Transparent background PNG alpha cutout. No plate, no face, no text, no shadow outside object.

### food-peas-v1.png

Single isolated ingredient game sprite for PetMaestro: a bright green open pea pod with five round peas and two loose peas beside it, friendly rounded polished 3D cartoon, three-quarter view, centered filling 85% of square frame. Transparent background PNG alpha cutout. No plate, no face, no text, no shadow outside object.

### food-rice-v1.png

One small fluffy mound of white rice grains, cute polished 3D cartoon cooking ingredient sprite, creamy soft individual grains. ONLY rice, no bag no sack no bowl no plate no packaging. Isolated true transparent background, no scenery no text no ground shadow. Large centered object.

### food-chicken-v1.png

Single isolated ingredient sprite for PetMaestro: two simple boneless chicken breast pieces, soft light peach pink color, smooth friendly rounded shape, appetizing non-graphic stylized food. Polished 3D cartoon style, centered filling most square frame. Transparent PNG alpha background, no animal, no blood, no bones, no plate, no text, no outside shadow.

### food-fish-v1.png

One boneless salmon fillet ingredient, pink orange with cream curved stripes, cute polished rounded 3D cartoon mobile pet game sprite. Isolated transparent background, no plate no text no scenery. Large centered single object.

### cooking-pot-v1.png

Empty open turquoise cooking pot, gold rim and two gold side handles, cute polished 3D cartoon cozy pet kitchen game sprite. High front three-quarter view showing a very broad oval empty dark teal interior in upper half, so separate food sprites can be overlaid inside. No lid no food no steam no stove no scenery. Isolated transparent background, pot fills canvas.

### cooking-spoon-v1.png

One large wooden cooking spoon, rounded deep oval bowl at upper left, long golden wood handle extends diagonally to lower right, cute polished 3D cartoon pet game sprite matching a pastel turquoise kitchen. Isolated true transparent background. No scenery, no text, no food, no shadow outside object.

### feeding-bowl-v1.png

One empty shallow turquoise cat food bowl with gold rim and golden paw emblem on front, high front three-quarter view, wide visible oval empty interior to overlay food. Cute polished 3D cartoon mobile pet game asset. Isolated true transparent background, no scenery no food no text no shadow outside object.

### feeding-cat-chew-v1.png

Edit this exact kitchen cat frame for the next frame of an eating animation. Preserve EVERY pixel composition, cat size and position, background, tabletop, paws, colors, lighting and camera. ONLY change the cat mouth from open to a tiny happy CLOSED chewing smile and gently squint its eyes happily. No food no bowl no spoon, no other changes. Landscape same dimensions.


## Validación

- TypeScript: `npm run typecheck`.
- Espacios y conflictos: `git diff --check`.
- Exportación Android: `npx expo export --platform android --output-dir /tmp/petmaestro-kitchen/android-final`.
- Chromium/Playwright a 1280×720 y 844×390: compra con descuento, saldo insuficiente, desbloqueos después de recargar, selección de hasta tres ingredientes, cocción con movimiento dentro de la olla, cucharada por arrastre y por botón, actualización visible de hambre exactamente una vez (+44 en la prueba).
- Cancelación durante la caída de un ingrediente y durante un bocado: sin recompensa. Plato de un ingrediente y límite de hambre en 100 comprobados.
- Gestos táctiles emulados mediante CDP. No se verificó en un dispositivo Android físico.

Los controles actuales usan assets con respiración y los ingredientes se arrastran desde el panel derecho. Ver `docs/kitchen-controls-assets.md` para los assets y las interacciones actualizados.
