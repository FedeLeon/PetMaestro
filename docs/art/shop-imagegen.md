# Fondos de tienda: ImageGen

Generados el 2026-10-17 con la herramienta integrada de ImageGen, sin API externa. Referencias: los fondos originales de tienda y expositor del proyecto, conservados. Salidas opacas PNG de 1942 × 809, utilizadas sin deformación en horizontal.

- `assets/generated/shop/pet-shop-explore-v3.png`: tienda con nueve objetos que representan categorías; zonas táctiles y etiquetas separadas en código.
- `assets/generated/shop/item-display-plinths-v3.png`: tres expositores vacíos; productos reales superpuestos y alineados por su silueta visible.

## Prompt final: tienda

```text
Use case: precise-object-edit.
Asset: panoramic interior background for the LANDSCAPE children's game PetMaestro. Output a wide 2400 x 1000 landscape composition (2.4:1), opaque.
Reference image 1 is the existing shop: keep its friendly brown-and-white puppy shopkeeper on the LEFT behind the rounded wooden counter, turquoise woodwork, warm amber light, clean friendly illustrated cartoon style. Rebuild the empty right-hand wall as a playful shop to explore, NOT a UI grid.
Include exactly NINE clearly separated category objects, in these normalized center positions (x,y, measured from top left):
UPPER display ledge: (0.39,0.29) colorful party HAT on a small hat stand; (0.55,0.29) big round GLASSES on an optical display; (0.71,0.29) one red T-SHIRT on a hanger; (0.87,0.29) one pink SKIRT on a hanger.
LOWER floor/low displays: (0.36,0.73) pair of blue SHOES; (0.495,0.75) basket with colorful YARN BALL and toy mouse; (0.63,0.73) cozy yellow ARMCHAIR; (0.765,0.75) friendly little white RABBIT on a green pet mat; (0.90,0.73) pot of pink DAISIES.
Each object must be large and recognizable, separated by empty breathing room, with width around 10% of the full image and height around 25%. Keep the top objects above the shelf at y=.43 and the lower objects grounded on low round wooden plinths/floor at y=.86. Vary display forms naturally: hanging clothes, standing hat, glasses stand, floor furniture, pet mat, flowerpot. NO square frames or boxed category cards. Leave a little clean space below each object for labels that will be rendered in code.
Puppy and checkout counter must stay in the left quarter (x<.27), not overlap the nine objects. Preserve the sunny store's warm inviting palette. Do not add any extra category objects, shelves full of clutter, people, cats, labels, numbers, prices, text, logos, watermarks or UI buttons. This is a complete painted shop environment with objects ready to receive invisible touch hotspots.
```

## Prompt final: expositor

```text
Use case: precise-object-edit.
Asset: an EMPTY product display background for a LANDSCAPE children's pet shop game, opaque wide 2400 x 1000 composition (2.4:1).
Reference image 1 is the old PetMaestro display cabinet. Keep its warm amber wood, turquoise accents, cozy sunlight, paw ornament and friendly illustrated cartoon rendering, but REPLACE the crowded six-cell cabinet with THREE low round wooden display plinths along ONE horizontal row. No grid, no cubbies and no vertical dividers. Large open uncluttered softly lit cream wall above the plinths, room to overlay three oversized product images in code.
Critical layout: the three plinths are centered at x=.22, .50 and .78 of the image. Each has width .23 of the image. The TOP horizontal standing surface of every plinth must be at y=.61 of image height, with its wooden front extending from y=.63 to .80. Keep the area from x=.10 to .90 and y=.04 to .60 empty for products. The front of each plinth must be plain warm wood with space for names rendered later. Keep lower floor area y=.81..1 clean for purchase buttons rendered in code.
Only modest decoration at the far edges: a slim turquoise window/curtain to the left, small plant at extreme right, tiny paw medallion high on the back wall. Symmetric front view, minimal perspective, identical baseline and lighting for all three stands.
Do NOT draw any merchandise, clothes, hats, glasses, animals, beds or objects on the three plinths. No words, numbers, prices, labels, signs, UI controls, square product cards, watermark or logo. This empty illustrated display will receive actual owned/purchasable game assets and touch controls at runtime.
```

