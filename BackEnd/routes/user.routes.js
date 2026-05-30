const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/verifyRole');
const { fetchUsers, fetchUserById, fetchRoles, updateRole, updateBan } = require('../controllers/user.controller');

router.get('/',           authMiddleware, verifyRole('superAdmin'), fetchUsers);
router.get('/roles',      authMiddleware, verifyRole('superAdmin'), fetchRoles);
router.get('/:id',        authMiddleware, verifyRole('superAdmin'), fetchUserById);
router.patch('/:id/role', authMiddleware, verifyRole('superAdmin'), updateRole);
router.patch('/:id/ban',  authMiddleware, verifyRole('superAdmin'), updateBan);

module.exports = router;