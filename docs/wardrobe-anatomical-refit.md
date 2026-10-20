# Ajuste del vestuario al cuerpo · 19 de octubre de 2026

Se revisaron las 48 prendas que no son gorros: doce remeras, doce prendas
inferiores, doce anteojos y doce pares de calzado. Los doce gorros conservan
sus ilustraciones y sus posiciones. Se mantienen todos los IDs, miniaturas,
precios, compras y prendas equipadas de las partidas existentes.

## Problemas encontrados y corrección

El ajuste anterior normalizaba los márgenes transparentes, pero después
estiraba una prenda completa dentro de un rectángulo. Eso dejaba cinturas
angostas, entrepiernas bajas y mangas cuya silueta no seguía el brazo.
El rectángulo general tampoco identifica dónde están los ojos detrás de
un anteojo con orejitas, ni la diferencia entre tobillo y punta del pie.

Ahora se adapta el dibujo original al cuerpo por partes:

- **Remeras:** cuello, pecho, cintura y dos mangas tienen puntos de ajuste
  separados. Se conserva el dibujo de la tela con triángulos SVG; cada manga
  comparte el movimiento de su brazo. Una abertura en el cuello permite ver
  el pelaje dentro del collar en lugar de una abertura oscura pintada encima.
- **Polleras:** la cintura abraza las caderas; el vuelo y el ruedo se ajustan
  por separado. Ya no se obtiene una cintura diminuta al escalar todo el asset.
- **Pantalones y shorts:** se miden el contorno y la entrepierna de cada PNG.
  La cintura queda alrededor de y=174 y la separación real de las piernas
  alrededor de y=194. Cada pierna se articula por separado; una pequeña
  superposición en la cadera cierra la unión durante la caminata.
- **Anteojos:** se identifica el centro de cada lente en los doce diseños.
  Se ubican en los ojos (66,69.5 y 107,69.5), sin usar las orejitas ni los
  adornos para centrar el marco. Se conserva la proporción original del dibujo.
- **Calzado:** la abertura sigue los tobillos inclinados hacia adentro
  (x=65 y x=109), mientras las puntas permanecen en x=60 y x=114 y las suelas
  en y=254. Botas, zapatillas, zapatos y pantuflas tienen alturas diferentes.
  El pie desnudo se oculta bajo el calzado para que no asome por los costados.

Las coordenadas pertenecen al gato original de 174×260 y se escalan junto con
él en el vestidor y en las habitaciones. El mismo ajuste acompaña la caminata
y las caricias. Toda la presentación sigue siendo horizontal.

## Archivos y conservación del arte

`TailoredGarment.tsx` dibuja las partes de la prenda; la geometría y las
transformaciones están en `catGarmentMesh.layout.ts`. `wardrobeContours.ts`
contiene las mediciones individuales de los 24 PNG de remeras y prendas
inferiores, generadas por `python3 scripts/measure-wardrobe-contours.py`.
El script utiliza Pillow solamente para leer el alfa: no edita imágenes.
Los anclajes de anteojos y calzado están en `catWardrobe.layout.ts`.

No se regeneraron ni sobrescribieron los PNG: se corrigió la causa en el
renderizado. Las miniaturas de tienda conservan el arte original y el gato
usa ese mismo dibujo adaptado a su anatomía. Se retiraron las medidas
rectangulares y máscaras de prendas que el rig ya no utiliza.

## Verificación

- `npm run test:wardrobe-geometry`: 24 prendas, continuidad de las
  transformaciones, ausencia de triángulos invertidos, 186 muestras de alfa
  opaco en hombros, mangas, torso, caderas y piernas, y hueco de entrepierna.
  Esta comprobación requiere Python 3 y Pillow para leer los originales.
- `npm run test:wardrobe-fit`: doce modelos de anteojos sobre ambos ojos,
  doce pares de zapatos sobre tobillos y suelas, 24 prendas ajustadas y mangas
  en su articulación, en 1280×720 y 844×390.
- `npm run test:wardrobe`: 66 piezas individuales, ocho conjuntos, persistencia,
  caminata en ambos sentidos y cancelación al navegar.
- `npm run test:petting`: contacto con los seis animales y movimiento del brazo
  vestido, en los dos tamaños horizontales.
- Tipos y auditoría de contenido: `npm run typecheck`, `npm run test:content`.

Capturas de esta revisión: `/tmp/petmaestro-refit/before`,
`/tmp/petmaestro-refit/all`, `/tmp/petmaestro-wardrobe-fit` y las cuatro hojas
de contacto `/tmp/petmaestro-refit/{shirts,bottoms,glasses,shoes}-contact.png`.
Se inspeccionaron las 48 prendas y los conjuntos; las aserciones geométricas
no sustituyen esa revisión visual. Las pruebas web y la exportación no
equivalen a validar apariencia o fluidez en un dispositivo Android físico.

Resultado: las cinco comprobaciones anteriores, tipos y auditoría pasaron.
La exportación Android también completó correctamente en
`/tmp/petmaestro-refit-android-export`; no se generó un APK.
