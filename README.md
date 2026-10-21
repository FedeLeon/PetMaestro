# PetMaestro

MVP de juego infantil bilingue para Android hecho con Expo y React Native. El juego se desarrolla y se juega exclusivamente en formato horizontal.

## Orientacion del juego

PetMaestro no tiene modo vertical. La orientacion de Android esta fijada en `landscape` desde `app.json`; todas las pantallas y assets interactivos deben prepararse para una pantalla horizontal.

No agregar deteccion de orientacion, estilos `portrait` ni layouts alternativos verticales. La logica debe permanecer en las pantallas y componentes, y los estilos horizontales en sus archivos de `src/styles/`.

## Que incluye

- Mapa de niveles desbloqueables.
- 11 niveles, 104 rondas y 38 palabras con ilustraciones.
- Moneditas por nivel completado.
- Gatito animado simple.
- Tienda de accesorios comprables y equipables.
- Progreso offline con AsyncStorage.
- Cocina, alimentación, higiene, descanso, jardín y dibujo con deshacer.
- Dos temas musicales originales, nueve efectos y controles separados para música, efectos y voces.
- 28 palabras con pronunciación local; las diez pendientes usan indicaciones de texto.
- Repaso adaptativo, cuatro misiones de aprendizaje y cuidado, y álbum de 38 pegatinas.
- Seis juguetes con persecución, escondidas del ratoncito, luces y memoria; tres encargos jugables en Ciudad Gatuna.

## Comandos

Usar Node 22.13 o superior para Expo SDK 57. El proyecto incluye `.nvmrc`
para seleccionar la versión local con `nvm use`.

```bash
npm install
npm start
npm run web
npm run android
npm run typecheck
npm run test:content
npm run build:android:preview
```

Para construir la APK preview con EAS hace falta iniciar sesion en Expo/EAS.

Las pruebas de navegador usan Playwright. Iniciar el servidor con
`npm run web -- --port 8087`, ejecutar `npx playwright install chromium` y luego `npm run test:web`,
`npm run test:care`, `npm run test:storage`, `npm run test:layout` y `npm run test:wardrobe`.
`npm run test:learning` comprueba las reglas de aprendizaje y `npm run test:play-learning`
recorre repaso, álbum, juguetes y ciudad en navegador.
`GAME_URL` permite cambiar la URL; `CHROMIUM_PATH` permite usar un Chromium ya
instalado. Las pruebas crean perfiles temporales y guardan sus capturas en
`/tmp/petmaestro-review` (configurable con `REVIEW_OUTPUT`).
La prueba del vestidor usa `/tmp/petmaestro-wardrobe/after`; el ajuste de prendas
y la animación se documentan en [la revisión del vestidor](docs/cat-wardrobe-fit.md).
Las reglas, recompensas y pruebas nuevas están en [Aprendizaje, juguetes y ciudad](docs/adventures.md).
La cocina guiada y el modo temporal de monedas infinitas se explican en
[Cocina para niños](docs/kitchen-ux.md). `npm run test:kitchen` comprueba el flujo completo.

[Tienda para explorar](docs/shop-ux.md): categorías como objetos del local, expositores de tres productos y flechas de navegación. `npm run test:shop` verifica las nueve categorías y los 63 productos en dos tamaños horizontales.

El análisis de la revisión, las limitaciones pendientes y las recomendaciones
de nuevas mecánicas están en [la guía del proyecto](docs/PROJECT_GUIDE.md#revision-del-juego-2026-10-16).

## Guia para continuar el desarrollo

La arquitectura, el flujo de datos, las reglas para agentes y el checklist de validacion estan documentados en [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md).

Las pantallas mantienen la logica y el JSX en `src/screens/`, mientras que sus unicos estilos horizontales viven en `src/styles/screens/`. Los componentes reutilizables estan en `src/components/`, el contenido en `src/data/` y el estado persistente en `src/context/ProgressContext.tsx`.
