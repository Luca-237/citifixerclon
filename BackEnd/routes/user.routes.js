const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/verifyRole');
const { fetchUsers, fetchUserById, fetchMyProfile, patchProfile, createUser, patchUserProfile, fetchRoles, updateRole, updateBan } = require('../controllers/user.controller');

router.get('/me',              authMiddleware, verifyRole('user', 'admin', 'superAdmin'), fetchMyProfile);
router.patch('/me',            authMiddleware, verifyRole('user', 'admin', 'superAdmin'), patchProfile);
router.get('/',                authMiddleware, verifyRole('admin', 'superAdmin'), fetchUsers);
router.post('/',               authMiddleware, verifyRole('admin', 'superAdmin'), createUser);
router.get('/roles',           authMiddleware, verifyRole('admin', 'superAdmin'), fetchRoles);
router.get('/:id',             authMiddleware, verifyRole('admin', 'superAdmin'), fetchUserById);
router.patch('/:id/profile',   authMiddleware, verifyRole('admin', 'superAdmin'), patchUserProfile);
router.patch('/:id/role',      authMiddleware, verifyRole('superAdmin'), updateRole);
router.patch('/:id/ban',       authMiddleware, verifyRole('superAdmin'), updateBan);

module.exports = router;