// Generar un middel para hacer el upload a claudinary con las imagenes traidas en el post de incidentes, 
// se debe rescatar la url de la imagen y parsear al objeto de incidente para grabar la url en la DB
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Asegúrate de configurar Cloudinary con tus variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 1. Filtro estricto de formatos admitidos (MIME types)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    // El formato es válido, aceptamos el archivo
    cb(null, true);
  } else {
    // Formato inválido, rechazamos y lanzamos un error claro
    cb(new Error(`Formato no soportado: ${file.mimetype}. Solo se permiten imágenes PNG, JPEG, WEBP o videos MP4.`), false);
  }
};

// Paso 1: Configuración de Multer con almacenamiento en RAM, límites y filtros
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB por seguridad
  fileFilter: fileFilter
});

// Middleware envoltorio para atrapar errores de Multer (tamaño, formato, cantidad)
const handleMulterUpload = (req, res, next) => {
  const multerUpload = upload.array('photos', 3);
  
  multerUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: 'Error de validación al cargar el archivo', 
        error: err.message 
      });
    }
    next();
  });
};

// Pasos 2 y 3: Lógica de subida y parseo
const processIncidentData = async (req, res, next) => {
  try {
    // Paso 2: Subir cada archivo a Cloudinary
    if (req.files && req.files.length > 0) {
      const urls = await Promise.all(
        req.files.map((file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { 
                folder: 'cityfixer/incidents',
                resource_type: 'auto', // Permite que Cloudinary acepte videos automáticamente
                timeout: 120000        // Aumenta el tiempo límite a 120 segundos para evitar el error 499
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result.secure_url);
                }
              }
            ).end(file.buffer);
          })
        )
      );
      req.body.photos = urls; // Inyecta las URLs generadas
    } else {
      req.body.photos = []; // Si no hay fotos, aseguramos que sea un array vacío
    }

    // Paso 3: Parsear location de JSON string a objeto
    if (req.body.location && typeof req.body.location === 'string') {
      req.body.location = JSON.parse(req.body.location);
    }

    // Todo listo, pasamos el objeto req limpio al Controller
    next();
  } catch (error) {
    console.error('Error en uploadToCloudinary middleware:', error);
    return res.status(500).json({ 
      message: 'Error procesando los datos o subiendo archivos (Timeout)', 
      error: error.message,
      // Agregamos el volcado de datos aquí
      debugInfo: {
        bodyRecibido: req.body,
        archivosRecibidos: req.files ? req.files.map(f => ({ nombre: f.originalname, tamaño: f.size, tipo: f.mimetype })) : []
      }
    });
  }
};

// Exportamos usando nuestro nuevo envoltorio en lugar de `upload.array` directamente
module.exports = [handleMulterUpload, processIncidentData];