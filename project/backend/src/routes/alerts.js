const express = require('express');
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');

const router = express.Router();

// Get all active alerts
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort({ createdAt: -1 });

    res.json({ alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get alerts by location (for geo-targeting)
router.get('/location/:location', auth, async (req, res) => {
  try {
    const { location } = req.params;
    
    const alerts = await Alert.find({
      isActive: true,
      location: { $regex: location, $options: 'i' },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort({ createdAt: -1 });

    res.json({ alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new alert (admin function)
router.post('/', auth, async (req, res) => {
  try {
    const { title, message, type, location, disease, severity, expiresAt } = req.body;

    const alert = new Alert({
      title,
      message,
      type,
      location,
      disease,
      severity,
      expiresAt
    });

    await alert.save();
    res.status(201).json({ message: 'Alert created successfully', alert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark alert as read/inactive
router.put('/:alertId/read', auth, async (req, res) => {
  try {
    const { alertId } = req.params;
    
    await Alert.findByIdAndUpdate(alertId, { isActive: false });
    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get alert statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments({ isActive: true });
    const criticalAlerts = await Alert.countDocuments({ 
      isActive: true, 
      severity: 'critical' 
    });
    const warningAlerts = await Alert.countDocuments({ 
      isActive: true, 
      type: 'warning' 
    });

    res.json({
      totalAlerts,
      criticalAlerts,
      warningAlerts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
