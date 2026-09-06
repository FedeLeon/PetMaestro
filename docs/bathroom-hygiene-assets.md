# Assets de higiene: suciedad, espuma y agua

Generados con la herramienta integrada `image_gen`, con transparencia RGBA verificada. Archivos guardados en `assets/generated/house/`. Se conservan las versiones previas.

## Suciedad compartida

Archivo: `assets/generated/house/tooth-plaque-v2.png`.

Prompt final:

Single isolated sprite for PetMaestro children's hygiene game: one small irregular golden yellow sticky dirt splat with a few tiny brown crumbs, polished cute 3D cartoon style. Compact rounded blob, fills 90 percent of square frame. Transparent background. PNG alpha cutout. No glow, no shadow, no scenery, no text, no border. Only the dirt splat.

## Espuma

Archivo: `assets/generated/house/bath-foam-v1.png`.

Prompt final:

Single isolated game sprite: a compact fluffy cluster of white bath soap foam with rounded lather lobes and a few glossy pale turquoise bubbles, friendly polished 3D cartoon style for PetMaestro. Horizontal oval cluster centered and filling almost the whole square canvas. Bright white opaque foam with soft blue shading within its silhouette, a few iridescent highlights. Transparent background, PNG alpha cutout. No soap bar, no character, no ground, no text, no outside glow or shadow.

## Gota de agua

Archivo: `assets/generated/house/bath-water-drop-v1.png`.

Prompt final:

Single isolated game particle sprite: one plump aqua blue water droplet pointing straight up, rounded bottom, bright white glossy highlight and soft cyan translucent interior, polished cute 3D cartoon style matching a children's bath game. Centered and filling 85 percent of a square frame. Transparent background, PNG alpha cutout. No face, no text, no ground or outside shadow, no splash or other objects. Must read clearly when rendered as a small falling drop or water left on fur.

## Ducha de mano

Archivo: `assets/generated/house/bath-hand-shower-v1.png`.

Prompt final:

Single isolated draggable game tool: a large handheld shower head for a cute children's cat bath game. Turquoise grip with golden paw emblem and polished warm gold rim, silver nozzle face with clearly visible little holes. Friendly rounded 3D cartoon style. Diagonal composition: wide round shower head at upper left (center x=30%, y=25%), long handle extends toward lower right (x=78%, y=82%). No hose, no hand, no water (animated separately). Fill 90 percent of square frame. Transparent background, PNG alpha cutout, no text, no ground shadow, no other objects.

La suciedad se comparte entre dientes y cuerpo. Se quitó el relleno marrón del contenedor dental y se amplió su área un 18% en ancho y un 12% en alto. La espuma reemplaza cada mancha enjabonada; el mismo sprite de agua se usa para la lluvia, el chorro de la ducha de mano y las gotas que se secan con la toalla. Jabón, ducha y toalla siguen el punto táctil sin marcos de fondo y tienen tamaños mayores, ajustados a la altura de la escena horizontal.


## Validación

- Los cuatro PNG nuevos son RGBA y tienen alfa real entre 0 y 255.
- TypeScript y `git diff --check`: correctos.
- Recorridos automatizados en Chrome a 1280 × 720 y eventos táctiles simulados a 844 × 390: cepillado, jabón, enjuague, secado y regresión del inodoro completos; sin errores de página.
- Capturas revisadas con cada herramienta arrastrándose, placa sobre los dientes, espuma y humedad sobre el cuerpo.
- Exportación del bundle Android: correcta. No se realizó una prueba en dispositivo físico.
