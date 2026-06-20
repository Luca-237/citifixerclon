const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/verifyRole');
const onlyActive = require('../middlewares/onlyActive');
const { getAll, create, update, toggle } = require('../controllers/category.controller');

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Listar categorías (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de categorías }
 *       403: { description: Sin permisos }
 *   post:
 *     summary: Crear categoría (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: 'Alumbrado público' }
 *     responses:
 *       201: { description: Categoría creada }
 *       403: { description: Sin permisos }
 */
router.get('/', authMiddleware, verifyRole('admin', 'superAdmin'), getAll);
/**
 * @openapi
 * /api/categories/active:
 *   get:
 *     summary: Listar categorías activas
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de categorías activas }
 */
router.get('/active', authMiddleware, onlyActive, getAll);
router.post('/', authMiddleware, verifyRole('admin', 'superAdmin'), create);
/**
 * @openapi
 * /api/categories/{id}:
 *   patch:
 *     summary: Editar categoría (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200: { description: Categoría actualizada }
 *       404: { description: Categoría no encontrada }
 */
router.patch('/:id', authMiddleware, verifyRole('admin', 'superAdmin'), update);
/**
 * @openapi
 * /api/categories/{id}/toggle:
 *   patch:
 *     summary: Activar/desactivar categoría (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Categoría actualizada }
 *       404: { description: Categoría no encontrada }
 */
router.patch('/:id/toggle', authMiddleware, verifyRole('admin', 'superAdmin'), toggle);

module.exports = router;