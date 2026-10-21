# Revisión general de experiencia de usuario

Revisión del 17 de octubre de 2026. Todas las medidas y recorridos son para horizontal, en 844×390 y 1280×720. Se conservaron la partida, las recompensas, el modo temporal de monedas infinitas, el ratón un 20 % más pequeño, las cortinas, las ocho cartas del pez y los cuidados directos sobre la escena.

## Cambios

| Área | Problema encontrado | Cambio |
| --- | --- | --- |
| Navegación | Cuatro de las seis entradas inferiores sólo mostraban dibujos | Nombre visible en las seis entradas, conservando selección y zonas de toque |
| Juguetes | En el teléfono, «Jugar» quedaba debajo del borde visible y los dibujos no abrían el juego | Toda la tarjeta es táctil; primera fila con dibujo, descripción breve y acción visible |
| Aventuras | Entradas formadas sólo por texto; no quedaba claro cómo avanzar en una misión | Entradas ilustradas, flechas, pasos de al menos 44 puntos, estado de misión y confirmación del premio |
| Álbum | Lista extensa, dibujo casi invisible al bloquearse y controles de voz/progreso debajo del borde visible | Filtros de ganadas/pendientes, acceso al repaso y tarjetas compactas con dibujo, voz y tres estrellas de progreso |
| Ropa | Poco espacio para el gato; selección dependía del color del borde | Encabezado compacto, marca de prenda puesta, estado accesible al poner/quitar y enlace a la tienda si no hay accesorios |
| Dibujo | Colores pequeños; goma y deshacer requerían desplazar todos los controles | Colores de 44 puntos, marca de color seleccionado, tamaño/goma/deshacer siempre visibles; sólo la paleta puede desplazarse si falta espacio |
| Aprendizaje | El resultado y sus botones competían por altura con las necesidades y el menú inferior | Resultado en dos columnas horizontales, encabezado compacto y acceso al álbum al terminar un repaso |
| Ciudad | El acierto cambiaba inmediatamente de encargo | Dibujo correcto resaltado durante 550 ms, entradas bloqueadas durante la confirmación y cancelación al salir o pasar a segundo plano |
| Tienda | Un doble toque podía comprar y luego ejecutar la nueva acción del mismo objeto | Confirmación «¡Tuyo!» y bloqueo de 650 ms antes de habilitar vestir/jugar/colocar |
| Pronunciación | Diez palabras no tenían grabación | Ocho grabaciones añadidas; 36 de 38 palabras tienen voz local |

Las pantallas reutilizan las ilustraciones del proyecto: juguetes, libro del álbum, mapa, ciudad y prendas. No se sustituyó el estilo visual por iconos genéricos ni se generaron imágenes de reemplazo sin una necesidad detectada. Las voces y sus licencias están en [AUDIO_CREDITS.md](../AUDIO_CREDITS.md) y [audio/vocabulary-sources.json](audio/vocabulary-sources.json).

## Verificación reproducible

Iniciar Expo web antes de las suites de navegador. `CHROMIUM_PATH` permite seleccionar Chromium instalado; `INFINITE_COINS=1` ajusta las comprobaciones de compras al modo de prueba sin modificar la economía del proyecto.

- `npm run test:ux`: controles visibles, entrada por la ilustración del juguete, filtros del álbum, reproducción real de las ocho voces, resultado del repaso, poner/quitar ropa, controles de dibujo y confirmación/cancelación de encargos. Capturas: `/tmp/petmaestro-ux-review`.
- `INFINITE_COINS=1 npm run test:web`: los 11 niveles y sus 104 rondas, errores y reintentos, premios, doble toque de compra, ropa, audio y persistencia del dibujo.
- `INFINITE_COINS=1 npm run test:play-learning`: repaso adaptativo, seis juguetes, tres lugares de la ciudad, repetición y persistencia.
- `npm run test:layout`, `INFINITE_COINS=1 npm run test:care`, `npm run test:shop`, `npm run test:wardrobe`, `npm run test:petting`: navegación, cuidado completo, categorías/objetos, ajuste de ropa y caricias a los seis animales.
- `INFINITE_COINS=1 npm run test:storage`: fallos simulados de lectura/escritura, recuperación y partidas antiguas.
- `npm run typecheck`, `npm run test:content`, `npm run test:learning`, `npm run test:animal-motion`: tipos, referencias de assets y reglas de progreso/animación.
- Exportación de Expo para web y Android en `/tmp/petmaestro-global-review-export`.

Las pruebas de navegador comprueban interacción y reproducción multimedia, y se revisan capturas reales. Los fallos de almacenamiento son simulados. Las pruebas matemáticas de movimiento no equivalen a una revisión de fluidez en dispositivo; la exportación Android tampoco equivale a una prueba instalada.

Resultado final: todas las suites indicadas finalizaron correctamente con Chromium instalado y el modo de monedas de prueba indicado. Se recorrieron los 11 niveles/104 rondas, los seis juguetes y tres lugares de ciudad, las compras de 63 productos/9 categorías, 44 piezas de vestuario y ocho conjuntos, el cuidado completo y las caricias a los seis animales en ambos tamaños. La exportación web/Android y el chequeo de tipos también terminaron correctamente. Se revisaron capturas de navegación, álbum, juguetes, resultados, dibujo, prendas individuales/conjuntas y exterior.

## Pendientes y siguientes mejoras

- Conseguir las grabaciones de `butterfly` y `socks`: Commons devolvió HTTP 429 en sus descargas. Se mantienen los textos alternativos y no se muestra un botón de voz sin audio.
- Hacer sesiones de observación con niños para ajustar la dificultad de los escondites y la velocidad del ovillo a partir de su desempeño real.
- Probar en Android físico la fluidez, el volumen de las distintas voces, los gestos y las interrupciones de la aplicación.
- Como ampliación posterior, permitir elegir una palabra concreta del álbum para practicarla y personalizar la duración de las sesiones.
