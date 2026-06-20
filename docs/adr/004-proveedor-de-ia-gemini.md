# ADR-004: Google Gemini como proveedor de IA

- **Estado:** Aceptado
- **Fecha:** 2026-06-20
- **Autores:** Equipo CityFixer

## Contexto

El sistema necesita IA para, en una sola pasada al crear un incidente: validar el
contenido (legible / dudoso / rechazado), detectar emergencias, sugerir categoría
y prioridad, y decidir si pertenece a un grupo cercano existente
(ver [ADR-002](002-umbral-agrupamiento-ia.md)).

## Decisión

Se usa **Google Gemini** (`@google/generative-ai`), modelo `gemini-2.5-flash`,
con `responseMimeType: "application/json"` para forzar respuesta estructurada.
La integración vive en `services/openai.service.js` y expone
`analizarIncidenteIA(title, description, gruposCercanos)`.

> ⚠️ **Nota de nombre:** el archivo se llama `openai.service.js` por razones
> históricas, pero **NO usa OpenAI**: usa Gemini. Renombrarlo a `ia.service.js`
> o `gemini.service.js` es deuda técnica pendiente.

## Alternativas consideradas

- **OpenAI (GPT)** — el nombre del archivo sugiere que se evaluó/empezó con
  OpenAI; se migró a Gemini (capa gratuita generosa y buen modo JSON para un
  proyecto académico).

## Consecuencias

- **Positivas:** una sola llamada resuelve validación + clasificación +
  agrupamiento; el modo JSON simplifica el parseo.
- **Negativas / costos:** dependencia de un servicio externo (cuota, latencia,
  caídas). Mitigado con un **fallback**: si Gemini falla, el incidente entra como
  `pendiente` con `confianza: 0` y queda marcado para clasificación reevaluacion
  (reprocesable vía `/api/incidents/sync-ai`).
- **A futuro:** renombrar el archivo; considerar cachear o limitar llamadas si
  crece el volumen.
