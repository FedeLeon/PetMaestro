# Cuidado directo en la escena

Las actividades de comida, ducha, dientes e inodoro comparten una vista horizontal sin panel derecho. La ilustración conserva sus proporciones y sus coordenadas de interacción. Una instrucción breve, una barra de progreso y una flecha para volver acompañan la actividad. Las herramientas se ubican dentro de la escena, con zonas táctiles de al menos 44 puntos; los estilos y el cálculo del encuadre están separados de la lógica de cada juego.

- **Comida:** el plato de la cocina abre la selección de alimentos. Elegir, agregar ingredientes, cocinar, revolver, soplar y servir se hace en la escena. Los ingredientes aceptan toque o arrastre; la cuchara permite revolver por gesto o por toque. Para alimentar se toca el plato o la cuchara, o se arrastra la cuchara hacia la boca. Cada alimento elegido ocupa una cucharada y se retira individualmente del plato; los restantes conservan su posición. Se mantienen la masticación, los corazones y una única recompensa al terminar todos.
- **Ducha:** el jabón está preparado desde el inicio. Tocar las manchas o frotar al gato completa cada etapa; el agua y la toalla quedan listas automáticamente. Las manchas, la espuma y las gotas muestran qué zonas faltan.
- **Dientes:** tocar la pasta o el cepillo prepara el cepillo en una sola acción. Se puede frotar o tocar repetidamente las manchas. La zona aceptada es más amplia que cada diente para facilitar el uso con el dedo.
- **Inodoro:** se comienza tocando al gato; la cortina acompaña la espera. El tirador se pulsa directamente en la ilustración. Al terminar de vaciar, las patitas aparecen listas para limpiar por toque o por gesto, sin una activación adicional.

Los cambios de higiene, baño y hambre se registran al completar la actividad y una sola vez. Salir de la casa cancela la actividad. Los callbacks de interacción comprueban foco y primer plano; los temporizadores del inodoro se pausan en segundo plano y las animaciones pendientes de alimentación no pueden entregar una cucharada allí.

## Verificación

`npm run test:care-scene` recorre las cuatro actividades en 844×390 y 1280×720. Comprueba el recorrido sólo con toques, las herramientas automáticas, los controles dentro de la ilustración, sus tamaños mínimos y la separación respecto del menú inferior; también valida hambre, higiene, baño, compras de prueba y contadores de misiones sin duplicaciones. Guarda capturas en `/tmp/petmaestro-care-scene`.

Se complementa con `INFINITE_COINS=1 npm run test:care` para los gestos de limpieza y cocina, y `npm run test:kitchen` para arrastre, selección, las tres formas de alimentar, cancelación y persistencia. El modo temporal de monedas infinitas permanece activado.

La revisión visual y de interacción se realiza en navegador. La exportación de Expo para Android comprueba el empaquetado; queda pendiente evaluar gestos, rendimiento y usabilidad con niños en un dispositivo físico.
