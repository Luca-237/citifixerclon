const Category = require('../models/category');
const mongoose = require('mongoose');

/**
 * Lista categorías ordenadas por nombre, opcionalmente filtradas.
 *
 * @param {Object} [filter={}] Filtro Mongoose (ej. `{ isActive: true }`).
 * @returns {Promise<Array>} Categorías encontradas.
 */
const getAllCategories = async (filter = {}) => {
  return await Category.find(filter).sort({ name: 1 });
};

/**
 * Crea una categoría validando longitud de descripción y nombre único.
 *
 * @param {Object} data
 * @param {string} data.name          Nombre de la categoría.
 * @param {string} [data.description] Descripción (máx. 100 caracteres).
 * @returns {Promise<Object>} Categoría creada.
 * @throws {Error} 400 si la descripción excede 100 caracteres o el nombre ya existe.
 */
const createCategory = async ({ name, description }) => {
  if (description && description.trim().length > 100) {
    const error = new Error('La descripción no puede exceder los 100 caracteres.');
    error.status = 400;
    throw error;
  }

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    const error = new Error('Ya existe una categoría con ese nombre.');
    error.status = 400;
    throw error;
  }

  const category = new Category({ name: name.trim(), description: description?.trim() || '' });
  return await category.save();
};

/**
 * Actualiza una categoría. Solo modifica los campos provistos.
 *
 * @param {string} categoryId ObjectId de la categoría.
 * @param {Object} data
 * @param {string} [data.name]        Nuevo nombre (se valida unicidad).
 * @param {string} [data.description] Nueva descripción (máx. 100 caracteres).
 * @param {boolean} [data.isActive]   Nuevo estado activo/inactivo.
 * @returns {Promise<Object>} Categoría actualizada.
 * @throws {Error} 400 id inválido / descripción larga / nombre duplicado; 404 si no existe.
 */
const updateCategory = async (categoryId, { name, description, isActive }) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error('La categoría enviada no es válida.');
    error.status = 400;
    throw error;
  }

  if (description !== undefined && description.trim().length > 100) {
    const error = new Error('La descripción no puede exceder los 100 caracteres.');
    error.status = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error('Categoría no encontrada.');
    error.status = 404;
    throw error;
  }

  if (name !== undefined) {
    const trimmed = name.trim();
    const existing = await Category.findOne({ name: trimmed, _id: { $ne: categoryId } });
    if (existing) {
      const error = new Error('Ya existe una categoría con ese nombre.');
      error.status = 400;
      throw error;
    }
    category.name = trimmed;
  }

  if (description !== undefined) category.description = description.trim();
  if (isActive !== undefined) category.isActive = isActive;

  return await category.save();
};

/**
 * Activa o desactiva una categoría (invierte `isActive`).
 *
 * @param {string} categoryId ObjectId de la categoría.
 * @returns {Promise<Object>} Categoría actualizada.
 * @throws {Error} 400 si el id no es válido, 404 si no existe.
 */
const toggleCategory = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error('La categoría enviada no es válida.');
    error.status = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error('Categoría no encontrada.');
    error.status = 404;
    throw error;
  }

  category.isActive = !category.isActive;
  return await category.save();
};

module.exports = { getAllCategories, createCategory, updateCategory, toggleCategory };