# Carrera del cascabel y premios por actividades

La pelota cascabel abre una carrera horizontal por un parque ilustrado. El gato
avanza automáticamente durante unos 18 segundos activos, con cuatro obstáculos
espaciados y saltos de 0,9 segundos al tocar cualquier punto del campo de juego.
Un tronco, una roca, un arbusto y otro tronco llegan desde la derecha. Cada uno
trae una moneda visible encima que se mueve a su misma velocidad. El gato debe
alcanzarla durante el salto para cobrarla: saltar antes o dejarla pasar no da
monedas. Cada moneda se cobra una sola vez, hasta cuatro por carrera. No se
acumulan saltos ni monedas con toques repetidos en el aire. Los tropiezos tienen una reacción
breve y no quitan monedas ni reinician la partida. El cascabel se acerca al final.
El último salto puede terminar antes de cerrar la carrera.

La carrera usa un atlas transparente de ocho poses a 14 cuadros por segundo,
alternando patitas y brazos en un ciclo completo. El salto conserva su pose
propia. Los tres obstáculos son PNG ilustrados originales; sus medidas respetan
la proporción y los límites de transparencia para apoyarlos en el suelo.
Assets y prompts: `docs/art/bell-runner-upgrade-prompts.json` (imagegen integrado).

Al chocar, el gatito cambia durante los 0,5 segundos del tropiezo a un atlas de
ocho poses con boca triste y cejas levantadas (`cat-run-sad-v1.png`). Conserva
el movimiento de las patas y se muestra con opacidad completa para que la
expresión sea visible; al recuperarse vuelve a la cara alegre. Ambos atlas
permanecen montados para tener el sprite triste listo antes del primer choque.
Prompt y referencia: `docs/art/bell-sad-cat-prompt.json` (imagegen integrado).

La física vive en `src/data/bellRunner.ts`; la geometría y estilos están en
`src/styles/components/bellRunner.styles.ts`. El reloj se detiene al salir o al
ocultar la aplicación. Al volver requiere Continuar. Las monedas ya atrapadas
se conservan, pero no se cobra finalización por abandonar la partida. Al terminar
se suman cinco monedas adicionales; el resultado muestra el total de la ronda.

## Premios

Los importes se centralizan en `src/data/actionRewards.ts`. Se suman al saldo
real mediante `ProgressContext`, conservando la cola de escritura y las partidas
anteriores. El modo infinito sigue mostrando 99.999 y las compras no descuentan;
los premios nuevos sí incrementan el saldo guardado. Las actividades muestran
un aviso con moneda y cantidad; la carrera tiene contador propio y sonido.

| Actividad completada | Monedas |
| --- | ---: |
| Preparar y servir una comida | 3 |
| Terminar de alimentar al gato | 5 |
| Completar baño, dientes o inodoro con patitas limpias | 5 cada una |
| Dormir en el dormitorio | 5 |
| Regar una planta que necesita agua | 3 |
| Terminar de acariciar un animal | 2 |
| Completar la siesta en la camita suave | 3 |
| Terminar la sesión de televisión | 2 |
| Hacer un dibujo, primer trazo de la vista | 2 |
| Terminar un cuento, una vez en esa vista | 3 |
| Completar las cinco preguntas de un cuento | 5 + aciertos (hasta 10) |
| Moneda atrapada al saltar en la carrera del cascabel | 1 |
| Terminar un minijuego de juguete, también al repetirlo | 5 |
| Ayudar en la ciudad, primera visita / repetición | 15 / 5 |

Aprendizaje, repasos y misiones conservan sus premios existentes. No se paga por
navegar, cambiar opciones, comprar ni tocar herramientas sin completar la tarea.
La espera existente entre riegos evita pagar dos veces por la misma planta. Las
guardas de cada actividad impiden repetir el premio de su misma finalización.
Salir durante una animación no cobra la tarea pendiente. Cocinar y alimentar
son actividades distintas: servir cobra cocina aunque después no se termine
de alimentar al gato.

## Comprobaciones

`npm run test:bell` comprueba colisiones y saltos con tres frecuencias de cuadro,
las ocho poses, tres tipos de obstáculo, monedas que avanzan junto con ellos,
recogida solo al alcanzarlas en el aire, ausencia de premios por saltar lejos,
prevención de cobros duplicados, último salto, pausa y navegación real en dos
tamaños horizontales.
`npm run test:care-scene` comprueba higiene, baño, cocina y comida con sus premios.
`npm run test:petting` comprueba las caricias completas y canceladas; los tests de
televisión y muebles comprueban las sesiones completas y las salidas anticipadas.

Arte y prompts: `docs/art/bell-runner-prompts.json`.

Revisión del 19/10/2026: pasaron typecheck, la auditoría de 332 referencias,
física de la carrera a 20/30/60 fps, carrera y cuidado en 1280×720 y 844×390,
caricias de los seis animales, camita y televisión en ambos tamaños, y los
recorridos de cuidado completo y aventuras. Estos últimos verifican sueño,
riego, seis juguetes, misión y encargos repetidos con saldo guardado real.
La comprobación del navegador no reemplaza una prueba en teléfono físico.
