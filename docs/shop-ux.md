# Tienda para explorar

La entrada usa un fondo ilustrado con nueve objetos reconocibles y zonas táctiles de al menos 44 puntos. Las categorías se abren tocando el sombrero, anteojos, remera, falda, zapatos, juguetes, sillón, conejo o flores. Las etiquetas nombran las categorías sin cubrirlas con tarjetas.

Cada categoría muestra hasta tres productos por página sobre pedestales. Hay 63 productos, incluido el nuevo sombrero marrón con flor. `shopDisplayBounds.ts` registra la silueta visible de cada PNG; `ShopProductImage` elimina el margen transparente al presentar el producto sin deformarlo. Esto permite que todos apoyen sobre el expositor.

Las flechas laterales recorren páginas y se deshabilitan en los extremos. El botón superior con flecha y texto «Tienda», junto con el botón físico Atrás en Android, vuelve al local. Los productos comprados muestran «¡Tuyo!» y permiten vestir al gato, jugar, colocar muebles, llevar animales al corral o cuidar flores. Repetir una acción de colocación no retira el objeto.

El arte de los productos se redujo un 12% conservando la línea de apoyo y los controles de compra. Las flechas usan un nuevo asset de madera y turquesa, con zonas táctiles de 72–92 puntos en los extremos de la escena. Las flechas disponibles respiran suavemente; las deshabilitadas quedan atenuadas y quietas. La animación se detiene con movimiento reducido, al salir y en segundo plano. [Prompt y detalles](art/shop-page-arrow.md).

Los fondos se ajustan conservando su proporción, exclusivamente en horizontal. No hay diseño vertical. Los originales siguen disponibles; procedencia y prompts en `art/shop-imagegen.md`.

## Verificación

`npm run test:shop` requiere el servidor local y Chromium de Playwright. Recorre todas las páginas de las nueve categorías en 844×390 y 1280×720, comprueba las zonas táctiles, compra los 63 productos, verifica los accesos de uso y la persistencia tras recargar. Guarda capturas y un informe en `/tmp/petmaestro-shop`.

También comprueba que las flechas grandes no se superpongan con los productos, que las disponibles se animen, que las deshabilitadas estén quietas y que la preferencia de movimiento reducido detenga la respiración.

Esta prueba usa el modo temporal de monedas infinitas solicitado para testear y verifica que conserva el saldo real guardado. No cambia el flag de desarrollo. Las comprobaciones de navegador no sustituyen una sesión en Android físico ni una prueba con niños.
