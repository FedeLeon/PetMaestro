# PetMaestro

MVP de juego infantil bilingue para Android hecho con Expo y React Native. El juego se desarrolla y se juega exclusivamente en formato horizontal.

## Orientacion del juego

PetMaestro no tiene modo vertical. La orientacion de Android esta fijada en `landscape` desde `app.json`; todas las pantallas y assets interactivos deben prepararse para una pantalla horizontal.

No agregar deteccion de orientacion, estilos `portrait` ni layouts alternativos verticales. La logica debe permanecer en las pantallas y componentes, y los estilos horizontales en sus archivos de `src/styles/`.

## Que incluye

- Mapa de niveles desbloqueables.
- Ejercicios mixtos de castellano/ingles con dibujos placeholder.
- Moneditas por nivel completado.
- Gatito animado simple.
- Tienda de accesorios comprables y equipables.
- Progreso offline con AsyncStorage.

## Comandos

```bash
npm install
npm start
npm run web
npm run android
npm run typecheck
npm run build:android:preview
```

Para construir la APK preview con EAS hace falta iniciar sesion en Expo/EAS.

## Guia para continuar el desarrollo

La arquitectura, el flujo de datos, las reglas para agentes y el checklist de validacion estan documentados en [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md).

Las pantallas mantienen la logica y el JSX en `src/screens/`, mientras que sus unicos estilos horizontales viven en `src/styles/screens/`. Los componentes reutilizables estan en `src/components/`, el contenido en `src/data/` y el estado persistente en `src/context/ProgressContext.tsx`.
