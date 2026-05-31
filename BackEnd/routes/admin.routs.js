const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Importamos los middlewares de seguridad
const { verifyToken } = require('../middlewares/verifyToken');
const { verifyRole } = require('../middlewares/verifyRole');

// ==========================================
// Rutas de Administración
// ==========================================

// Endpoint para listar TODOS los usuarios del sistema (Pestaña general de gestión)
router.get(
  '/users',
  verifyToken,
  verifyRole(['admin']),
  adminController.getAllUsers
);

// Endpoint para listar únicamente los usuarios que se encuentran suspendidos/baneados
router.get(
  '/users/banned',
  verifyToken,
  verifyRole(['admin']),
  adminController.getBannedUsersList
);

module.exports = router;