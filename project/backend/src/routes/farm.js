const express = require('express');
const auth = require('../middleware/auth');
const Farm = require('../models/Farm');

const router = express.Router();

// Get farm dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({ userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json({
      totalAnimals: farm.totalAnimals,
      healthyAnimals: farm.healthyAnimals,
      sickAnimals: farm.sickAnimals,
      lastInspection: farm.lastInspection,
      complianceScore: farm.complianceScore,
      productionRecords: farm.productionRecords.slice(-5), // Last 5 records
      feedRecords: farm.feedRecords.slice(-5),
      healthRecords: farm.healthRecords.slice(-5)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update farm statistics
router.put('/stats', auth, async (req, res) => {
  try {
    const { totalAnimals, healthyAnimals, sickAnimals } = req.body;
    
    const farm = await Farm.findOneAndUpdate(
      { userId: req.user._id },
      {
        totalAnimals,
        healthyAnimals,
        sickAnimals,
        lastInspection: new Date()
      },
      { new: true }
    );

    res.json({ message: 'Farm statistics updated', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add production record
router.post('/production', auth, async (req, res) => {
  try {
    const { eggs, milk, weight, notes } = req.body;
    
    const farm = await Farm.findOne({ userId: req.user._id });
    farm.productionRecords.push({
      date: new Date(),
      eggs,
      milk,
      weight,
      notes
    });
    
    await farm.save();
    res.json({ message: 'Production record added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add feed record
router.post('/feed', auth, async (req, res) => {
  try {
    const { feedType, quantity, cost } = req.body;
    
    const farm = await Farm.findOne({ userId: req.user._id });
    farm.feedRecords.push({
      date: new Date(),
      feedType,
      quantity,
      cost
    });
    
    await farm.save();
    res.json({ message: 'Feed record added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add health record
router.post('/health', auth, async (req, res) => {
  try {
    const { animalId, symptoms, treatment, veterinarian } = req.body;
    
    const farm = await Farm.findOne({ userId: req.user._id });
    farm.healthRecords.push({
      date: new Date(),
      animalId,
      symptoms,
      treatment,
      veterinarian
    });
    
    await farm.save();
    res.json({ message: 'Health record added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
