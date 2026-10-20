# Animación de los animales del exterior

Los seis animales usan una pose base estable de sus sprites de parpadeo originales, con partes articuladas mediante máscaras SVG. Los PNG y las antiguas secuencias de pastoreo y acciones se conservan en el proyecto. Las secuencias antiguas no se alternan en el exterior: cambiaban de pose y proporción bruscamente cada 260 ms.

- Vaca y caballo: pasos alternados, respiración, orejas, cola y flequillo/crin.
- Oveja: pasos cortos, respiración, orejas, cola y movimiento suave del copete de lana.
- Cerdito: pasos cortos, orejas y cola.
- Pato: pasos alternados, balanceo, aleteo leve y copete.
- Conejo: pequeños saltos, patas, orejas y cola.

Cada especie tiene pausas y ritmos distintos. Los desplazamientos se interpolan al arrancar y frenar y vuelven al punto de origen. La silueta tiene margen dentro de su casilla para no invadir a otros animales ni las flores. Las articulaciones conservan un solapamiento con el cuerpo. El parpadeo cambia únicamente la zona de los ojos, sin reemplazar todo el animal ni cambiar el tamaño de su cuerpo.

`FarmAnimationClock` comparte un reloj con objetivo de 30 actualizaciones por segundo entre los seis animales. El fondo, las flores y el inventario no se vuelven a renderizar con cada pose. El reloj se detiene cuando no hay animales, al perder el foco de navegación o al pasar la aplicación a segundo plano. No acumula tiempo mientras está detenido. La preferencia del sistema de reducir movimiento mantiene poses quietas.

## Archivos

- `src/data/farmAnimalMotion.ts`: movimiento y ritmo de cada especie.
- `src/styles/components/farmAnimalRig.layout.ts`: zonas anatómicas y articulaciones.
- `src/components/BlinkingFarmAnimal.tsx`: composición visual.
- `src/components/FarmAnimationClock.tsx`: reloj y ciclo de vida.

## Verificación

`npm run test:animal-motion` recorre 60 segundos simulados por especie para comprobar límites, continuidad de los pasos, saltos y parpadeo, y poses estáticas con movimiento reducido.

`npm run test:animals` requiere el servidor local y Chromium de Playwright. Observa las mutaciones reales de las articulaciones y los ojos durante 14 segundos, verifica dos tamaños horizontales, separación entre animales y flores, pausa y reanudación por navegación, preferencia de movimiento reducido, colocación y entrada a la casa. Guarda capturas e informe en `/tmp/petmaestro-animal-motion`.

Las pruebas de navegador y exportación no certifican rendimiento en Android físico.
