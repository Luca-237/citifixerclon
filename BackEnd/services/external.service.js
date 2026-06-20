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

const getStatuses = async () => {
  const statuses = await Status.find().sort({ name: 1 });
  return statuses.map(s => ({
    id: s._id,
    name: s.name,
    description: s.description
  }));
};

const getCategories = async () => {
  const categories = await Category.find().sort({ name: 1 });
  return categories.map(c => ({
    id: c._id,
    name: c.name,
    description: c.description
  }));
};

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
