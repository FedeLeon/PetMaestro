# Marcos de menús e íconos de navegación

Generados el 2026-10-17 con ImageGen integrado, sin API externa. PNG con alpha original conservado. Estilo: madera cálida, filete turquesa y centro crema para mantener legibles los controles.

- `assets/generated/ui/menus/top-menu-frame-v1.png` (2172×724): marco superior.
- `assets/generated/ui/menus/bottom-menu-frame-v1.png` (2172×724): marco inferior.
- `assets/generated/navigation/adventures-v1.png` (1254×1254): brújula con mochila y mapa, retirada del menú.

`MenuFrame.tsx` dibuja los marcos en nueve secciones SVG, con recorte virtual del margen exterior y esquinas de tamaño constante. No modifica los archivos ni deforma las huellitas. Es decorativo y no intercepta pulsaciones. El menú inferior mide 76 puntos de alto y contiene siete controles circulares de 60 puntos, sin etiquetas visibles y exclusivamente en horizontal. El álbum de figuritas reemplaza a Aventuras. [Asset de Juguetes](toys-menu.md).

Álbum: `assets/generated/navigation/sticker-album-v1.png`, PNG transparente de 192×192, generado con ImageGen integrado el 2026-10-21. Prompt: álbum turquesa y dorado con figuritas grandes de gatito, manzana, pez y estrella, estilo cartoon del juego, sin letras.

## Prompt final: marco superior

```text
Use case: stylized-concept. Production bitmap game UI asset for PetMaestro, a cozy illustrated children's pet learning game. Create ONE empty horizontal rounded rectangular header panel, wide 3:1 canvas, transparent background outside the panel. Entire panel almost fills the canvas, only 1% transparent margin. Warm honey wooden outer molding with soft rounded corners, narrow turquoise enamel inner trim, pale warm ivory center that is fully opaque, flat, uncluttered and almost uniform for readable overlaid text and controls. Playful polished cartoon painting like a cozy pet shop, soft highlights and gentle wood grain, not photorealistic. Minimal embossed tiny paw details ONLY in the four corner blocks. Straight horizontal and vertical edges, front view, no perspective. Corner radius about 7% of image height; border thickness about 4% of image height. All decoration restricted to outer 12% strips of canvas, LARGE empty ivory center. Must support nine-slice scaling: center and edge midpoints have no medallions, no attached decorations; top/bottom center straight repeatable wood trim. No icons, no words, no letters, no buttons, no watermark. Preserve actual alpha around rounded corners.
```

## Prompt final: marco inferior

```text
Use case: stylized-concept. ONE production UI asset: an empty bottom navigation tray for the children's game PetMaestro. Wide 3:1 rectangle, transparent outside rounded silhouette, panel fills canvas with only 1% clear margin. Friendly illustrated cartoon, warm honey wood frame, softly beveled rounded corners, slim turquoise enamel inset trim, opaque smooth light buttery cream center to place five navigation buttons later. Match a cozy warmly lit cartoon pet shop, tactile painted wood, soft highlights. A couple of tiny embossed paw shapes in corner blocks only. Border thickness 4% of canvas height; corners radius 7% of height. Center large and EMPTY. Front view with straight aligned horizontal edges, NO perspective. Nine-slice-ready: keep all detail inside outer 12% edge strips; no central ornaments anywhere on edge midpoints. No buttons, no icons in the center, no words, no letters, no text, no watermark. Actual transparent alpha outside rounded silhouette, no checkerboard.
```

## Prompt final: Aventuras

```text
Use case: stylized-concept. ONE transparent game navigation icon for PetMaestro, a friendly cartoon pet learning game for children. A charming chunky golden compass with turquoise rim and a red-orange pointer, resting against a small explorer's backpack and a curled cream treasure map with a dotted path ending in a bright pawprint. Simple compact readable silhouette, recognizable at 48 pixels. Warm polished hand-painted cartoon style matching cozy wooden pet-shop illustrations, thick friendly rounded forms, gentle highlights, rich turquoise, honey gold, coral orange. Square canvas; illustration occupies 88% of canvas with clean transparent margin, centered. No rectangular card, no background scene, no button frame, no text, no letters, no labels, no watermark, no checkerboard. Genuine transparent background. Keep illustration playful and crisp, not a generic line icon.
```

