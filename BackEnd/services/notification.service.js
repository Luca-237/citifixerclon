const Notification = require('../models/notification');
const { getIo } = require('./socket.service');

/**
 * Crea notificaciones en lote y las emite en tiempo real por Socket.IO
 * (a la room `user_<id>` de cada destinatario).
 *
 * @param {Array<Object>} recipients              Destinatarios.
 * @param {string} recipients[].userId            Usuario a notificar.
 * @param {string} recipients[].incidentId        Incidente asociado (para navegar).
 * @param {string} [recipients[].incidentTitle]   Título del incidente.
 * @param {Object} payload
 * @param {string} payload.type     Tipo de notificación.
 * @param {string} payload.message  Mensaje a mostrar.
 * @param {string} payload.groupId  Grupo de incidentes asociado.
 * @returns {Promise<void>}
 */
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

/**
 * Devuelve las últimas 50 notificaciones de un usuario (más recientes primero).
 *
 * @param {string} userId ObjectId del usuario.
 * @returns {Promise<Array>} Notificaciones del usuario.
 */
const getNotifications = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

/**
 * Marca como leídas todas las notificaciones no leídas de un usuario.
 *
 * @param {string} userId ObjectId del usuario.
 * @returns {Promise<Object>} Resultado de la actualización en lote.
 */
const markAllAsRead = async (userId) => {
  return Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

/**
 * Marca como leídas las notificaciones de un usuario para un incidente concreto.
 *
 * @param {string} incidentId ObjectId del incidente.
 * @param {string} userId     ObjectId del usuario.
 * @returns {Promise<Object>} Resultado de la actualización en lote.
 */
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
