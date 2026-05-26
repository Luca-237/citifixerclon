const Incident = require('../models/incident');
const Status = require('../models/status');
const User = require('../models/user');
const { analizarIncidenteIA } = require('../services/openai.service');

const aiIncidentValidation = async (req, res, next) => {
  try {
    const userId = req.dbUser._id;
    const { title, description } = req.body;

    // 1. Buscar los estados necesarios en el "registro maestro"
    const [pendienteStatus, dudosoStatus, rechazadoStatus] = await Promise.all([
      Status.findOne({ name: 'pendiente' }),
      Status.findOne({ name: 'dudoso' }),
      Status.findOne({ name: 'rechazado' })
    ]);

    if (!pendienteStatus || !dudosoStatus || !rechazadoStatus) {
      return res.status(500).json({ error: 'Faltan estados requeridos en el "registro maestro".' });
    }

    // 2. Contar los incidentes en estado 'dudoso' actuales del usuario
    const dudososCount = await Incident.countDocuments({
      user: userId,
      status: dudosoStatus._id
    });

    // 3. Evaluar y actualizar dinámicamente el estado isBanned del usuario
    if (dudososCount >= 5) {
      // Si tiene 5 o más reportes dudosos, aseguramos su estado como baneado
      await User.findByIdAndUpdate(userId, { $set: { isBanned: true } });

      return res.status(200).json({
        success: false,
        message: 'No es posible subir el incidente. Tu cuenta ha sido suspendida temporalmente debido a la acumulación de 5 o más reportes marcados como dudosos.'
      });
    } else {
      // Si tiene menos de 5, nos aseguramos de que isBanned permanezca en false
      await User.findByIdAndUpdate(userId, { $set: { isBanned: false } });
    }

    // 4. Validar el contenido del nuevo incidente utilizando la IA (Gemini)
    const evaluacionIA = await analizarIncidenteIA(title, description);

    // 5. Interceptar emergencias críticas inmediatamente (Estado: Rechazado)
    if (evaluacionIA.estadoSugerido === 'rechazado') {
      return res.status(200).json({
        success: false,
        isEmergency: true,
        message: 'Este reporte describe una situación de emergencia médica o de seguridad vital. Por favor, comunícate de inmediato con el 100 (Bomberos), 101 (Policía) o 107 (Ambulancia). La plataforma no procesa urgencias en tiempo real.',
        justificacion: evaluacionIA.justificacion
      });
    }

    // 6. Asignar el estado definitivo del incidente para el siguiente paso del flujo
    req.finalStatusId = evaluacionIA.estadoSugerido === 'dudoso' ? dudosoStatus._id : pendienteStatus._id;
    
    // 7. Empaquetar los metadatos analizados por la IA en el objeto req
    req.aiData = {
      prioridad: evaluacionIA.prioridadSugerida,
      categoriaSugerida: evaluacionIA.categoriaSugerida,
      justificacion: evaluacionIA.justificacion
    };

    next();
  } catch (error) {
    console.error("Error en el middleware de validación por IA:", error);
    return res.status(500).json({ error: 'Error interno en el servidor al validar el incidente con Inteligencia Artificial.' });
  }
};

module.exports = { aiIncidentValidation };