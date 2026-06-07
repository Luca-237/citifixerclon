const {
  getNotifications,
  markAllAsRead,
  markAsReadByIncident
} = require('../services/notification.service');

const fetchNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications(req.dbUser._id);
    res.json(notifications);
  } catch {
    res.status(500).json({ error: 'Error al obtener notificaciones.' });
  }
};

const readAll = async (req, res) => {
  try {
    await markAllAsRead(req.dbUser._id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al marcar notificaciones.' });
  }
};

const readByIncident = async (req, res) => {
  try {
    await markAsReadByIncident(req.params.incidentId, req.dbUser._id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al marcar notificaciones.' });
  }
};

module.exports = { fetchNotifications, readAll, readByIncident };
