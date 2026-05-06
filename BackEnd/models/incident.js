/// Esquema de incidente con historial y prioridades
const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder los 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder los 1000 caracteres']
  },
  status: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'resuelto'],
    default: 'pendiente'
  },
  // Base preparada para las fotos (A acomodar a futuro con Cloudinary)
  photos: [{
    type: String, // Aquí guardaremos las URLs de las imágenes
    default: []
  }],
  // Base preparada para la ubicación (A acomodar a futuro con mapas/geolocalización)
  location: {
    lat: {
      type: Number,
      required: false
    },
    lng: {
      type: Number,
      required: false
    },
    address: {
      type: String,
      required: false,
      trim: true
    }
  },
  // Relación con el usuario que reportó la situación
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Incident', incidentSchema);