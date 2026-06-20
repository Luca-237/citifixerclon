const { requestExternalOtp, validateExternalOtp, getExternalTable } = require('../services/external.service');
const { respondError } = require('../utils/logger');

const requestOtp = async (req, res) => {
  try {
    await requestExternalOtp(req.dbUser._id, req.dbUser.email);
    res.status(200).json({ success: true, message: 'Código enviado al correo.' });
  } catch (error) {
    respondError(res, error, { context: 'external.requestOtp', inputs: { userId: req.dbUser._id, email: req.dbUser.email } });
  }
};

const getData = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const { table } = req.params;
  console.log(`[external] solicitud de datos — tabla: ${table} — IP: ${ip} — ${new Date().toISOString()}`);
  try {
    await validateExternalOtp(req.otpCode);
    const data = await getExternalTable(table);
    console.log(`[external] datos entregados — tabla: ${table} — IP: ${ip}`);
    res.status(200).json({ success: true, table, data });
  } catch (error) {
    // Dejamos rastro del rechazo con la IP y la tabla que se intentó (el OTP se redacta solo).
    respondError(res, error, { context: 'external.getData', inputs: { ip, table, otpCode: req.otpCode } });
  }
};

module.exports = { requestOtp, getData };
