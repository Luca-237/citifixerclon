const { getAllCategories, createCategory, updateCategory, toggleCategory } = require('../services/category.service');
const { respondError } = require('../utils/logger');

const getAll = async (req, res) => {
  try {
    const filter = (req.filter && typeof req.filter === 'object') ? req.filter : {};
    const categories = await getAllCategories(filter);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    respondError(res, error, { context: 'categories.getAll', inputs: { filter: req.filter } });
  }
};

const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await createCategory({ name, description });
    res.status(201).json({ success: true, category });
  } catch (error) {
    respondError(res, error, { context: 'categories.create', inputs: { name: req.body.name, description: req.body.description } });
  }
};

const toggle = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await toggleCategory(id);
    res.status(200).json({ success: true, category });
  } catch (error) {
    respondError(res, error, { context: 'categories.toggle', inputs: { categoryId: req.params.id } });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    const category = await updateCategory(id, { name, description, isActive });
    res.status(200).json({ success: true, category });
  } catch (error) {
    respondError(res, error, { context: 'categories.update', inputs: { categoryId: req.params.id, body: req.body } });
  }
};

module.exports = { getAll, create, update, toggle };
