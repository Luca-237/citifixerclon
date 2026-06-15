const Notification = require('../models/notification');
const { getIo } = require('./socket.service');

// recipients: [{ userId, incidentId, incidentTitle }]
// cada usuario recibe su propio incidentId/title para navegar e identificar el incidente
const createNotifications = async (recipients, { type, message, groupId }) => {
  const docs = recipients.map(({ userId, incidentId, incidentTitle }) => ({
    userId,
    type,
    message,
    groupId,
    incidentId,
    incidentTitle: incidentTitle ?? null
  }));
  const created = await Notification.insertMany(docs);

  const io = getIo();
  if (io) {
    created.forEach(notification => {
      io.to(`user_${notification.userId}`).emit('notification', {
        _id: notification._id,
        type: notification.type,
        message: notification.message,
        groupId: notification.groupId,
        incidentId: notification.incidentId,
        incidentTitle: notification.incidentTitle,
        isRead: false,
        createdAt: notification.createdAt
      });
    });
  }
};

const getNotifications = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

const markAllAsRead = async (userId) => {
  return Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

const markAsReadByIncident = async (incidentId, userId) => {
  return Notification.updateMany(
    { userId, incidentId, isRead: false },
    { isRead: true }
  );
};

module.exports = {
  createNotifications,
  getNotifications,
  markAllAsRead,
  markAsReadByIncident
};
