const {
  getNotifications,
  markAllAsRead,
  markAsReadByIncident
} = require('../services/notification.service');
const { respondError } = require('../utils/logger');

const fetchNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications(req.dbUser._id);
    res.json(notifications);
  } catch (error) {
    respondError(res, error, { context: 'notifications.fetch', inputs: { userId: req.dbUser._id } });
  }
};

const readAll = async (req, res) => {
  try {
    await markAllAsRead(req.dbUser._id);
    res.json({ success: true });
  } catch (error) {
    respondError(res, error, { context: 'notifications.readAll', inputs: { userId: req.dbUser._id } });
  }
};

const readByIncident = async (req, res) => {
  try {
    await markAsReadByIncident(req.params.incidentId, req.dbUser._id);
    res.json({ success: true });
  } catch (error) {
    respondError(res, error, { context: 'notifications.readByIncident', inputs: { incidentId: req.params.incidentId, userId: req.dbUser._id } });
  }
};

module.exports = { fetchNotifications, readAll, readByIncident };
