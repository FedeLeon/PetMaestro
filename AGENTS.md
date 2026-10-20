# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Orientacion obligatoria

PetMaestro se desarrolla y se juega exclusivamente en formato horizontal (`landscape`). No agregar soporte vertical, deteccion responsiva portrait/landscape ni estilos alternativos para portrait. Toda nueva pantalla, vista, asset, zona tactil o animacion debe disenar sus medidas para horizontal y mantener la logica separada de los estilos.

# Documentacion y pruebas

- Generar la menor documentacion posible en cada tarea. Registrar solo los cambios y updates principales con texto corto, estilo mensaje de commit.
- Mantener explicaciones de arquitectura pequenas y solo cuando sean necesarias para entender o mantener el proyecto. Actualizar documentos existentes antes de crear otros.
- No crear informes extensos, documentos por cada ajuste ni historiales detallados de ejecucion. Conservar brevemente los creditos y licencias de assets cuando corresponda.
- Ejecutar los tests necesarios para validar la tarea. Cuando pasen correctamente, eliminar esos tests y sus artefactos temporales; quitar tambien los comandos, imports y referencias que queden apuntando a ellos. No conservar suites nuevas despues de validar.
