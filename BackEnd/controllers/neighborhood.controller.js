const { getNeighborhoods } = require('../services/neighborhood.service');
const { respondError } = require('../utils/logger');

const fetchNeighborhoods = async (req, res) => {
  try {
    const neighborhoods = await getNeighborhoods();
    res.status(200).json({ success: true, neighborhoods });
  } catch (error) {
    respondError(res, error, { context: 'neighborhoods.fetch' });
  }
};

module.exports = { fetchNeighborhoods };
