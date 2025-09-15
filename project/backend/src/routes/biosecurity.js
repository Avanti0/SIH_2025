const express = require('express');
const auth = require('../middleware/auth');
const Biosecurity = require('../models/Biosecurity');
const Farm = require('../models/Farm');

const router = express.Router();

// Get biosecurity checklist
router.get('/checklist', auth, async (req, res) => {
  try {
    const biosecurity = await Biosecurity.findOne({ userId: req.user._id });
    if (!biosecurity) {
      return res.status(404).json({ message: 'Biosecurity profile not found' });
    }

    res.json({
      checklist: biosecurity.checklist,
      complianceScore: biosecurity.complianceScore,
      lastAssessment: biosecurity.lastAssessment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update checklist item
router.put('/checklist/:itemId', auth, async (req, res) => {
  try {
    const { checked } = req.body;
    const { itemId } = req.params;

    const biosecurity = await Biosecurity.findOne({ userId: req.user._id });
    const item = biosecurity.checklist.id(itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }

    item.checked = checked;
    item.lastUpdated = new Date();

    // Calculate compliance score
    const totalItems = biosecurity.checklist.length;
    const checkedItems = biosecurity.checklist.filter(item => item.checked).length;
    biosecurity.complianceScore = Math.round((checkedItems / totalItems) * 100);
    biosecurity.lastAssessment = new Date();

    await biosecurity.save();

    // Update farm compliance score
    await Farm.findOneAndUpdate(
      { userId: req.user._id },
      { complianceScore: biosecurity.complianceScore }
    );

    res.json({
      message: 'Checklist updated',
      complianceScore: biosecurity.complianceScore
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update entire checklist
router.put('/checklist', auth, async (req, res) => {
  try {
    const { checklist } = req.body;

    const biosecurity = await Biosecurity.findOne({ userId: req.user._id });
    
    // Update checklist items
    checklist.forEach((newItem, index) => {
      if (biosecurity.checklist[index]) {
        biosecurity.checklist[index].checked = newItem.checked;
        biosecurity.checklist[index].lastUpdated = new Date();
      }
    });

    // Calculate compliance score
    const totalItems = biosecurity.checklist.length;
    const checkedItems = biosecurity.checklist.filter(item => item.checked).length;
    biosecurity.complianceScore = Math.round((checkedItems / totalItems) * 100);
    biosecurity.lastAssessment = new Date();

    await biosecurity.save();

    // Update farm compliance score
    await Farm.findOneAndUpdate(
      { userId: req.user._id },
      { complianceScore: biosecurity.complianceScore }
    );

    res.json({
      message: 'Checklist updated successfully',
      complianceScore: biosecurity.complianceScore
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get protocols
router.get('/protocols', auth, async (req, res) => {
  try {
    const biosecurity = await Biosecurity.findOne({ userId: req.user._id });
    res.json({ protocols: biosecurity.protocols });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add custom protocol
router.post('/protocols', auth, async (req, res) => {
  try {
    const { name, steps } = req.body;

    const biosecurity = await Biosecurity.findOne({ userId: req.user._id });
    biosecurity.protocols.push({
      name,
      steps,
      isActive: true,
      createdAt: new Date()
    });

    await biosecurity.save();
    res.json({ message: 'Protocol added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
