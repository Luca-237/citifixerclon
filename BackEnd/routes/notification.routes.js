const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/verifyRole');
const { fetchNotifications, readAll, readByIncident } = require('../controllers/notification.controller');

const authenticated = [authMiddleware, verifyRole('user', 'admin', 'superAdmin')];

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     summary: Listar notificaciones del usuario
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de notificaciones }
 *       401: { description: No autenticado }
 */
router.get('/', authenticated, fetchNotifications);
/**
 * @openapi
 * /api/notifications/read-all:
 *   patch:
 *     summary: Marcar todas las notificaciones como leídas
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Notificaciones marcadas como leídas }
 */
router.patch('/read-all', authenticated, readAll);
/**
 * @openapi
 * /api/notifications/by-incident/{incidentId}/read:
 *   patch:
 *     summary: Marcar como leídas las notificaciones de un incidente
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: incidentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Notificaciones del incidente marcadas como leídas }
 */
router.patch('/by-incident/:incidentId/read', authenticated, readByIncident);

module.exports = router;
