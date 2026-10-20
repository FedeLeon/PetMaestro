# Aprendizaje, misiones y Ciudad Gatuna

**Juguetes** tiene su propio botón con ilustración en el menú inferior y abre directamente la colección de seis minijuegos. Ya no aparece como acceso dentro de Aventuras. **Aventuras** reúne repaso, misiones, álbum y Ciudad Gatuna; también se abre desde el mapa. El vestidor y la tienda permiten abrir los juegos de los juguetes comprados, y los objetivos de misión conservan sus enlaces a las actividades. Todas las vistas se diseñaron para horizontal y funcionan sin conexión.

## Repaso adaptativo

Cada respuesta en niveles, repaso y ciudad registra aciertos, errores y última práctica de la palabra objetivo. Las parejas correctas del juego de memoria también registran un acierto. Equivocarse permite volver a intentar y no consume vidas ni monedas.

El repaso selecciona hasta cinco palabras del vocabulario disponible hasta el nivel desbloqueado. Prioriza errores relativos a los aciertos, palabras sin practicar y el tiempo transcurrido. Las opciones incorrectas también pertenecen al vocabulario desbloqueado. Una sesión mantiene sus preguntas estables mientras cambia el progreso; la siguiente vuelve a calcularlas. Se alternan consignas en castellano y reconocimiento con pronunciación inglesa cuando existe un audio local; en los demás casos se muestra texto. Completar el repaso entrega 10 monedas y recupera diversión sin modificar el desbloqueo de niveles.

## Cuatro misiones cortas

| Misión | Objetivos | Premio |
| --- | --- | --- |
| Aprender da hambre | Reconocer 3 palabras y servir una comida preparada | 20 monedas |
| Repasar y descansar | Completar un repaso y terminar el descanso en la cama | 20 monedas |
| Una aventura juntos | Completar un juego de juguete y una acción de higiene | 25 monedas |
| Amigos de la ciudad | Completar un encargo de la ciudad y regar una flor propia | 30 monedas |

Los objetivos llevan directamente a su actividad. Los contadores avanzan al finalizar acciones reales, incluidos comida, higiene, descanso y riego; no por abrir una pantalla. Las misiones son permanentes, no caducan y cada premio se cobra una vez. No son tareas diarias ni se reinician por cambiar la fecha. El guardado impide cobrar dos veces mediante toques rápidos o recargas.

## Seis juguetes, cinco tipos de juego

- Ovillo: tocar seis veces el ovillo que gira y rueda continuamente por el piso de una habitación, sin recuadro. El movimiento sigue aunque no lo toquen. [Asset y mecánica](art/yarn-play-room.md).
- Pelota cascabel: perseguirla por un parque durante unos 18 segundos. Tocar la pantalla hace saltar al gato para esquivar troncos, una roca y un arbusto. Cada obstáculo trae una moneda visible para atrapar en el aire; saltar fuera de su alcance no da monedas. [Mecánica y premios](bell-runner-and-rewards.md).
- Ratoncito: buscarlo entre los objetos de una habitación ilustrada. Diez escondites posibles, seis hallazgos por ronda, sin repetir escondite. Cada acierto lo revela y después se esconde en otra parte. El botón «Dame una pista» ilumina brevemente su ubicación. [Asset y prompt](art/mouse-hide-room.md).
- Varita estrella: seguir seis luces; la varita aparece en el siguiente punto. Una elección equivocada permite corregirla.
- Pez de peluche: ocho cartas cuadradas en dos filas de cuatro, con dorso ilustrado y animación de giro. Hay que encontrar cuatro parejas del vocabulario disponible; los errores se dan vuelta después de una breve pausa. [Asset y mecánica](art/fish-memory-cards.md).
- Estrella suave: encontrar tres parejas de dibujos del vocabulario disponible con seis cartas. Las cartas se mezclan al iniciar; las parejas fallidas se ocultan después de una breve pausa.

Se necesita comprar el juguete correspondiente. Cada finalización recupera 25 puntos de diversión y entrega 5 monedas, también al repetir una partida completa. No se cobra al abandonar una ronda. La carrera del cascabel agrega las monedas de los saltos y termina al alcanzar el juguete; no tiene vidas ni penaliza con monedas los tropiezos. Los otros juguetes permiten resolver sus objetivos sin límite de tiempo. Se conserva la mejor puntuación de cada juguete.

## Tres encargos de Ciudad Gatuna

La ciudad se desbloquea al completar el nivel 11. El acceso desde Aventuras permite ver los lugares bloqueados y la condición de entrada.

- Panadería: pedir pan, leche y manzana con frases cortas en inglés y su traducción.
- Parque: encontrar árbol, pájaro y flor.
- Biblioteca: encontrar libro, silla y lámpara.

Cada encargo tiene tres elecciones con ilustraciones, corrección de errores y pronunciación de la palabra cuando hay audio. Las frases completas tienen texto bilingüe; no se incorporaron grabaciones de frases. Cada lugar regala 15 monedas al completarlo por primera vez y 5 al completar una repetición. Los tres encargos dejan una marca de completado. Esta versión de la ciudad consta de esos tres encargos.

## Álbum y pegatinas

El álbum reúne las 38 palabras con traducción, ilustración, progreso y pronunciaciones locales disponibles. Tres aciertos acumulados desbloquean la pegatina a color. No se pierde por errores posteriores. El contador del encabezado muestra la colección conseguida. Las diez palabras sin grabación conservan texto e ilustración; el álbum no muestra botones de audio sin fuente.

## Persistencia y arquitectura

`ProgressState.learning` agrega estadísticas por palabra, contadores de actividades, misiones cobradas, encargos terminados y mejores puntuaciones. Se conserva la clave `petmaestro.progress.v1`. `restoreLearning` normaliza identificadores y números y agrega valores por defecto a partidas anteriores, sin reiniciar monedas, inventario, niveles, dibujo ni cuidado.

Los datos y reglas compartidas viven en `src/data/adventureContent.ts`; las actualizaciones usan el estado actual y la cola de guardado de `ProgressContext`. La lógica de las nuevas pantallas está separada de su estilo horizontal compartido en `src/styles/screens/adventure.styles.ts`.

## Comprobación

- `npm run test:learning`: compatibilidad con valores ausentes o dañados, prioridades del repaso, exclusión de vocabulario bloqueado, pegatinas, requisitos de misiones y coherencia de los encargos.
- `npm run test:adventures`: navegador horizontal 844×390 y 1280×720, error y corrección en repaso, desbloqueo de pegatina, misión con descanso real, seis juguetes, tres encargos y repetición, persistencia al recargar, ciudad bloqueada y compra de juguete desde una partida anterior.
- `npm run test:care`: las actividades completas de comida, baño, higiene, descanso y riego comprueban también sus contadores de misión.
- Suites originales de niveles, almacenamiento, layout y vestidor, comprobación TypeScript y exportaciones Web/Android.

Las capturas y los reportes de Aventuras se guardan en `/tmp/petmaestro-adventures`, configurable con `REVIEW_OUTPUT`. Las pruebas de navegador y la exportación Android no sustituyen la validación de gestos, rendimiento y audio en un dispositivo Android físico.
