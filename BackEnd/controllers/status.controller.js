const { getAllStatuses, createStatus, toggleStatus } = require('../services/status.service');
const { respondError } = require('../utils/logger');

const getAll = async (req, res) => {
  try {
    const filter = (req.filter && typeof req.filter === 'object') ? req.filter : {};
    const statuses = await getAllStatuses(filter);
    res.status(200).json({ success: true, statuses });
  } catch (error) {
    respondError(res, error, { context: 'statuses.getAll', inputs: { filter: req.filter } });
  }
};

const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const status = await createStatus({ name, description });
    res.status(201).json({ success: true, status });
  } catch (error) {
    respondError(res, error, { context: 'statuses.create', inputs: { name: req.body.name, description: req.body.description } });
  }
};

const toggle = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await toggleStatus(id);
    res.status(200).json({ success: true, status });
  } catch (error) {
    respondError(res, error, { context: 'statuses.toggle', inputs: { statusId: req.params.id } });
  }
};

module.exports = { getAll, create, toggle };
