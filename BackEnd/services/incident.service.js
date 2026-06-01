const Incident = require('../models/incident');
const Status = require('../models/status');
const DuplicateIncident = require('../models/duplicateIncident'); // <-- QUE NO FALTE ESTA LÍNEA
const mongoose = require('mongoose');

// ==========================================
// 1. VALIDACIONES
// ==========================================

const validateIncidentData = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('El título es obligatorio y debe ser un texto.');
  } else if (data.title.trim().length === 0) {
    errors.push('El título no puede estar vacío o contener solo espacios.');
  } else if (data.title.trim().length > 100) {
    errors.push('El título no puede exceder los 100 caracteres.');
  }

  if (!data.description || typeof data.description !== 'string') {
    errors.push('La descripción es obligatoria y debe ser un texto.');
  } else if (data.description.trim().length === 0) {
    errors.push('La descripción no puede estar vacía o contener solo espacios.');
  } else if (data.description.trim().length > 1000) {
    errors.push('La descripción no puede exceder los 1000 caracteres.');
  }

  if (!data.category) {
    errors.push('La categoría es obligatoria.');
  } else if (!mongoose.Types.ObjectId.isValid(data.category)) {
    errors.push('La categoría enviada no es válida.');
  }

  if (!Array.isArray(data.photos) || data.photos.length < 1 || data.photos.length > 3) {
    errors.push('Se requiere entre 1 y 3 fotos.');
  }

  if (!data.location?.lat || !data.location?.lng) {
    errors.push('La ubicación es obligatoria.');
  }

  return { isValid: errors.length === 0, errors };
};

// ==========================================
// 2. CREACIÓN (Por usuario o admin)
// ==========================================

const createIncident = async (incidentData, userId, finalStatusId, aiData, userRole = 'user') => {
  const validation = validateIncidentData(incidentData);
  if (!validation.isValid) {
    const error = new Error('Error en los datos del formulario');
    error.status = 400;
    error.details = validation.errors;
    throw error;
  }

  // 1. Configuración para el Historial (statusHistory)
  const isAI = aiData?.isAI === true;
  const changedBy = isAI ? process.env.AI_USER_ID : userId;
  const source = isAI ? 'ai' : userRole === 'admin' ? 'admin' : 'user';

  // 2. Limpieza del ID original (evita que Mongoose crashee si la IA devuelve nulos)
  let originalIncidentId = undefined;
  if (aiData?.idIncidenteOriginal && aiData.idIncidenteOriginal !== "null" && aiData.idIncidenteOriginal !== "undefined") {
    originalIncidentId = aiData.idIncidenteOriginal;
  }

  // 3. Creación del Incidente
const newIncident = new Incident({
    title: incidentData.title.trim(),
    description: incidentData.description.trim(),
    status: finalStatusId,
    category: incidentData.category,
    location: incidentData.location,
    photos: incidentData.photos,
    user: userId,
    priority: aiData?.prioridad || 1,
    ai_justification: aiData?.justificacion || 'No justificado',
    ai_suggested_category: aiData?.categoriaSugerida || 'No sugerida',
    is_duplicate: aiData?.esDuplicado || false,
    is_emergency: aiData?.isEmergency || false, // <-- SE GUARDA EN LA DB
    statusHistory: [{ status: finalStatusId, changedBy, source }]
  });

  // Solo inyectamos el atributo relacional si obtuvimos un ObjectId válido
  if (originalIncidentId) {
    newIncident.original_incident = originalIncidentId;
  }

  const savedIncident = await newIncident.save();

  // 4. Lógica de Duplicados y Prioridad Masiva
  if (aiData?.esDuplicado && originalIncidentId) {
    let duplicateRecord = await DuplicateIncident.findOne({ original_incident: originalIncidentId });
    
    if (!duplicateRecord) {
      duplicateRecord = new DuplicateIncident({
        original_incident: originalIncidentId,
        duplicates: [savedIncident._id]
      });
    } else {
      duplicateRecord.duplicates.push(savedIncident._id);
    }
    await duplicateRecord.save();

    const allIdsToUpdate = [originalIncidentId, ...duplicateRecord.duplicates];

    // Subir prioridad (+1) masivamente a todos los duplicados
    await Incident.updateMany(
      { _id: { $in: allIdsToUpdate }, priority: { $lt: 5 } },
      { $inc: { priority: 1 } }
    );
  }

  return savedIncident;
};
// ==========================================
// 3. LECTURA / CONSULTAS
// ==========================================

const getIncidentsByUser = async (userId) => {
  const incidents = await Incident.find({ user: userId })
    .populate('category')
    .populate('status')
    .sort({ createdAt: -1 });

  return incidents.map(incident => {
    if (incident.status?.name === 'dudoso') {
      incident.status = { ...incident.status.toObject(), name: 'pendiente' };
    }
    return incident;
  });
};

const getAllIncidents = async () => {
  return await Incident.find()
    .populate('category')
    .populate('status')
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

const getIncidentHistory = async (incidentId) => {
  const incident = await Incident.findById(incidentId)
    .select('title statusHistory')
    .populate('statusHistory.status', 'name description')
    .populate('statusHistory.changedBy', 'firstName lastName email role');

  if (!incident) {
    const error = new Error('Incidente no encontrado');
    error.status = 404;
    throw error;
  }

  return incident;
};

// ==========================================
// 4. ACTUALIZACIÓN (Solo Admin)
// ==========================================

const updateIncidentStatus = async (incidentId, newStatusId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(newStatusId)) {
    const error = new Error('El estado enviado no es válido.');
    error.status = 400;
    throw error;
  }

  const updated = await Incident.findByIdAndUpdate(
    incidentId,
    {
      $set: { status: newStatusId },
      $push: { statusHistory: { status: newStatusId, changedBy: userId, source: 'admin' } }
    },
    { returnDocument: 'after' }
  );

  if (!updated) {
    const error = new Error('Incidente no encontrado');
    error.status = 404;
    throw error;
  }

  return updated;
};

const updateIncidentCategory = async (incidentId, newCategory) => {
  if (!mongoose.Types.ObjectId.isValid(newCategory)) {
    const error = new Error('La categoría enviada no es válida.');
    error.status = 400;
    throw error;
  }

  const updated = await Incident.findByIdAndUpdate(
    incidentId,
    { $set: { category: newCategory } },
    { returnDocument: 'after' }
  );

  if (!updated) {
    const error = new Error('Incidente no encontrado');
    error.status = 404;
    throw error;
  }

  return updated;
};

const updateIncidentPriority = async (incidentId, priority) => {
  const value = Number(priority);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    const error = new Error('La prioridad debe ser un número entero entre 1 y 5.');
    error.status = 400;
    throw error;
  }

  const updated = await Incident.findByIdAndUpdate(
    incidentId,
    { $set: { priority: value } },
    { returnDocument: 'after' }
  );

  if (!updated) {
    const error = new Error('Incidente no encontrado');
    error.status = 404;
    throw error;
  }

  return updated;
};
// ==========================================
// 5. CANCELACIÓN (Solo el usuario dueño)
// ==========================================

const CANCELLABLE_STATUSES = ['pendiente', 'dudoso', 'aceptado'];

const cancelIncident = async (incidentId, userId) => {
  const incident = await Incident.findById(incidentId)
    .populate('status');

  if (!incident) {
    const error = new Error('Incidente no encontrado.');
    error.status = 404;
    throw error;
  }

  if (incident.user.toString() !== userId.toString()) {
    const error = new Error('No tenés permiso para cancelar este incidente.');
    error.status = 403;
    throw error;
  }

  const currentStatusName = incident.status?.name?.toLowerCase();
  if (!CANCELLABLE_STATUSES.includes(currentStatusName)) {
    const error = new Error('El incidente no puede cancelarse en su estado actual.');
    error.status = 409;
    throw error;
  }

  const cancelledStatus = await Status.findOne({ name: 'cancelado' });
  if (!cancelledStatus) {
    const error = new Error('Estado "cancelado" no encontrado en el sistema.');
    error.status = 500;
    throw error;
  }

  const updated = await Incident.findByIdAndUpdate(
    incidentId,
    {
      $set: { status: cancelledStatus._id },
      $push: { statusHistory: { status: cancelledStatus._id, changedBy: userId, source: 'user' } }
    },
    { returnDocument: 'after' }
  );

  return updated;
};

// ==========================================
// EXPORTACIONES
// ==========================================

module.exports = {
  validateIncidentData,
  createIncident,
  getIncidentsByUser,
  getAllIncidents,
  getIncidentHistory,
  updateIncidentStatus,
  updateIncidentCategory,
  updateIncidentPriority, 
  cancelIncident
};