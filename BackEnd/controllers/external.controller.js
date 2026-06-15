const { requestExternalOtp, validateExternalOtp, getExternalData } = require('../services/external.service');
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
  console.log(`[external] solicitud de datos — IP: ${ip} — ${new Date().toISOString()}`);
  try {
    await validateExternalOtp(req.otpCode);
    const data = await getExternalData();
    console.log(`[external] datos entregados — IP: ${ip}`);
    res.status(200).json({ success: true, data });
  } catch (error) {
    // Dejamos rastro del rechazo con la IP que lo intentó (el OTP se redacta solo).
    respondError(res, error, { context: 'external.getData', inputs: { ip, otpCode: req.otpCode } });
  }
};

module.exports = { requestOtp, getData };
