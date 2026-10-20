# Caricias y vestidor

En el exterior, tocar un animal hace que el gato camine hasta su lado, mire hacia él y lo acaricie durante 3,6 segundos. La vaca recibe mimos en la frente; el caballo en la crin; la oveja en la lana; el cerdito junto a la oreja; el pato en la cabeza; y el conejo entre las orejas. Cada especie tiene ritmo, altura y reacción propios. Los animales se quedan quietos durante el acercamiento y reciben el mimo con ojos relajados, movimientos suaves y corazones.

El gato mantiene la ropa equipada. La misma articulación mueve la patita y la manga. Se elige el lado con mejor alcance cerca de los bordes y se calcula el contacto con el rig real, sin duplicar ni teletransportar al gato. La cámara acompaña al animal elegido.

Tocar otro animal cambia el destino; tocar el suelo permite volver a caminar. Regar, retirar el animal del inventario, cambiar el tamaño horizontal, salir del exterior o poner la app en segundo plano cancela el acercamiento y los temporizadores pendientes. La caricia es una interacción visual: no entrega monedas ni modifica los objetos comprados. Con movimiento reducido se conserva una pose de contacto sin gestos repetidos.

`animalPetting.ts` contiene los perfiles y el cálculo de la patita; `useAnimalPetting.ts` coordina acercamiento, llegada, interrupciones y finalización. `WalkingPetCat` acepta un aviso de llegada y una cancelación para evitar animaciones que empiezan después de cambiar de destino. Se reutilizan los PNG y rigs existentes, sin modificar las ilustraciones.

El vestidor de **Mi gatito** muestra dos objetos por fila en tarjetas cuadradas dentro de cada categoría. Las imágenes se ajustan al espacio disponible y los nombres ocupan hasta dos líneas. La selección conserva el borde resaltado y el guardado habitual.

## Pruebas

- `npm run test:animal-motion`: perfiles de movimiento y caricias, límites y casos de borde.
- `npm run test:petting`: revisa las 43 tarjetas del vestidor y el equipamiento; prueba los seis animales en 1280×720 y 844×390; mide la distancia real entre patita y cabeza mediante las matrices SVG del navegador; verifica cambio de animal, finalización, retirada, riego, movimiento reducido, salida de pantalla y caminar al tocar el suelo. Capturas e informe: `/tmp/petmaestro-petting`.
- `npm run test:animals`: comprueba también las animaciones ambientales anteriores.

La exportación Android no sustituye una prueba en un dispositivo físico.
