const swaggerJSDoc = require('swagger-jsdoc');

// ==========================================
// Definición base de OpenAPI (CityFixer API)
// ==========================================
// Los endpoints se documentan con bloques @openapi sobre cada ruta en routes/.
// swagger-jsdoc recolecta esos bloques + esta definición y arma el spec final.

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'CityFixer API',
    version: '1.0.0',
    description:
      'API REST de CityFixer — reporte y gestión de incidencias urbanas. ' +
      'La mayoría de los endpoints requieren un JWT propio (header ' +
      '`Authorization: Bearer <token>`).',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' },
  ],
  tags: [
    { name: 'Auth', description: 'Registro/login (intercambio de token de Clerk por JWT propio)' },
    { name: 'Incidents', description: 'Reportes de incidencias y grupos de incidencias' },
    { name: 'Categories', description: 'Categorías de incidencias' },
    { name: 'Statuses', description: 'Estados de incidencias' },
    { name: 'Users', description: 'Usuarios, perfiles y roles' },
    { name: 'Notifications', description: 'Notificaciones del usuario' },
    { name: 'Neighborhoods', description: 'Barrios (datos geográficos)' },
    { name: 'External', description: 'Integración externa (Power BI) vía API Key + OTP' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT propio emitido por el backend tras autenticar con Clerk.',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'API Key del scope externo (SCOPE_API_KEY). Usada junto al OTP.',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Ruta no encontrada.' },
          details: { type: 'object', nullable: true },
        },
      },
      Location: {
        type: 'object',
        properties: {
          lat: { type: 'number', example: -34.6037 },
          lng: { type: 'number', example: -58.3816 },
          address: { type: 'string', example: 'Av. Siempre Viva 742' },
        },
      },
      Incident: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665f1c2a9b1e4a0012ab34cd' },
          title: { type: 'string', maxLength: 100 },
          description: { type: 'string', maxLength: 1000 },
          status: { type: 'string', description: 'ObjectId de Status' },
          photos: { type: 'array', items: { type: 'string', format: 'uri' } },
          location: { $ref: '#/components/schemas/Location' },
          category: { type: 'string', description: 'ObjectId de Category' },
          user: { type: 'string', description: 'ObjectId de User' },
          group: { type: 'string', description: 'ObjectId de IncidentGroup' },
          is_emergency: { type: 'boolean' },
          is_dubious: { type: 'boolean' },
          is_cancelled: { type: 'boolean' },
          ai_justification: { type: 'string' },
          ai_suggested_category: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      IncidentGroup: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          status: { type: 'string', description: 'ObjectId de Status' },
          category: { type: 'string', description: 'ObjectId de Category' },
          priority: { type: 'integer', minimum: 0, maximum: 10 },
          representativeId: { type: 'string', description: 'ObjectId del Incident representante' },
          incidents: { type: 'array', items: { type: 'string' } },
          neighborhood: { type: 'string', nullable: true },
          is_emergency: { type: 'boolean' },
          isArchived: { type: 'boolean' },
          finalizedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
    },
  },
  // Seguridad por defecto: JWT. Cada endpoint la sobrescribe si difiere.
  security: [{ bearerAuth: [] }],
};

const swaggerSpec = swaggerJSDoc({
  definition,
  apis: ['./routes/*.js'],
});

module.exports = swaggerSpec;
