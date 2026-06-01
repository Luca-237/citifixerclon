const { createIncident, getIncidentsByUser, getAllIncidents, getIncidentHistory, updateIncidentStatus, updateIncidentCategory, updateIncidentPriority, cancelIncident } = require('../services/incident.service');
const Status = require('../models/status');

const create = async (req, res) => {
  try {
    const incident = await createIncident(req.body, req.dbUser._id, req.finalStatusId, req.aiData, req.dbUser.role);
    
    // Si la IA lo catalogó como emergencia, enviamos la alerta al front
    if (req.aiData.isEmergency) {
       return res.status(201).json({ 
         success: true, 
         incident, 
         isEmergency: true,
         message: 'Atención: Tu reporte fue registrado en el municipio, pero parece ser una emergencia vital. La plataforma no despacha servicios de urgencia. Por favor, comunícate de inmediato con el 100 (Bomberos), 101 (Policía) o 107 (Ambulancia).'
       });
    }

    res.status(201).json({ success: true, incident });
  } catch (error) {
    console.error("🔴 Error interno en el controlador al crear incidente:", error); 
    if (error.status === 400) {
      return res.status(400).json({ error: error.message, details: error.details });
    }
    if (error.status === 200) {
      return res.status(200).json({ success: false, message: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const getMyIncidents = async (req, res) => {
  try {
    const incidents = await getIncidentsByUser(req.dbUser._id);
    res.status(200).json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const getAll = async (req, res) => {
  try {
    const incidents = await getAllIncidents();
    res.status(200).json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const getHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await getIncidentHistory(id);
    res.status(200).json({ success: true, incident });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusId } = req.body;

    const incident = await updateIncidentStatus(id, statusId, req.dbUser._id);
    res.status(200).json({ success: true, incident });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ error: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.body;

    const incident = await updateIncidentCategory(id, categoryId);
    res.status(200).json({ success: true, incident });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ error: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const incident = await updateIncidentPriority(id, priority);
    res.status(200).json({ success: true, incident });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ error: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('dbUser:', req.dbUser);
    const cancelledStatus = await Status.findOne({ name: 'cancelado' });
    if (!cancelledStatus) {
      return res.status(500).json({ error: 'Estado "cancelado" no configurado en el sistema.' });
    }

    const incident = await cancelIncident(id, req.dbUser._id, cancelledStatus._id);
    res.status(200).json({ success: true, incident });
  } catch (error) {
    if (error.status === 403) return res.status(403).json({ error: error.message });
    if (error.status === 404) return res.status(404).json({ error: error.message });
    if (error.status === 409) return res.status(409).json({ error: error.message });
    console.error('Error en cancel:', error); // 👈

    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { create, getMyIncidents, getAll, getHistory, updateStatus, updateCategory, updatePriority, cancel };