# Architecture Decision Records (ADRs)

Registro de las decisiones arquitecturales importantes de CityFixer. Cada ADR
explica el **contexto**, la **decisión** y sus **consecuencias**, para que el
"por qué" no se pierda con el tiempo.

> Para crear uno nuevo: copiá [../templates/adr.template.md](../templates/adr.template.md)
> a `NNN-titulo-en-kebab-case.md` con el siguiente número correlativo.

| # | Decisión | Estado |
|---|----------|--------|
| [001](001-incidentgroup-fuente-de-verdad.md) | `IncidentGroup` como fuente de verdad | Aceptado |
| [002](002-umbral-agrupamiento-ia.md) | Umbral 0.85 + proximidad 20 m para el agrupamiento por IA | Aceptado |
| [003](003-is-dubious-como-flag.md) | `is_dubious` como flag en lugar de un estado | Aceptado |
| [004](004-proveedor-de-ia-gemini.md) | Google Gemini como proveedor de IA | Aceptado |
