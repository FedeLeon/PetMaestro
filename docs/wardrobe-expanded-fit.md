# Vestuario ampliado y ajuste anatómico

> El ajuste de esta ampliación fue sustituido por la
> [revisión anatómica del 19 de octubre](wardrobe-anatomical-refit.md): las
> remeras y prendas inferiores ahora se adaptan por partes, los anteojos se
> centran por lente y el calzado sigue tobillos y suelas. Los detalles de
> colocación y las validaciones que siguen documentan la etapa anterior.

La colección contiene 12 sombreros, 12 anteojos, 12 remeras, 12 prendas inferiores y 12 pares de calzado: 60 prendas, más los seis juguetes existentes. Se agregaron seis anteojos, cuatro remeras, tres polleras, tres shorts y seis pares de zapatos. Los IDs anteriores, las compras y las prendas equipadas siguen siendo compatibles con las partidas existentes.

Los 22 PNG nuevos están registrados en `additionalWardrobeAssets.ts`; sus metadatos de producto, en `additionalWardrobeItems.ts`. Todos se precargan por el registro común. Las rutas finales y prompts exactos se encuentran en [el manifiesto de generación](art/expanded-wardrobe-fridge-prompts.json). Se utilizó imagegen integrado; no se modificaron los píxeles con herramientas externas.

## Ajustes

- Mangas: las máscaras de los brazos abarcan todo el puño y dejan el cuello con el torso. Así, el final de una manga no queda estático mientras el brazo se mueve.
- Cintura: polleras y pantalones parten de la cintura real del gato. Los pantalones son más estrechos y cortos; los shorts se articulan con las piernas en lugar de tratarse como polleras.
- Mano: los juguetes se sitúan hacia la palma, por delante de la mano. Sólo una pequeña zona de agarre se dibuja por encima, en lugar de tapar el objeto con la pata completa.
- Zapatos: cada pie se centra en x=60 y x=114 sobre el gato de 174×260; las suelas comparten y=254. Se conservan las proporciones del dibujo y se alinea por abajo, compensando también los márgenes transparentes diferentes de cada lado.
- Pares nuevos: una imagen contiene los dos zapatos. Sus mitades se miden por separado y se recortan con SVG al dibujar cada pie. No se crean recortes raster adicionales ni se duplica el par sobre cada pie.

La geometría y los estilos permanecen en `catRig.layout.ts` y `catWardrobe.layout.ts`. Se usa el mismo rig en el vestidor y en las habitaciones, incluyendo caminar en ambos sentidos y acariciar animales. Toda la experiencia continúa en horizontal y conserva las tarjetas de dos objetos por fila.

## Verificación

`npm run test:wardrobe-fit` comprueba las cinco categorías de 12, el centro y la suela de los 12 pares sobre el SVG real, sus proporciones y el conjunto de la captura del usuario en 1280×720 y 844×390. Capturas: `/tmp/petmaestro-wardrobe-fit`.

`npm run test:wardrobe` recorre las 66 piezas, ocho conjuntos, persistencia, caminar y cancelación al navegar. Se revisan las capturas de prendas individuales, conjuntos, mangas, prendas inferiores y calzado. `npm run test:shop` recorre la compra, paginación y uso del catálogo ampliado. La exportación Android valida el empaquetado; no sustituye una prueba física de gestos y fluidez.

Resultado final: `test:wardrobe-fit`, `test:wardrobe`, `test:fridge`, `test:shop`, `test:kitchen` y `test:petting` completados correctamente. Se validaron las 66 piezas y ocho conjuntos, los 85 productos de tienda, ambas páginas de heladera, cocina y alimentación con los seis alimentos nuevos, caminar en ambos sentidos y acariciar a los seis animales. Tipos, auditoría de 318 referencias de assets y exportación web/Android también correctos. Se revisó el conjunto de la captura del usuario y prendas individuales sobre el gato. Capturas e informes en `/tmp/petmaestro-wardrobe-fit`, `/tmp/petmaestro-wardrobe/after`, `/tmp/petmaestro-expanded-fridge`, `/tmp/petmaestro-shop` y `/tmp/petmaestro-petting`.
