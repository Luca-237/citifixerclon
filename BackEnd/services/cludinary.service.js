/// Subida y consultas a la api de Cloudinary
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configuración con tus credenciales (deben ir en tu .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube un buffer de imagen a Cloudinary
 * @param {Buffer} fileBuffer - El archivo desde la memoria (req.files[i].buffer)
 * @returns {Promise<String>} - URL segura de la imagen
 */
const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'cityflow_incidents' }, // Crea esta carpeta en tu Cloudinary
      (error, result) => {
        if (result) {
          resolve(result.secure_url); // Retornamos solo la URL pública
        } else {
          reject(error);
        }
      }
    );
    // Convertimos el buffer a stream y lo enviamos a Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { uploadImageToCloudinary };