const crypto = require('crypto');
const ExternalOtp = require('../models/externalOtp');
const IncidentGroup = require('../models/incidentGroup');
const Incident = require('../models/incident');
const Status = require('../models/status');
const Category = require('../models/category');
const User = require('../models/user');
const Role = require('../models/role');
const { sendExternalOtpEmail } = require('./mail.service');

const OTP_TTL_HOURS = 24;

// ==========================================
// SOLICITUD DE OTP (superAdmin)
// ==========================================

/**
 * Genera un OTP (válido 24 h) para el consumo externo de datos y lo envía por
 * email al superAdmin. Invalida los OTP previos no usados del mismo usuario.
 *
 * @param {string} userId    ObjectId del superAdmin solicitante.
 * @param {string} userEmail Email donde enviar el código.
 * @returns {Promise<void>}
 */
const requestExternalOtp = async (userId, userEmail) => {
  await ExternalOtp.deleteMany({ userId, used: false });

  const code = String(crypto.randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + OTP_TTL_HOURS * 60 * 60 * 1000);

  await ExternalOtp.create({ userId, code, expiresAt });
  await sendExternalOtpEmail(userEmail, code);
};

// ==========================================
// VALIDACIÓN DE OTP (Power BI)
// ==========================================

/**
 * Valida un OTP de consumo externo (debe existir, no estar usado y no haber expirado).
 *
 * @param {string} code Código OTP recibido.
 * @returns {Promise<void>}
 * @throws {Error} 401 si el código es inválido o expiró.
 */
const validateExternalOtp = async (code) => {
  const otp = await ExternalOtp.findOne({ code, used: false });

  if (!otp || otp.expiresAt < new Date()) {
    const error = new Error('Código inválido o expirado.');
    error.status = 401;
    throw error;
  }
};

// ==========================================
// BUILDERS — uno por tabla (una request por tabla)
// ==========================================

// Builders de tablas para Power BI: cada uno aplana un modelo a filas planas.

/**
 * Tabla de grupos de incidentes aplanada (incluye coordenadas del representante).
 * @returns {Promise<Array<Object>>} Filas de grupos.
 */
const getGroups = async () => {
  const groups = await IncidentGroup.find()
    .populate('status', 'name')
    .populate('category', 'name')
    .populate('representativeId', 'location');

  return groups.map(g => ({
    id: g._id,
    status: g.status?.name || null,
    category: g.category?.name || null,
    priority: g.priority,
    incidentCount: g.incidents.length,
    isEmergency: g.is_emergency,
    isArchived: g.isArchived,
    lat: g.representativeId?.location?.lat || null,
    lng: g.representativeId?.location?.lng || null,
    finalizedAt: g.finalizedAt,
    createdAt: g.createdAt
  }));
};

/**
 * Tabla de incidentes individuales aplanada (con datos del usuario reportante).
 * @returns {Promise<Array<Object>>} Filas de incidentes.
 */
const getIncidents = async () => {
  const incidents = await Incident.find()
    .populate('status', 'name')
    .populate('category', 'name')
    .populate('user', 'firstName lastName email dni');

  return incidents.map(i => ({
    id: i._id,
    groupId: i.group,
    status: i.status?.name || null,
    category: i.category?.name || null,
    aiSuggestedCategory: i.ai_suggested_category,
    isDubious: i.is_dubious,
    isCancelled: i.is_cancelled,
    isEmergency: i.is_emergency,
    lat: i.location?.lat || null,
    lng: i.location?.lng || null,
    userName: i.user ? `${i.user.firstName} ${i.user.lastName}`.trim() : null,
    userEmail: i.user?.email || null,
    userDni: i.user?.dni || null,
    createdAt: i.createdAt
  }));
};

/**
 * Tabla de estados aplanada.
 * @returns {Promise<Array<Object>>} Filas de estados.
 */
const getStatuses = async () => {
  const statuses = await Status.find().sort({ name: 1 });
  return statuses.map(s => ({
    id: s._id,
    name: s.name,
    description: s.description
  }));
};

/**
 * Tabla de categorías aplanada.
 * @returns {Promise<Array<Object>>} Filas de categorías.
 */
const getCategories = async () => {
  const categories = await Category.find().sort({ name: 1 });
  return categories.map(c => ({
    id: c._id,
    name: c.name,
    description: c.description
  }));
};

/**
 * Tabla de usuarios aplanada (excluye el usuario de sistema de la IA).
 * @returns {Promise<Array<Object>>} Filas de usuarios.
 */
const getUsers = async () => {
  const aiRole = await Role.findOne({ name: 'ai' });
  const users = await User.find({ role: { $ne: aiRole?._id } })
    .populate('role', 'name')
    .populate('barrio', 'name');

  return users.map(u => ({
    id: u._id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    dni: u.dni,
    telefono: u.telefono,
    role: u.role?.name || null,
    ciudad: u.ciudad,
    barrio: u.barrio?.name || null,
    provincia: u.provincia,
    profileComplete: u.profileComplete,
    isBanned: u.isBanned,
    createdAt: u.createdAt
  }));
};

// ==========================================
// DISPATCHER — lista blanca de tablas
// ==========================================

// Para sumar una tabla nueva: agregás su builder arriba y una línea acá.
const TABLES = {
  groups: getGroups,
  incidents: getIncidents,
  statuses: getStatuses,
  categories: getCategories,
  users: getUsers
};

const AVAILABLE_TABLES = Object.keys(TABLES);

/**
 * Devuelve una tabla de datos para consumo externo, validando contra la lista
 * blanca de tablas (`AVAILABLE_TABLES`).
 *
 * @param {('groups'|'incidents'|'statuses'|'categories'|'users')} table Nombre de la tabla.
 * @returns {Promise<Array<Object>>} Filas de la tabla solicitada.
 * @throws {Error} 400 si la tabla no es válida.
 */
const getExternalTable = async (table) => {
  const builder = TABLES[table];
  if (!builder) {
    const error = new Error(`Tabla inválida. Tablas disponibles: ${AVAILABLE_TABLES.join(', ')}.`);
    error.status = 400;
    throw error;
  }
  return await builder();
};

module.exports = { requestExternalOtp, validateExternalOtp, getExternalTable, AVAILABLE_TABLES };
