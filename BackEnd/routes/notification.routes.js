const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/verifyRole');
const { fetchNotifications, readAll, readByIncident } = require('../controllers/notification.controller');

const authenticated = [authMiddleware, verifyRole('user', 'admin', 'superAdmin')];

router.get('/', authenticated, fetchNotifications);
router.patch('/read-all', authenticated, readAll);
router.patch('/by-incident/:incidentId/read', authenticated, readByIncident);

module.exports = router;
