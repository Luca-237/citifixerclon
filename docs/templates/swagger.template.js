/**
 * Plantilla de documentación OpenAPI/Swagger para CityFixer.
 *
 * El bloque `@openapi` se escribe JUSTO ENCIMA de la ruta en el archivo de
 * `routes/`. swagger-jsdoc los recolecta y arma la UI navegable en /api-docs.
 *
 * YA ESTÁ CONECTADO: la config vive en `BackEnd/config/swagger.js` y se monta
 * en `index.js` (http://localhost:3000/api-docs). Usá este archivo como formato
 * de referencia al documentar un endpoint nuevo. Los schemas reutilizables
 * (Incident, IncidentGroup, Location, Error) están definidos en swagger.js y se
 * referencian con `$ref: '#/components/schemas/<Nombre>'`.
 */

/**
 * @openapi
 * /api/incidents:
 *   post:
 *     summary: Crear un incidente
 *     description: >
 *       Crea un reporte de incidencia. La IA lo valida y lo agrupa
 *       automáticamente con incidentes cercanos si corresponde.
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, photos, location, category]
 *             properties:
 *               title:       { type: string, maxLength: 100 }
 *               description: { type: string, maxLength: 1000 }
 *               photos:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               location:
 *                 type: object
 *                 properties:
 *                   lat: { type: number }
 *                   lng: { type: number }
 *               category:    { type: string, description: ObjectId de la categoría }
 *     responses:
 *       201:
 *         description: Incidente creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:  { type: boolean }
 *                 incident: { $ref: '#/components/schemas/Incident' }
 *       400: { description: Datos inválidos }
 *       401: { description: No autenticado }
 *       403: { description: Sin permisos para esta acción }
 */

/*
 * Checklist mínimo para documentar un endpoint:
 *   [ ] summary corto + description si hace falta
 *   [ ] tags (agrupa endpoints por recurso: Incidents, Users, Categories, ...)
 *   [ ] security (qué auth requiere)
 *   [ ] parameters / requestBody con tipos
 *   [ ] responses: al menos el caso de éxito y los errores comunes (400/401/403/404)
 */
