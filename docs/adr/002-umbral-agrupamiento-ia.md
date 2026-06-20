# ADR-002: Umbral 0.85 + proximidad 20 m para el agrupamiento por IA

- **Estado:** Aceptado
- **Fecha:** 2026-06-20
- **Autores:** Equipo CityFixer

## Contexto

Dada la decisión de agrupar incidentes ([ADR-001](001-incidentgroup-fuente-de-verdad.md)),
hay que decidir **automáticamente** si un reporte nuevo pertenece a un grupo
existente o si abre uno propio. Agrupar de más mezcla problemas distintos;
agrupar de menos reproduce el problema de los duplicados.

La IA (ver [ADR-004](004-proveedor-de-ia-gemini.md)) devuelve, entre otros, un
candidato de grupo y un valor de `confianza` entre 0.0 y 1.0.

## Decisión

Un reporte se agrega a un grupo existente **solo si se cumplen TODAS** estas
condiciones:

1. El estado sugerido por la IA es `pendiente` (no `dudoso` ni `rechazado`).
2. La confianza de la IA es **>= 0.85** (`CONFIANZA_UMBRAL` en
   `services/incident.service.js`).
3. Hay **proximidad geográfica** (~20 m): los grupos candidatos se filtran por
   cercanía antes de enviarlos a la IA.

Si no se cumplen, el reporte abre su **propio grupo**. Si el reporte es
`dudoso`/`rechazado` pero igual hay un candidato fuerte, se guarda
`ai_suggestion.idGrupoCandidato` para un posible merge manual futuro.

## Alternativas consideradas

- **Umbral más bajo (ej. 0.6)** — descartado: agrupaba problemas parecidos pero
  distintos (un bache y una tapa de cloaca cercanos).
- **Solo proximidad, sin IA** — descartado: dos problemas distintos pueden estar
  a metros uno del otro.
- **Solo IA, sin filtro geográfico** — descartado: caro (mandar todos los grupos
  a la IA) y propenso a falsos positivos entre zonas lejanas.

## Consecuencias

- **Positivas:** agrupamiento conservador (prefiere crear grupo nuevo antes que
  mezclar); la combinación texto + geografía reduce falsos positivos.
- **Negativas / costos:** dos reportes del mismo problema pueden quedar en grupos
  separados si la IA no llega a 0.85; el `0.85` y los `20 m` son valores
  empíricos que pueden requerir ajuste con datos reales.
- **A futuro:** afinar el umbral y el radio con métricas de producción; habilitar
  el merge manual de dudosos.
