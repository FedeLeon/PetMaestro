# Descarga y lavado de patitas

Assets generados con la herramienta integrada `image_gen`. PNG con transparencia real, guardados en `assets/generated/house/`.

## Patita

Archivo: `assets/generated/house/toilet-washing-paw-v1.png`.

Prompt final:

Single isolated sprite for PetMaestro children's cat game: one adorable orange kitten front paw with a short fluffy orange forearm, cream colored rounded toes, soft pink paw pads facing the viewer. Forearm enters from top center, paw hangs down, relaxed open palm ready for washing. Match a cute polished 3D cartoon orange tabby kitten, warm fur and gentle proportions. No claws, no dirt, no soap, no water. Centered, fills most square frame. Transparent background PNG alpha cutout. Only one paw and short forearm, no body, no curtain, no text, no ground shadow.

## Cadena

Archivo: `assets/generated/house/toilet-flush-chain-v1.png`.

Prompt final:

Single isolated animation sprite for PetMaestro bathroom: hanging toilet flush pull chain with polished golden oval links and a chunky turquoise teardrop pull handle at the bottom, embossed little golden paw emblem. Friendly rounded 3D cartoon style. Straight vertical chain, handle center bottom. Entire object visible centered on square canvas with empty transparent space on both sides. Transparent background PNG alpha cutout, no wall, no toilet, no text, no hand, no shadow. It will be animated being pulled downward.

## Remolino

Archivo: `assets/generated/house/toilet-flush-water-v1.png`.

Prompt final:

Single isolated animation sprite for a children's bathroom game: circular turquoise water whirlpool seen directly from above, a clear spiral of bright aqua water and curved white foam streaks curling toward a small deep blue center, polished friendly 3D cartoon style. Perfectly circular silhouette, centered filling 90 percent of square frame. Transparent background PNG alpha cutout. Only clean swirling water, no toilet rim, no objects, no waste, no text, no outside glow or shadow. This sprite will rotate and shrink to animate flushing.

## Interacción

La cadena se puede accionar tocando el tirador de la escena o el botón «Tirar de la cadena». El tirador baja y vuelve a su posición mientras el remolino gira y se reduce.

Después de la descarga aparecen dos patitas sobre el borde de la cortina. Al elegir «Lavar patitas», se activa la ducha de mano ya existente. Hay que moverla por las dos almohadillas: cada una necesita seis pasos de enjuague. Mantener el dedo quieto, esperar o moverlo fuera de las patitas no completa el lavado. La espuma desaparece gradualmente y cada patita limpia muestra una marca de confirmación.

La cortina permanece cerrada hasta terminar ambas patitas. Solo entonces se guardan baño +70 e higiene +10, una vez por sesión. Salir antes cancela la actividad sin otorgar mejoras. Las animaciones y temporizadores se detienen al desmontar.


## Validación

- TypeScript y `git diff --check`: correctos.
- Bundle Android exportado correctamente.
- Recorrido completo en Chrome a 1280 × 720 y gestos táctiles simulados a 844 × 390: cadena accionable, descarga, lavado de ambas patitas y guardado final correctos.
- Comprobado que esperar 3,4 segundos no lava las patitas, que los movimientos fuera de ellas no suman progreso y que limpiar solamente una mantiene cerrada la cortina sin otorgar mejoras.
- Verificados cancelación, recompensa única, persistencia y regresión del cepillado y las tres fases de ducha.
- Capturas revisadas de descarga, patitas sobre la cortina y ducha en uso. Falta validación en un dispositivo Android físico.
