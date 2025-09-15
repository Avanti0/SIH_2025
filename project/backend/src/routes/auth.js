const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Biosecurity = require('../models/Biosecurity');

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('mobile').matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('farmType').isIn(['poultry', 'pig', 'both']).withMessage('Invalid farm type'),
  body('farmSize').isNumeric().withMessage('Farm size must be a number'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, mobile, password, farmType, farmSize, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this mobile number' });
    }

    // Create user
    const user = new User({
      name,
      mobile,
      password,
      farmType,
      farmSize,
      location
    });

    await user.save();

    // Create farm profile
    const farm = new Farm({ userId: user._id });
    await farm.save();

    // Create biosecurity profile with default checklist
    const defaultChecklist = [
      { item: 'Footbath at farm entrance', checked: false, critical: true },
      { item: 'Visitor log maintained', checked: false, critical: true },
      { item: 'Animals isolated when sick', checked: false, critical: true },
      { item: 'Feed storage properly secured', checked: false, critical: false },
      { item: 'Water sources protected', checked: false, critical: true },
      { item: 'Waste disposal system in place', checked: false, critical: true },
      { item: 'Regular cleaning schedule followed', checked: false, critical: false },
      { item: 'Vaccination records updated', checked: false, critical: true },
      { item: 'Equipment disinfected regularly', checked: false, critical: false },
      { item: 'Dead animal disposal protocol', checked: false, critical: true }
    ];

    const biosecurity = new Biosecurity({
      userId: user._id,
      checklist: defaultChecklist
    });
    await biosecurity.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        farmType: user.farmType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('mobile').matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mobile, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        farmType: user.farmType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
