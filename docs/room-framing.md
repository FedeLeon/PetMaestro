# Encuadre de cocina y baño

Las vistas principales de cocina, baño y dormitorio ocupan todo el ancho y alto disponibles entre los menús. `roomFrame.ts` escala el fondo proporcionalmente para cubrir la vista y mantiene la unión pared/suelo cerca del 68% de su altura. En pantallas horizontales más anchas se recortan las zonas superiores e inferiores del dibujo, sin estirarlo.

El fondo, los botones y las salidas comparten la misma transformación de coordenadas. Las áreas de salida se limitan a la parte visible de cada puerta; la de cocina termina antes de la mesa. Los botones conservan la animación de respiración y un tamaño mínimo de 44 puntos. Se eliminó la pastilla de ayuda de la cocina.

El gato de la cocina permanece parado junto al lado izquierdo de la mesa y conserva sus accesorios y parpadeo. Su escala es el doble de la anterior (altura disponible / 300). No hay zona de caminar ni respuesta a toques en el suelo.

Validación: typecheck y diff check; Chromium en 1280×720 y 844×390, fondos sin franjas laterales, capturas inspeccionadas, apertura de las dos funciones de cocina y las tres del baño, regreso desde cada actividad y salidas al salón. Dispositivo físico pendiente.
