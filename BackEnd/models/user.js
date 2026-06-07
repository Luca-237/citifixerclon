const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    default: null,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  dni: {
    type: String,
    default: null,
    match: /^\d{8}$/
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  telefono: {
    type: String,
    default: null
  },
  direccion: {
    type: String,
    default: null
  },
  ciudad: {
    type: String,
    default: null
  },
  barrio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Neighborhood',
    default: null
  },
  provincia: {
    type: String,
    default: null
  },
  codigoPostal: {
    type: String,
    default: null
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);