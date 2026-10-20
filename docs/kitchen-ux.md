# Cocina para niños

La heladera ofrece 18 alimentos en tres páginas de seis. La tercera página agrega tomate, fideos, espinaca, zapallito, champiñones y lentejas, con ilustraciones propias. Las flechas están dentro de la vista; cambiar de página mantiene la selección y el límite global de tres ingredientes. Se pueden mezclar ingredientes de las tres páginas. Los alimentos comprados se conservan en las partidas existentes y se reutilizan al cocinar, servir y alimentar.

`npm run test:fridge` valida las tres páginas y sus controles en 844×390 y 1280×720, selección conservada, bloqueo del cuarto ingrediente antes de comprarlo, preparación y consumo de los doce alimentos de las páginas dos y tres, nutrición, premios y persistencia. Assets anteriores: [manifiesto](art/expanded-wardrobe-fridge-prompts.json). Tercera página: [prompts](art/fridge-third-page-prompts.json).

La cocina mantiene los ingredientes, ilustraciones, comida recuperada y recompensas de misión existentes. Las instrucciones se organizan en cuatro pasos visuales: elegir, cocinar, enfriar y comer. Toda la experiencia sigue siendo horizontal.

- Las acciones y los ingredientes están dentro de la ilustración: se toca la olla, la cuchara o el plato para avanzar. No hay panel derecho. Una instrucción breve y una barra de progreso indican el paso actual; el encabezado compacto deja más espacio a la actividad.
- Al revolver, el bloque ancho se reemplaza por un panel compacto justo encima de la olla, con marco de madera dorada, turquesa y huellitas. Su barra tiene borde dorado y relleno turquesa con brillo, y representa únicamente la mezcla de 0 a 100%. Avanza al tocar la cuchara o arrastrarla y se retira al pasar a enfriar. El botón para volver permanece disponible. Asset y prompt: `assets/generated/ui/cooking-stir-panel-v1.png` y `docs/art/cooking-stir-panel-prompt.json`.
- La heladera marca la selección y muestra tres lugares para los alimentos. Al llegar al límite, elegir un cuarto alimento no lo compra ni lo cobra. Las compras se bloquean mientras se confirma una selección para evitar carreras entre toques.
- Se puede tocar un ingrediente para agregarlo o arrastrarlo. La olla tiene un contorno visible y acepta una zona de caída más amplia. Soltar afuera conserva el alimento. Un ingrediente aceptado se confirma antes de su animación para que el siguiente toque no pueda cancelarlo.
- En la vista de la olla, los alimentos elegidos aparecen grandes debajo de ella, sin recuadros ni etiquetas. El tamaño del asset se mantiene al agarrarlo; al incorporarlo desaparece de la fila y se ve dentro de la olla. Las posiciones vacías se conservan para que los demás ingredientes no cambien de lugar durante el arrastre. Revisado con arrastres reales en 1280×720 y 844×390 y con el recorrido completo de cocina y alimentación.
- Revolver acepta el gesto original, con menos recorrido necesario, o cinco toques sobre la cuchara que la animan. Ambos métodos comparten el progreso.
- Enfriar muestra tres indicadores y un soplido animado por toque. No requiere micrófono. Durante la animación no se puede contar otro soplido.
- Para alimentar se puede arrastrar la cuchara, tocar el plato o tocar la cuchara. Una flecha indica el recorrido. Cada alimento elegido corresponde a una cucharada: al levantarlo desaparece del plato y los demás conservan su posición y tamaño. Si se suelta la cuchara fuera de la boca, el alimento vuelve al plato. Se mantienen la masticación y los corazones; el contador se ajusta a uno, dos o tres alimentos. La comida y su misión se confirman una sola vez, después de masticar el último alimento. `npm run test:feeding-ingredients` verifica estas combinaciones en ambas resoluciones horizontales, incluyendo las tres formas de alimentar y la devolución al cancelar el arrastre.
- Salir de la pantalla de la casa cancela la actividad y sus animaciones; una cucharada pendiente no alimenta al gato estando en otra pantalla. La preparación en curso sigue siendo temporal y no se guarda como receta incompleta.

## Monedas de prueba y exterior

`DEV_INFINITE_COINS = true` activa el modo temporal solicitado. El encabezado muestra 99.999 monedas constantes; se pueden comprar alimentos y objetos sin descontar ni reemplazar el saldo real de la partida. Los desbloqueos comprados sí se guardan. Cambiar la constante a `false` restaura la economía normal.

El granero decorativo está integrado en el fondo `exterior-yard-barn-v2.png`, detrás de la cerca del corral derecho. Ya no tiene una capa independiente en la escena. El asset original `shop/farm-barn.png` se conserva para la tienda y posibles usos posteriores; también se conserva el panorama original. El desplazamiento horizontal inicial deja visibles la casa y el granero. Al cambiar el tamaño horizontal se recalcula también la posición inicial del gato para evitar que quede fuera de la escena.

## Pruebas

`npm run test:kitchen` usa una partida temporal con 7 monedas reales y requiere el modo infinito activado. Recorre selección, límite de tres alimentos sin compra del cuarto, reemplazo, toque, caída fuera y dentro de la olla, siguiente toque inmediato, revolver por botón, tres soplidos, alimentación por los tres métodos y salida durante la última cucharada. Comprueba una sola recompensa, hambre, compras sin descuento, persistencia y encuadre del granero en 844×390 y 1280×720.

`INFINITE_COINS=1 npm run test:care` permite correr la suite de cuidado con este modo; mantiene el recorrido de revolver mediante arrastre. Las otras suites que esperan descuentos de monedas deben ejecutarse con `DEV_INFINITE_COINS = false`.

Las capturas de cocina se guardan en `/tmp/petmaestro-kitchen`, configurable mediante `REVIEW_OUTPUT`. Se revisa la apariencia en navegador; la exportación Android no sustituye una prueba de gestos y fluidez en dispositivo físico ni una sesión de usabilidad con niños.
