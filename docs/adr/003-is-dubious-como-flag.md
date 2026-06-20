# ADR-003: `is_dubious` como flag en lugar de un estado

- **Estado:** Aceptado
- **Fecha:** 2026-06-20
- **Autores:** Equipo CityFixer

## Contexto

La IA puede detectar reportes "dudosos" (el título y la descripción se
contradicen, o parece una broma). Había que decidir cómo representarlos.

La opción intuitiva era agregar un estado más ("dudoso") al ciclo de vida del
incidente, junto a pendiente / aceptado / rechazado. Pero eso tiene un problema:
**qué ve el vecino**. Mostrarle "tu reporte es dudoso" es confuso y acusatorio, y
expone la lógica interna de moderación.

## Decisión

"Dudoso" es un **flag** (`is_dubious: boolean`) en el `Incident`, **no un estado**.

- El **vecino** ve su incidente como `pendiente` (estado normal).
- El **admin** ve el flag `is_dubious` y puede resolverlo: al pasar el incidente a
  `aceptado` o `rechazado`, se limpia `is_dubious` en todos los incidentes del grupo.
- Un incidente dudoso **siempre abre su propio grupo** (no se agrupa
  automáticamente, ver [ADR-002](002-umbral-agrupamiento-ia.md)).

## Alternativas consideradas

- **"dudoso" como estado** — descartado: contamina la máquina de estados visible
  al usuario y obliga a ocultarlo en el frontend de todas formas. (Quedó un
  status "dudoso" en el seed que hoy no se usa).
- **Borrar/ocultar el reporte dudoso** — descartado: se perdería información que
  el admin necesita para moderar.

## Consecuencias

- **Positivas:** separa la **moderación interna** (flag) de la **experiencia del
  usuario** (estado); el estado sigue siendo una máquina simple.
- **Negativas / costos:** hay que recordar limpiar el flag al resolver; coexisten
  dos conceptos (estado + flags como `is_dubious`, `is_cancelled`, `is_emergency`)
  que el equipo debe tener claros.