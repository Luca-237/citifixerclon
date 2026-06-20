const express = require('express');
const router = express.Router();
const { fetchNeighborhoods } = require('../controllers/neighborhood.controller');

/**
 * @openapi
 * /api/neighborhoods:
 *   get:
 *     summary: Listar barrios
 *     description: Devuelve los barrios disponibles (datos geográficos). Endpoint público.
 *     tags: [Neighborhoods]
 *     security: []
 *     responses:
 *       200: { description: Lista de barrios }
 */
router.get('/', fetchNeighborhoods);

module.exports = router;
