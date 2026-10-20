# Granero integrado en el exterior

Modo: herramienta integrada ImageGen, edición con dos imágenes locales. No se usó API ni CLI.

Destino: `assets/generated/house/exterior-yard-barn-v2.png`.

Entradas conservadas sin cambios:
- `assets/generated/house/exterior-yard-wide.png`: fondo original y referencia de composición.
- `assets/generated/shop/farm-barn.png`: referencia del granero, conservada también como recurso de categoría de tienda.

El granero forma parte de los píxeles del fondo y queda detrás de la cerca del corral derecho. La casa, el gato, los animales y las flores interactivas siguen siendo elementos de la escena. Se eliminó únicamente la capa decorativa independiente del granero.

Prompt final:

```text
Use case: compositing.
Asset type: opaque panoramic background for a landscape-only children's game, PetMaestro.
Input images: Image 1 is the edit target, the existing exterior-yard-wide background. Image 2 is a supporting insert reference, the red farm barn.
Primary request: Integrate ONE red barn into the RIGHT-HAND corral area of Image 1 as a naturally painted part of the background scenery, behind the wooden corral fence, with correct depth and perspective. Match the barn design in Image 2: red wood, white roof trim, white X-braced doors, hay window. Its lower walls and base must be occluded by the foreground corral fence rails/posts wherever they overlap. The fence must read clearly as being in FRONT of the barn. Place the barn around 87% of the image width, roughly between 77% and 98% horizontally, roof around 20% of the image height, base around 63%. Match the scene's lighting, outlines, saturated friendly cartoon style and soft ground shadow. Preserve the right corral's existing fence/gate shape and layout.
Strict invariants: retain the original very wide landscape framing and aspect ratio (1823 by 863 reference), preserve the entire left corral, open CENTER grass area, foreground path and flowers, sun, trees, blue sky and hills as closely as possible. The center must stay EMPTY to overlay the interactive house and cat at runtime. Do not add a house, cat, animals, people, UI, text, logos or watermarks. Do not move the existing fences or crop away their edges. This must be one coherent complete opaque background image, no isolated barn and no transparency. Change only the barn integration and its local light/shadow/occlusion; do not redesign the scene.
```
