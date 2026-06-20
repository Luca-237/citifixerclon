const Neighborhood = require('../models/neighborhood');

/**
 * Devuelve todos los barrios ordenados alfabéticamente (solo el campo `name`).
 *
 * @returns {Promise<Array>} Lista de barrios con su nombre.
 */
const getNeighborhoods = async () => {
  return await Neighborhood.find({}, 'name').sort({ name: 1 });
};

module.exports = { getNeighborhoods };
