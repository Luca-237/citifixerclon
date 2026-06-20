const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const requireAuth = require('../middlewares/requireAuth');
const { verifyRole } = require('../middlewares/verifyRole');
const { fetchUsers, fetchUserById, fetchMyProfile, sendVerificationCode, patchProfile, createUser, patchUserProfile, fetchRoles, updateRole, updateBan } = require('../controllers/user.controller');

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Perfil propio
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Datos del usuario autenticado }
 *       401: { description: No autenticado }
 *   patch:
 *     summary: Actualizar perfil propio
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName:  { type: string }
 *               dni:       { type: string }
 *               phone:     { type: string }
 *     responses:
 *       200: { description: Perfil actualizado }
 */
router.get('/me',                      authMiddleware, verifyRole('user', 'admin', 'superAdmin'), fetchMyProfile);
/**
 * @openapi
 * /api/users/me/send-verification:
 *   post:
 *     summary: Enviar código de verificación al usuario
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Código enviado }
 */
router.post('/me/send-verification',   authMiddleware, requireAuth, sendVerificationCode);
router.patch('/me',                    authMiddleware, requireAuth, patchProfile);
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Listar usuarios (superAdmin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de usuarios }
 *       403: { description: Sin permisos }
 *   post:
 *     summary: Crear usuario (superAdmin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:     { type: string, format: email }
 *               firstName: { type: string }
 *               lastName:  { type: string }
 *               role:      { type: string }
 *     responses:
 *       201: { description: Usuario creado }
 *       403: { description: Sin permisos }
 */
router.get('/',                authMiddleware, verifyRole('superAdmin'), fetchUsers);
router.post('/',               authMiddleware, verifyRole('superAdmin'), createUser);
/**
 * @openapi
 * /api/users/roles:
 *   get:
 *     summary: Listar roles (superAdmin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de roles }
 */
router.get('/roles',           authMiddleware, verifyRole('superAdmin'), fetchRoles);
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID (superAdmin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Datos del usuario }
 *       404: { description: Usuario no encontrado }
 */
router.get('/:id',             authMiddleware, verifyRole('superAdmin'), fetchUserById);
/**
 * @openapi
 * /api/users/{id}/profile:
 *   patch:
 *     summary: Editar perfil de un usuario (superAdmin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Perfil actualizado }
 */
router.patch('/:id/profile',   authMiddleware, verifyRole('superAdmin'), patchUserProfile);
/**
 * @openapi
 * /api/users/{id}/role:
 *   patch:
 *     summary: Cambiar rol de un usuario (superAdmin)
 *     tags: [Users]
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
 *               role: { type: string, example: 'admin' }
 *     responses:
 *       200: { description: Rol actualizado }
 */
router.patch('/:id/role',      authMiddleware, verifyRole('superAdmin'), updateRole);
/**
 * @openapi
 * /api/users/{id}/ban:
 *   patch:
 *     summary: Banear/desbanear usuario (superAdmin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Estado de baneo actualizado }
 */
router.patch('/:id/ban',       authMiddleware, verifyRole('superAdmin'), updateBan);

module.exports = router;