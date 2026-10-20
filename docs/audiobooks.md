# Biblioteca infantil

Acceso gratuito desde el ícono de biblioteca del menú inferior, sin necesidad
de comprar muebles. La biblioteca comprada y colocada en el salón también abre
la colección al tocarla. Los siete botones inferiores muestran únicamente sus
assets dentro de círculos; conservan nombres accesibles para lectores de pantalla.

La biblioteca contiene doce cuentos largos en una única grilla desplazable,
sin paginación. Se desbloquean por grupos de cuatro. Los
primeros cuatro reemplazan las poesías breves anteriores. La abeja haragana
(14:07) y Las medias de los flamencos (10:47), de Horacio Quiroga, tienen audio
local y texto completo, narrados por AnabelleC y Charbelí Ramos Chávez. La voz
de Charbelí es latinoamericana; no se afirma un acento argentino. La liebre y
la tortuga y El león y el ratón son adaptaciones originales rioplatenses de
fábulas tradicionales, de unas 850 palabras cada una (~7 minutos para leer en
voz alta a 130 palabras/minuto). Cada libro muestra si ofrece audio o lectura.

## Desbloqueo por grupos

El primer grupo está abierto desde el principio. Cada cuento cuenta como
terminado al completar sus cinco preguntas, incluso con cero respuestas
correctas. Terminar cuatro cuentos distintos abre el grupo siguiente; las
repeticiones de un mismo cuento no reemplazan los pendientes. Un cuestionario
abandonado a medias no cuenta. Se usa `storyQuizResults.completed`, de modo que
las lecturas ya completadas de los primeros cuatro cuentos conservan su valor.

Los doce libros están montados en la misma vista, con cuatro tarjetas por fila.
Se desplaza la grilla verticalmente para recorrerlos; no hay flechas de página.
Los libros futuros tienen tarjetas grises, candado y una explicación del
requisito; no se pueden abrir.
El lector también valida el bloqueo si se intenta entrar por una ruta directa,
y `ProgressContext` rechaza preguntas y premios de lectura de libros todavía
bloqueados. Al completar un grupo se anuncia que se abrieron cuatro cuentos y
sus tarjetas recuperan el color dentro de la misma grilla. El último grupo no anuncia
libros inexistentes. Los libros anteriores siguen disponibles para releer.

El segundo grupo contiene La cigarra y la hormiga, El zorro y la cigüeña,
Los ratones del campo y la ciudad y El viento y el sol. El tercero contiene
La semilla impaciente, El puente de los amigos, El farol de la luciérnaga y
El barrilete de los colores. Cada texto nuevo tiene entre 668 y 733 palabras,
tres ilustraciones, una enseñanza y cinco preguntas propias. Son lecturas de
aproximadamente seis minutos, escritas para PetMaestro en español rioplatense.
No se añadieron nuevas grabaciones sin una variante latinoamericana o argentina
verificada; los ocho libros nuevos son para leer.

La navegación conserva la posición de desplazamiento al volver de un cuento.
Orden estable y reglas: `src/data/libraryProgression.ts`. Textos, metadatos y
preguntas nuevas: `src/data/expandedStories.json`. Fuentes y derechos:
`docs/expanded-library-content.json`. Arte: `docs/art/expanded-library-prompts.json`.

Los libros con audio abren un reproductor horizontal con pausa, reproducción, saltos de diez segundos y vuelta
al principio. Al terminar ofrece repetir. No arranca otro cuento automáticamente.
Tres ilustraciones por cuento avanzan siguiendo tiempos editoriales aproximados
de la narración; no son subtítulos ni sincronización palabra por palabra.

## Lectura y comprensión

Cada reproductor muestra el texto completo en un panel desplazable, con letra
grande, párrafos y enseñanza. El texto permanece visible al reproducir o pausar.
«Leer yo» detiene la narración y permite que un adulto lea en voz alta. En ese
modo, «Terminé de leer» abre las preguntas sin necesitar que termine el MP3.
Escuchar hasta el final también habilita las preguntas, sin cambiar de vista
automáticamente ni interrumpir una posible relectura.

Los libros sin audio abren directamente en modo lectura, sin reproductor vacío,
barra de audio ni indicador de carga. No crean un objeto Audio en web ni cobran
premio por abrir el cuento. «Terminé de leer» habilita las preguntas. En lectura
manual, «Ver dibujo» recorre las tres ilustraciones sin depender del audio.

Cada cuento tiene cinco preguntas propias, con tres opciones por pregunta. Se
registra una única respuesta inicial, se muestra cuál era la correcta junto con
una explicación y se avanza con un botón. Completar las cinco entrega cinco
monedas base más una por acierto: entre cinco y diez. Leer o escuchar conserva
su premio anterior de tres monedas, una vez en esa vista. Repetir una ronda
completa de preguntas vuelve a dar su premio, sin repetir el premio de lectura
en la misma vista. Salir de una ronda incompleta no da monedas de preguntas.

`ProgressContext.completeStoryQuiz` valida las cinco respuestas y calcula el
premio; la interfaz no decide la cantidad a cobrar. `storyQuizResults` guarda
mejor puntuación, número de rondas y último identificador por cuento. Este
identificador impide cobrar dos veces la misma finalización; partidas antiguas
reciben un mapa vacío y los campos corruptos se filtran al restaurar. Las monedas
siguen acumulándose en el saldo real con el modo infinito de pruebas activo.

Textos y preguntas actuales: `src/data/longStoryTexts.json`, `src/data/expandedStories.json` y
`src/data/storyReadingContent.ts`. Fuente y condiciones: `AUDIO_CREDITS.md`.

Las dos grabaciones completas están incluidas como MP3 locales. La aplicación no
consulta LibriVox ni Archive durante la reproducción. En web se sirven como
assets de la aplicación; esto no agrega un service worker ni garantiza recarga
offline del sitio. En una compilación nativa se empaquetan mediante `require`.

El reproductor respeta la opción Voz. La música del juego se pausa mientras
la vista está activa, incluso si se pausa el cuento; se recupera al salir según
la preferencia existente. Al navegar, ocultar la pestaña o enviar la aplicación
al fondo se pausa la narración y no se reanuda sola. Abrir créditos también pausa.
Los errores muestran Reintentar, sin bloquear la navegación.

Fuente y derechos: `AUDIO_CREDITS.md` y `docs/audiobook-sources.json`.
Ilustraciones nuevas y prompts: `docs/art/long-stories-prompts.json`.
Se conservan los datos anteriores de progreso, propiedad y colocación de muebles;
las actividades nuevas suman sus premios al saldo guardado. Los resultados de
preguntas de los cuentos anteriores se conservan aunque sus libros ya no estén
en la biblioteca visible. Audios, textos e ilustraciones anteriores permanecen
en el proyecto; sus fuentes se archivaron en `docs/audiobook-sources-legacy.json`.

Validación: `npm run typecheck`, `npm run test:content`, `npm run test:library` y
`npm run test:story-reading` (sesenta preguntas validadas, aciertos/errores, doble toque,
repetición, lectura adulta, pausa, salida sin premio y persistencia).
La prueba de navegador usa reproducción MP3 real con el reloj del reproductor;
no valida altavoces ni interrupciones de audio de un teléfono físico.

`npm run test:library-progression` recorre los doce libros y sus cuestionarios
en dos tamaños horizontales, comprueba tarjetas grises, respuestas totalmente
incorrectas, repeticiones, cancelación parcial, ambos desbloqueos, monedas e
historial conservados al recargar. También valida orden, resultados corruptos
y resultados de libros retirados que no deben abrir los estantes actuales.

Revisión de estantes, 20/10/2026: pasaron typecheck, auditoría de 352 referencias,
los tests de biblioteca y lectura anteriores y el recorrido de progresión en
844×390 y 1280×720. Se completaron los doce cuestionarios con cero aciertos,
se probaron repeticiones y abandono parcial y se confirmaron ambos desbloqueos
y la persistencia del saldo e historial. Las capturas están en
`/tmp/petmaestro-library-progression`. La exportación Android terminó en
`/tmp/petmaestro-library-progression-android-export`; no se generó APK ni se
probó un teléfono físico.

Revisión de cuentos largos, 20/10/2026: pasaron typecheck, auditoría de 344
referencias, los cuestionarios de los cuatro cuentos y la biblioteca completa
en 1280×720 y 844×390. Se probaron reproducción real, pausa, avance, repetición,
preferencias de voz, reintento ante un error, lectura sin audio, cambio manual
de las ilustraciones y persistencia de monedas. FFmpeg decodificó completos
ambos MP3 (código 0); omitió un comentario ID3 con BOM incorrecto en los
originales, sin errores en los cuadros de audio. Exportación Android completada
en `/tmp/petmaestro-long-stories-android-export`, con las dos narraciones y los
assets nuevos. No se generó APK ni se probó un teléfono físico.

Revisión de la colección anterior, 19/10/2026: los cuatro MP3 se decodificaron completos con FFmpeg.
Pasaron typecheck, auditoría de 330 referencias y la prueba de biblioteca en
1280×720 y 844×390, incluyendo silencio de música, preferencias de voz, pausa
al ocultar la pestaña, errores con reintento y acceso desde el mueble. Exportación
Android completada en `/tmp/petmaestro-library-android-export`, con los cuatro
MP3 y las ilustraciones incluidos. No se generó APK ni se probó teléfono físico.
