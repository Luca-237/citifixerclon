const Incident = require('../models/incident');
const Status = require('../models/status');
const User = require('../models/user');
const { analizarIncidenteIA } = require('../services/openai.service');

const calcularDistanciaMetros = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad; const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const aiIncidentValidation = async (req, res, next) => {
  try {
    const userId = req.dbUser._id;
    const { title, description, location } = req.body;

    const [pendienteStatus, dudosoStatus, rechazadoStatus, enProcesoStatus] = await Promise.all([
      Status.findOne({ name: 'pendiente' }), Status.findOne({ name: 'dudoso' }),
      Status.findOne({ name: 'rechazado' }), Status.findOne({ name: 'en_proceso' })
    ]);

    if (!pendienteStatus || !dudosoStatus || !rechazadoStatus) return res.status(500).json({ error: 'Faltan estados requeridos.' });

    // Validar límite de dudosos...
    const dudososCount = await Incident.countDocuments({ user: userId, status: dudosoStatus._id });
    if (dudososCount >= 5) {
      await User.findByIdAndUpdate(userId, { $set: { isBanned: true } });
      return res.status(200).json({ success: false, message: 'Cuenta suspendida por acumular reportes dudosos.' });
    } else {
      await User.findByIdAndUpdate(userId, { $set: { isBanned: false } });
    }

    // Buscar incidentes a menos de 20 metros, INCLUYENDO EL _id
    let incidentesCercanos = [];
    if (location && location.lat && location.lng) {
      const statusActivos = [pendienteStatus._id];
      if (enProcesoStatus) statusActivos.push(enProcesoStatus._id);

      const activos = await Incident.find({ status: { $in: statusActivos } }).select('_id title description location');

      incidentesCercanos = activos.filter(inc => {
        if (!inc.location?.lat || !inc.location?.lng) return false;
        return calcularDistanciaMetros(location.lat, location.lng, inc.location.lat, inc.location.lng) <= 20;
      }).map(inc => ({ _id: inc._id, title: inc.title, description: inc.description }));
    }

    const evaluacionIA = await analizarIncidenteIA(title, description, incidentesCercanos);

    if (evaluacionIA.estadoSugerido === 'rechazado') {
      return res.status(200).json({
        success: false, isEmergency: true,
        message: 'Emergencia detectada. Llama al 100, 101 o 107.', justificacion: evaluacionIA.justificacion
      });
    }

    req.finalStatusId = evaluacionIA.estadoSugerido === 'dudoso' ? dudosoStatus._id : pendienteStatus._id;
    
    // Empaquetar TODOS los datos para que el servicio los procese
    req.aiData = {
      prioridad: evaluacionIA.prioridadSugerida || 1,
      categoriaSugerida: evaluacionIA.categoriaSugerida,
      justificacion: evaluacionIA.justificacion,
      esDuplicado: evaluacionIA.esDuplicado,
      idIncidenteOriginal: evaluacionIA.idIncidenteOriginal
    };

    next();
  } catch (error) {
    console.error("Error validación IA:", error);
    return res.status(500).json({ error: 'Error en servidor al validar incidente.' });
  }
};

module.exports = { aiIncidentValidation };