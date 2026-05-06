//Crud y gestion de Incidentes
const { uploadImageToCloudinary } = require('../services/cludinary.service');
const { createIncident } = require('../services/incident.service');

const createIncidentController = async (req, res) => {
  try {
    const userId = req.auth.userId; // Obtenido del token de Clerk (verifyToken.js)
    
    // 1. Subir todas las fotos a Cloudinary y obtener sus URLs
    const photosUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImageToCloudinary(file.buffer);
        photosUrls.push(url);
      }
    }

    // 2. Construir el objeto de datos recibidos del FormData (req.body)
    const incidentData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      photos: photosUrls, // Insertamos el array de URLs
      location: {
        // FormData envía todo como texto, lo convertimos a números
        lat: req.body.lat ? parseFloat(req.body.lat) : undefined,
        lng: req.body.lng ? parseFloat(req.body.lng) : undefined,
        address: req.body.address || ''
      }
    };

    // 3. Llamar al servicio que valida y guarda en MongoDB
    const newIncident = await createIncident(incidentData, userId);

    res.status(201).json({ success: true, data: newIncident });

  } catch (error) {
    console.error('Error creando incidente:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message, details: error.details });
  }
};