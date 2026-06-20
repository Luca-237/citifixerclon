/// Registro centralizado de errores y logging para debugging.
/// Objetivo: que ante cualquier error sepamos QUÉ endpoint falló, con qué STATUS,
/// el MENSAJE real, el STACK (solo en 500) y los DATOS que entraron/salieron,
/// con los campos sensibles redactados para no exponer secretos en los logs.

// Enmascara un email dejando visible la primera letra y el dominio: "luca@gmail.com" -> "l***@gmail.com"
const maskEmail = (value) => {
  if (typeof value !== 'string' || !value.includes('@')) return '***';
  const [user, domain] = value.split('@');
  return `${user.slice(0, 1)}***@${domain}`;
};

// Deja visibles solo los últimos 2 caracteres: "12345678" -> "***78"
const maskTail = (value) => {
  const str = String(value);
  return str.length <= 2 ? '***' : `***${str.slice(-2)}`;
};

// Por clave: cómo se redacta cada campo sensible.
const REDACTORS = {
  email: maskEmail,
  dni: maskTail,
  telefono: maskTail,
  otp: () => '***',
  otpCode: () => '***',
  code: () => '***',
  verificationToken: () => '***',
  token: () => '***',
  password: () => '***',
  apiKey: () => '***'
};

// Recorre el objeto recursivamente y redacta los campos sensibles.
const redact = (value) => {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      if (val == null) out[key] = val;
      else if (REDACTORS[key]) out[key] = REDACTORS[key](val);
      else out[key] = redact(val);
    }
    return out;
  }
  return value;
};

/**
 * Loguea un error con contexto, redactando campos sensibles. El stack solo se
 * imprime en errores inesperados (status >= 500).
 *
 * @param {string} context Identificador del origen (ej. 'incidents.create').
 * @param {Error}  error   Error capturado (puede tener `.status`).
 * @param {Object} [extra={}] Contexto a loguear, normalmente `{ inputs }` u `{ outputs }`.
 * @returns {void}
 */
const logError = (context, error, extra = {}) => {
  const ts = new Date().toISOString();
  const status = error?.status || 500;
  console.error(`\n🔴 [${ts}] [${context}] (${status}) ${error?.message || 'Error desconocido'}`);
  if (extra && Object.keys(extra).length > 0) {
    console.error('   ↳ contexto:', JSON.stringify(redact(extra), null, 2));
  }
  // El stack solo aporta en errores inesperados (500); en 4xx el mensaje ya alcanza.
  if (status >= 500 && error?.stack) {
    console.error(error.stack);
  }
};

/**
 * Loguea el error y responde al cliente de forma consistente.
 * - 4xx: devuelve `error.message` (y `details` si los hay) — info útil para el usuario.
 * - 5xx: devuelve un mensaje genérico; el detalle real queda solo en consola.
 *
 * @param {import('express').Response} res Respuesta de Express.
 * @param {Error} error Error capturado (puede tener `.status` y `.details`).
 * @param {Object} [opts]
 * @param {string} [opts.context='desconocido'] Identificador del origen para el log.
 * @param {*} [opts.inputs] Datos de entrada a incluir en el log (se redactan).
 * @returns {import('express').Response} La respuesta enviada.
 */
const respondError = (res, error, { context = 'desconocido', inputs } = {}) => {
  logError(context, error, inputs !== undefined ? { inputs } : {});
  const status = error?.status || 500;
  if (status >= 500) {
    return res.status(status).json({ error: 'Error interno del servidor.' });
  }
  return res.status(status).json({
    error: error.message,
    ...(error.details && { details: error.details })
  });
};

module.exports = { logError, respondError, redact };
