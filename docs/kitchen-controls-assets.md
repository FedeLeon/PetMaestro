# Controles e ingredientes de cocina

Generados con la herramienta integrada imagegen. Los tres PNG nuevos están en `assets/generated/kitchen/`, con fondo transparente. Los originales de generación se conservaron.

- `button-pot-fire-v1.png`: compartido entre Cocinar y Encender cocina.
- `cat-blowing-v1.png`: botón de soplar y personaje que entra desde el costado derecho, mira a la olla, sopla y sale en cada pulsación.
- `button-cat-eating-v1.png`: botón de servir al gato.

Los botones tienen un ciclo de respiración de 2,3 segundos. La animación se detiene mientras están deshabilitados. Cada soplido dura 1,5 segundos y bloquea pulsaciones repetidas hasta completarse. La flecha de play de Terminar comida reutiliza el icono vectorial de MaterialCommunityIcons.

Los alimentos elegidos aparecen en el panel derecho. Se agregan en cualquier orden al soltarlos dentro de la abertura de la olla; soltar fuera o cancelar el gesto los devuelve a su lugar. La imagen arrastrada se renderiza encima del panel y de la escena. Las coordenadas se miden en ventana al comenzar cada gesto, para que el arrastre atraviese ambos espacios sin saltos. Encender se habilita solo cuando entraron todos los ingredientes.

## Prompts

### button-pot-fire-v1.png

Create a new transparent game UI asset. Reference is style only: turquoise pot with gold handles and gold paw emblem. Show this cute rounded pot smaller, centered, with a clearly visible cluster of friendly orange/yellow flame shapes DIRECTLY UNDER the pot. Polished 3D cartoon PetMaestro kitchen aesthetic. Square canvas, entire silhouette fits with 10% margin. True transparent background. No text no button frame no stove no room no ground, no outer glow. Readable at 70px.

### cat-blowing-v1.png

Create a NEW transparent character sprite based on the orange kitten reference identity and polished 3D cartoon style. Full head and upper torso in THREE QUARTER SIDE VIEW, kitten on right FACING LEFT, leaning slightly left, cheeks puffed, eyes gently closed, lips puckered and actively blowing air toward the LEFT to cool food. Tiny white whiskers, cream muzzle/chest and fluffy orange fur. No bowl no food no pot no table no scenery, no frame no text no ground shadow. True transparent background, entire ears and paws inside canvas with padding. This sprite will appear at the right of a cooking pot, facing the pot to its left. Also readable as a small button icon.

### button-cat-eating-v1.png

Create a new square transparent UI icon, based on the reference orange kitten identity and polished cute 3D cartoon style. Happy orange kitten head and front paws, holding a small wooden spoon with a bite of food near its happy open mouth, a small turquoise bowl with gold rim in front. Clear readable silhouette for 70px mobile game button. Full ears inside canvas, 10% padding. True transparent background, NO room no table no text no outer button border no ground shadow.


## Validación

- TypeScript y `git diff --check`.
- Chromium/Playwright: recorrido completo a 1280×720 con mouse y a 844×390 con gestos táctiles CDP.
- Soltar fuera de la olla no agrega comida; orden libre de ingredientes; arrastre entre panel y escena; respiración de los cuatro controles; tres apariciones del gato soplando y bloqueo durante cada animación; servir y terminar con mejora de comida (+36 en la prueba).
- Exportación Android con Expo. No probado en dispositivo físico.
