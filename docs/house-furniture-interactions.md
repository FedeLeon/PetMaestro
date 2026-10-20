# Camita suave y lámparas del salón

Los muebles comprados y colocados se pueden tocar directamente en el panorama
horizontal. La camita suave llama al gato, que camina hasta ella, se acuesta
sobre el almohadón y descansa siete segundos. Su respiración y las letras de
sueño se animan suavemente. Otro toque en la cama lo despierta; tocar el suelo
permite volver a caminar. Se reutiliza el asset existente
`assets/generated/house/cat-sleeping-v1.png`, con el borde frontal de la cama
dibujado encima para que el gatito quede dentro.

El descanso del salón es una animación breve y no modifica monedas, necesidades
ni prendas equipadas. La ropa vuelve a mostrarse al recuperar el rig de pie.
Mirar televisión y descansar se interrumpen mutuamente. Quitar la camita, salir
del salón, cambiar de pantalla o pasar a segundo plano cancelan la llegada
pendiente y el temporizador; no puede aparecer un gato dormido tardíamente.

La lámpara de pez y la lámpara de pie se encienden y apagan independientemente,
con un halo cálido y una transición de 260 ms. La pantalla se oscurece levemente
al apagarla. Cada toque reproduce el sonido existente `tap`, respetando los
ajustes de audio. Las luces no interrumpen al gato. El estado de encendido es
local a la vista y se reinicia al guardar el mueble o abandonar el salón.

Las zonas táctiles tienen al menos 48 × 48 puntos, siguen la posición de la
lámpara de pez al colocar o quitar la mesita, y se centran en la pantalla de la
lámpara de pie para evitar que el pie capture los toques sobre la camita.
Con movimiento reducido se desactivan la respiración y el movimiento de las
letras, y la luz cambia sin transición.

Validación: `npm run typecheck`, `npm run test:content`,
`npm run test:house-furniture` y `npm run test:television`.
Las pruebas de navegador cubren 1280 × 720 y 844 × 390 en horizontal;
no equivalen a una prueba en un dispositivo Android físico.
