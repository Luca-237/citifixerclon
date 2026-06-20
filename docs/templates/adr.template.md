# ADR-NNN: <título corto de la decisión>

- **Estado:** Propuesto | Aceptado | Reemplazado por ADR-XXX | Obsoleto
- **Fecha:** AAAA-MM-DD
- **Autores:** <nombres>

## Contexto

¿Qué problema o situación nos llevó a tomar esta decisión? Incluí restricciones
técnicas, de negocio o de tiempo que pesaron. Una persona nueva debería entender
el "por qué" sin leer el código.

## Decisión

Qué decidimos hacer, en una o dos frases claras y en presente.
Ej: "El `IncidentGroup` es la fuente de verdad para status, category y priority."

## Alternativas consideradas

- **Opción A** — descripción. Por qué se descartó.
- **Opción B** — descripción. Por qué se descartó.

## Consecuencias

- **Positivas:** qué ganamos.
- **Negativas / costos:** qué resignamos o qué deuda asumimos.
- **A futuro:** qué habría que revisar si cambian las condiciones.

---
> Cómo usar esta plantilla:
> 1. Copiala a `docs/adr/NNN-titulo-en-kebab-case.md` (NNN = número correlativo).
> 2. Un ADR por decisión. Cortos. No se editan una vez aceptados: si algo cambia,
>    se crea un ADR nuevo que reemplaza al anterior.
>
> Decisiones de CityFixer que ya merecen su ADR:
> - El modelo `IncidentGroup` como fuente de verdad (vs. incidentes planos).
> - Umbral de confianza `0.85` + proximidad de 20 m para el agrupamiento por IA.
> - `is_dubious` como flag en lugar de un estado más.
> - Uso de Google Gemini (nota: el archivo se llama `openai.service.js`).
