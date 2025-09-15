const mongoose = require('mongoose');

const biosecuritySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checklist: [{
    item: String,
    checked: Boolean,
    critical: Boolean,
    lastUpdated: Date
  }],
  complianceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAssessment: {
    type: Date,
    default: Date.now
  },
  protocols: [{
    name: String,
    steps: [String],
    isActive: Boolean,
    createdAt: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Biosecurity', biosecuritySchema);
