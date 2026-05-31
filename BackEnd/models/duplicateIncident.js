const mongoose = require('mongoose');

const duplicateIncidentSchema = new mongoose.Schema({
  original_incident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: true,
    unique: true
  },
  duplicates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('DuplicateIncident', duplicateIncidentSchema);