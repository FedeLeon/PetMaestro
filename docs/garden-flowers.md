# Flores del jardín

Nueva sección Flores en la tienda compartida: Margaritas (20 monedas), Tulipanes (30), Girasoles (40) y Rosas (50). La compra es permanente; cada tipo comprado aparece automáticamente en su posición del borde inferior del exterior, por encima del menú. No se mezclan con el inventario de animales o muebles.

Tocar una flor disponible inicia 3 segundos de riego: el gato aparece junto a ella, inclina la regadera y caen gotas. Al completar se guarda `flowerWateredAt[id]` y se suman 5 puntos a la barra de juego, hasta un máximo de 100. Cada planta permite otro riego después de 5 minutos, con cuenta regresiva independiente persistida en AsyncStorage. No hay gasto adicional al regar. Salir durante la animación la cancela sin actualizar el tiempo ni sumar puntos.

`gardenContent.ts` concentra el catálogo, los assets y el intervalo. `ProgressContext.waterFlower` valida propiedad, tipo e intervalo contra el estado actual. Las partidas anteriores reciben un registro vacío. Las compras compartidas ahora leen el estado actual para evitar cobros duplicados por pulsaciones rápidas.

Assets finales: `assets/generated/garden/{daisies,tulips,sunflowers,roses,watering-can}-v1.png`. Creados con imagegen integrado y alpha transparente. La regadera recibió una edición sin halo y limpieza del damero residual al preparar el PNG. Las gotas reutilizan `bath-water-drop-v1.png`; el gato reutiliza `PetCat` con sus accesorios.

## Prompts

Validación: typecheck y diff check; Chromium con toque simulado en 844×390 y 1280×720. Compra de los cuatro tipos con descuento exacto de monedas, aparición solo tras comprar, animación de riego, persistencia del tiempo tras recargar, bloqueo durante 5 minutos, disponibilidad al adelantar el reloj de prueba y cancelación al salir sin registrar riego. Capturas inspeccionadas. Se reservó el espacio del menú inferior y se ajustaron las posiciones de casa, granero, animales y gato al alto visible del exterior. Dispositivo físico pendiente.

### daisies-v1.png

Game sprite: a small garden clump of five white daisies with golden yellow centers, lush green leaves. Cozy polished hand-painted cartoon children's kitten care game style, rounded shapes, warm golden highlights, crisp silhouette. Short compact flowering plant seen from front at slightly elevated angle, roots hidden by a tiny oval mound of rich earth at bottom, no pot, no background landscape. Actual transparent PNG alpha background, no checkerboard, no text, no outer glow. Entire object visible, centered with small padding.

### tulips-v1.png

Game sprite: a small garden clump of four pink and coral tulips, lush broad green leaves. Cozy polished hand-painted cartoon children's kitten care game style, rounded shapes, warm golden highlights, crisp silhouette. Short compact flowering plant seen from front at slightly elevated angle, roots hidden by a tiny oval mound of rich earth at bottom, no pot, no background landscape. Actual transparent PNG alpha background, no checkerboard, no text, no outer glow. Entire object visible, centered with small padding.

### sunflowers-v1.png

Game sprite: a small garden clump of three golden yellow sunflowers with brown centers, lush green leaves. Cozy polished hand-painted cartoon children's kitten care game style, rounded shapes, warm golden highlights, crisp silhouette. Short compact flowering plant seen from front at slightly elevated angle, roots hidden by a tiny oval mound of rich earth at bottom, no pot, no background landscape. Actual transparent PNG alpha background, no checkerboard, no text, no outer glow. Entire object visible, centered with small padding.

### roses-v1.png

Game sprite: a small garden clump of four red and pink roses, lush green leaves. Cozy polished hand-painted cartoon children's kitten care game style, rounded shapes, warm golden highlights, crisp silhouette. Short compact flowering plant seen from front at slightly elevated angle, roots hidden by a tiny oval mound of rich earth at bottom, no pot, no background landscape. Actual transparent PNG alpha background, no checkerboard, no text, no outer glow. Entire object visible, centered with small padding.

### watering-can-v1.png

Game sprite: a cute turquoise watering can with golden paw emblem, curved handle on RIGHT, long spout pointing LEFT and slightly downward, no water. Cozy polished hand-painted cartoon children's kitten care game style, rounded shapes, warm golden highlights, crisp silhouette. Single isolated tool. Actual transparent PNG alpha background, no checkerboard, no text, no outer glow. Entire object visible, centered with small padding.

Edición de regadera: Remove ALL the outer glow and haze around this watering can, keep the can unchanged. Clean cutout with actual transparent alpha pixels outside its silhouette and inside the handle opening. Opaque can. No checkerboard illustration, no halo or shadow.

También verificado: compra bloqueada por monedas insuficientes, doble pulsación con un solo cobro, acceso a una flor del extremo mediante desplazamiento y regreso al interior por la puerta exterior.

## Flores con sed y tamaño durante el riego

Las cuatro variantes `*-thirsty-v1.png` muestran flores y hojas caídas. `flowerWait` determina el aspecto: sin riego previo o al vencer los cinco minutos se muestra la variante con sed; únicamente un riego completado vuelve a mostrar la planta sana. El estado se reconstruye a partir de los tiempos persistidos, incluso al recargar. Ambas variantes se precargan al inicio y se mantienen montadas con `SpriteFrames` para evitar parpadeos al cambiar.

El gato de riego usa `size="room"` y escala `height / 600`, igual que el gato del exterior. Regadera y gotas comparten la transformación del personaje. Las patas se apoyan junto a la base de las flores.

Assets creados y corregidos con la herramienta integrada de imágenes: mismas especies y estética que las plantas sanas, tallos arqueados, flores y hojas caídas, base de tierra y fondo transparente real. Verificados canales alfa de los cuatro PNG y composición sobre el jardín.

Validación web en 1280×720 y 844×390: planta con sed, riego completo, recuperación y +5 de juego, persistencia al recargar y vuelta al estado caído después de cinco minutos simulados. Capturas antes, durante y después del riego. TypeScript y diff sin errores.
