const Status = require('../models/status');
const mongoose = require('mongoose');

/**
 * Lista estados ordenados por nombre, opcionalmente filtrados.
 *
 * @param {Object} [filter={}] Filtro Mongoose (ej. `{ isActive: true }`).
 * @returns {Promise<Array>} Estados encontrados.
 */
const getAllStatuses = async (filter = {}) => {
  return await Status.find(filter).sort({ name: 1 });
};

/**
 * Crea un estado validando que el nombre no esté repetido.
 *
 * @param {Object} data
 * @param {string} data.name        Nombre del estado.
 * @param {string} [data.description] Descripción opcional.
 * @returns {Promise<Object>} Estado creado.
 * @throws {Error} 400 si ya existe un estado con ese nombre.
 */
const createStatus = async ({ name, description }) => {
  const existing = await Status.findOne({ name: name.trim() });
  if (existing) {
    const error = new Error('Ya existe un estado con ese nombre.');
    error.status = 400;
    throw error;
  }

  const status = new Status({ name: name.trim(), description: description?.trim() || '' });
  return await status.save();
};

/**
 * Activa o desactiva un estado (invierte `isActive`).
 *
 * @param {string} statusId ObjectId del estado.
 * @returns {Promise<Object>} Estado actualizado.
 * @throws {Error} 400 si el id no es válido, 404 si no existe.
 */
const toggleStatus = async (statusId) => {
  if (!mongoose.Types.ObjectId.isValid(statusId)) {
    const error = new Error('El estado enviado no es válido.');
    error.status = 400;
    throw error;
  }

  const status = await Status.findById(statusId);
  if (!status) {
    const error = new Error('Estado no encontrado.');
    error.status = 404;
    throw error;
  }

  status.isActive = !status.isActive;
  return await status.save();
};

module.exports = { getAllStatuses, createStatus, toggleStatus };