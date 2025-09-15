const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['warning', 'danger', 'info', 'success'],
    default: 'info'
  },
  location: {
    type: String,
    required: true
  },
  disease: {
    type: String
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
