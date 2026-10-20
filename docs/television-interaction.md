# Televisión del salón

El mueble TV comprado y colocado se puede tocar directamente en la casa.
El gato camina hasta el televisor, se sienta de espaldas con un control y mira
tres canales infantiles (conejito, cohete y música) durante 8,2 segundos.
Los canales cambian cada 2,6 segundos; tocar la tele también cambia el canal.
Cada cambio usa el efecto `tap`, respetando las preferencias de sonido.

Tocar el suelo interrumpe la actividad y permite caminar. Guardar el mueble,
cambiar de habitación o pantalla y pasar la aplicación a segundo plano cancelan
la caminata, la llegada pendiente y los temporizadores. La actividad no modifica
monedas ni equipamiento: durante la pose de espaldas se muestra un sprite propio;
al terminar se vuelve al rig vestido en la misma posición.

El reloj compartido anima suavemente al gato y a los canales. Con movimiento
reducido se conservan las imágenes y cambios de canal sin balanceo continuo.
Todo se ubica en el mundo horizontal de 2400 × 600 de la casa.

Asset: `assets/generated/cat/cat-watch-tv-v1.png`. Prompt y herramienta:
`docs/art/television-cat-prompt.json`. Los programas de TV se dibujan en SVG
dentro de la pantalla existente, sin reemplazar el mueble.

Validación: `npm run typecheck`, `npm run test:content` y
`npm run test:television` (navegador en 1280 × 720 y 844 × 390).
Las pruebas del navegador no validan un dispositivo Android físico.
