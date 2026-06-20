const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { registerUser } = require('../controllers/auth.controller.js');

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login / registro
 *     description: >
 *       Valida el token de Clerk (header Authorization) y registra al usuario
 *       en la base si no existe, devolviendo la sesión propia.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Usuario autenticado/registrado }
 *       401: { description: Token de Clerk inválido o ausente }
 */
router.post('/login', verifyToken, registerUser);

module.exports = router;