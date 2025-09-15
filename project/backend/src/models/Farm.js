const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalAnimals: {
    type: Number,
    default: 0
  },
  healthyAnimals: {
    type: Number,
    default: 0
  },
  sickAnimals: {
    type: Number,
    default: 0
  },
  lastInspection: {
    type: Date,
    default: Date.now
  },
  complianceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  productionRecords: [{
    date: Date,
    eggs: Number,
    milk: Number,
    weight: Number,
    notes: String
  }],
  feedRecords: [{
    date: Date,
    feedType: String,
    quantity: Number,
    cost: Number
  }],
  healthRecords: [{
    date: Date,
    animalId: String,
    symptoms: String,
    treatment: String,
    veterinarian: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Farm', farmSchema);
