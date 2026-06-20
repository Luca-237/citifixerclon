const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/verifyRole');
const onlyActive = require('../middlewares/onlyActive');
const { getAll, create, toggle } = require('../controllers/status.controller');

/**
 * @openapi
 * /api/statuses:
 *   get:
 *     summary: Listar estados (admin)
 *     tags: [Statuses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de estados }
 *       403: { description: Sin permisos }
 *   post:
 *     summary: Crear estado (admin)
 *     tags: [Statuses]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: 'en_proceso' }
 *     responses:
 *       201: { description: Estado creado }
 *       403: { description: Sin permisos }
 */
router.get('/', authMiddleware, verifyRole('admin', 'superAdmin'), getAll);
/**
 * @openapi
 * /api/statuses/active:
 *   get:
 *     summary: Listar estados activos
 *     tags: [Statuses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de estados activos }
 */
router.get('/active', authMiddleware, onlyActive, getAll);
router.post('/', authMiddleware, verifyRole('admin', 'superAdmin'), create);
/**
 * @openapi
 * /api/statuses/{id}/toggle:
 *   patch:
 *     summary: Activar/desactivar estado (admin)
 *     tags: [Statuses]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Estado actualizado }
 *       403: { description: Sin permisos }
 *       404: { description: Estado no encontrado }
 */
router.patch('/:id/toggle', authMiddleware, verifyRole('admin', 'superAdmin'), toggle);

module.exports = router;