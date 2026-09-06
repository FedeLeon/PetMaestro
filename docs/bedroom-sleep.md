# Dormitorio y descanso

`HouseBedroom` usa el mismo encuadre proporcional a ancho completo que cocina y baño. El botón con respiración está sobre la cama y la zona de salida coincide con la puerta visible.

`useBedroomSleep` controla un descanso de 8,3 segundos: oscurecimiento de 900 ms, sueño durante 6,5 s y encendido de 900 ms. `SleepingCat` anima la respiración y tres letras Z con desfases. Se detienen animaciones al salir o perder el foco, y no se otorga energía si se interrumpe. Se bloquean pulsaciones duplicadas durante la secuencia.

Al completar, `ProgressContext.completeSleep` establece `needs.energy` en 100 mediante el guardado compartido, preservando las demás necesidades y el resto del progreso. El menú superior consume ese mismo estado.

Asset: `assets/generated/house/cat-sleeping-v1.png`, generado con imagegen integrado a partir del gato existente. Se solicitó una segunda edición sin halo; el resultado conservó un damero dibujado, por lo que se limpió el fondo neutro conectado al borde al preparar el PNG transparente. El dormitorio existente se conserva.

## Validación

Typecheck y `git diff --check` correctos. Chromium con entrada táctil en 1280×720 y 844×390: fondo a ancho completo, inicio desde la cama, oscuridad y tres Z, final automático, energía de 17 a 100 sin alterar otras necesidades y persistencia después de recargar. En 844×390 también se verificó que salir por la puerta durante el sueño y esperar más que la duración total deja la energía en 17; al regresar se puede completar un nuevo descanso. Capturas inspeccionadas. Dispositivo físico pendiente.

## Prompt

Use case: identity-preserve. Create a transparent PNG game sprite of this exact orange tabby kitten SLEEPING, curled up horizontally on its side, eyes peacefully closed, head on the RIGHT resting on its front paws, tail curled around its round body on the LEFT. Same orange striped fur, cream muzzle and paws, pink inner ears, adorable painted cartoon style. Three-quarter view slightly from above, suitable to place on a mattress whose headboard is on the right. Entire cat visible with small padding; wide horizontal silhouette. Actual transparent alpha background. No bed, no pillow, no blanket, no floor, no shadows outside the silhouette, no text or Z letters (these will be animated separately). One single sleeping kitten, not a sheet.

Edición seleccionada: Precise background extraction: keep this sleeping orange kitten unchanged but REMOVE ALL the orange/brown glow, haze and shadows around it. Clean cutout sprite with truly transparent pixels everywhere outside the fur silhouette, including the space below the paws and above the body. Opaque kitten, clean antialiased fur edges, no outer glow, no drop shadow, no background. Preserve exact pose, proportions, coloring and closed eyes. Transparent PNG.
