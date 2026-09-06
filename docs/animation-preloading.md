# Carga inicial de recursos

`src/data/preloadGameAssets.ts` reúne todos los recursos utilizados por el juego: catálogos completos de `assetImages.ts`, imágenes y alimentos de cocina, flores sanas y con sed, audios de palabras y la fuente MaterialCommunityIcons. El fondo de carga también pertenece al catálogo. No se cargan archivos antiguos de disco que el juego ya no referencia.

La carga usa seis tareas simultáneas, comparte descargas duplicadas y cuenta cada recurso terminado para la barra de progreso. `App.tsx` conserva la pantalla inicial hasta que la partida y todos los recursos están preparados. Se eliminó la salida automática a los 15 segundos. Un fallo o tiempo agotado muestra Reintentar y conserva los recursos completados; nunca habilita el juego incompleto. Cada tarea tiene un límite de 45 segundos y las descargas web tienen además cancelación a los 30 segundos.

En web, `cacheGameAsset.web.ts` conserva los archivos como blobs locales de la sesión y prepara las imágenes con el cargador de React Native Web, que espera su decodificación. Actualiza las referencias del catálogo antes de montar la navegación. Esto evita depender de las cabeceras HTTP de Metro al volver a usar un asset. Los blobs duran hasta cerrar/recargar la página; no se montan todas las imágenes grandes a la vez. La descarga inicial completa puede demorar más según la conexión.

En nativo, Expo Asset descarga o reutiliza los archivos locales y `Image.getSize` prepara sus datos en el cargador nativo. La plataforma administra su caché de imágenes; puede liberar bitmaps decodificados bajo presión de memoria. No se fuerza a mantener todos los fondos decodificados simultáneamente.

`SpriteFrames` mantiene montados los cuadros de las mascotas visibles y alterna su opacidad, sin reemplazar las fuentes. Conserva el cuadro inicial hasta que todos están cargados. Sus callbacks son estables para no reiniciar la carga en React Native Web. `fadeDuration={0}` evita el fundido predeterminado de Android.

Validación: TypeScript y diff sin errores. Navegador con sesión nueva: 248 archivos solicitados durante el inicio; recorrido por casa, exterior, tienda y vestidor sin nuevas solicitudes HTTP de imágenes, audios o fuentes. Fallo de descarga simulado: la carga bloquea la entrada, muestra Reintentar y se recupera al restaurar el archivo. La experiencia nativa requiere comprobación en un dispositivo Android.

Auditoría adicional: los 246 archivos únicos referenciados mediante `require` en los cuatro catálogos están presentes en las solicitudes de la carga inicial. Cocina, baño y dormitorio abren con la red desconectada después de preparar los recursos. Para agregar un asset nuevo, registrarlo en esos catálogos, no directamente en una pantalla.
