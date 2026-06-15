const { upsertUser } = require('../services/clerk.service.js');
const { respondError } = require('../utils/logger');

const registerUser = async (req, res) => {
  try {
    const { email, firstName, lastName, imageUrl, dni } = req.body;
    const clerkId = req.clerkUserId;

    const user = await upsertUser({ clerkId, email, firstName, lastName, imageUrl, dni });
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Endpoint crítico de autenticación: logueamos qué entró (email/dni redactados) para diagnosticar.
    respondError(res, error, { context: 'auth.registerUser', inputs: { clerkId: req.clerkUserId, email: req.body.email, dni: req.body.dni } });
  }
};

module.exports = { registerUser };
