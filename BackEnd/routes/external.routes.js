const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/verifyRole');
const { externalAuth } = require('../middlewares/externalAuth');
const { requestOtp, getData } = require('../controllers/external.controller');

/**
 * @openapi
 * /api/external/request-otp:
 *   post:
 *     summary: Solicitar OTP para consumo externo (superAdmin)
 *     description: El superAdmin genera un OTP (válido 24 h) para que Power BI consuma los datos.
 *     tags: [External]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OTP generado }
 *       403: { description: Sin permisos }
 */
// superAdmin solicita el OTP desde la app
router.post('/request-otp', authMiddleware, verifyRole('superAdmin'), requestOtp);

/**
 * @openapi
 * /api/external/data/{table}:
 *   get:
 *     summary: Obtener una tabla de datos (Power BI)
 *     description: >
 *       Devuelve una tabla por request. Requiere API Key (SCOPE_API_KEY) + OTP
 *       válido, validados por el middleware externalAuth.
 *     tags: [External]
 *     security: [{ apiKey: [] }]
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *           enum: [groups, incidents, statuses, categories, users]
 *     responses:
 *       200: { description: Filas de la tabla solicitada }
 *       401: { description: API Key u OTP inválidos }
 *       400: { description: Tabla no válida }
 */
// Power BI consume una tabla por request con API Key + OTP.
// Tablas válidas: groups | incidents | statuses | categories | users
router.get('/data/:table', externalAuth, getData);

module.exports = router;
