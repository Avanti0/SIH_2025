const express = require('express');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Farm = require('./models/Farm');
const Compliance = require('./models/Compliance');
const Alert = require('./models/Alert');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Farm Management API with PostgreSQL is running!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Farm Management API is running!' });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, mobile, password, farmType, farmSize, location } = req.body;
    
    // Check if user exists
    const existingUser = await User.findByPhone(mobile);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this mobile number' });
    }

    // Create user
    const user = await User.create({
      name,
      phone: mobile,
      email: `${mobile}@farm.com`, // Generate email from mobile
      password,
      role: 'farmer'
    });

    // Create farm for user
    const farm = await Farm.create({
      userId: user.user_id,
      farmName: `${name}'s Farm`,
      farmType,
      location
    });

    res.json({
      message: 'Registration successful',
      token: 'demo_token',
      user: {
        id: user.user_id,
        name: user.name,
        mobile,
        farmType,
        farmId: farm.farm_id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    
    const user = await User.findByPhone(mobile);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await User.validatePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Get user's farm
    const farms = await Farm.findByUserId(user.user_id);
    const farm = farms[0]; // Get first farm

    res.json({
      message: 'Login successful',
      token: 'demo_token',
      user: {
        id: user.user_id,
        name: user.name,
        mobile: user.phone,
        farmType: farm?.farm_type || 'poultry',
        farmId: farm?.farm_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Farm routes
app.get('/api/farm/dashboard', async (req, res) => {
  try {
    // For demo, use farm_id = 1 or get from token
    const farmId = 1;
    const stats = await Farm.getDashboardStats(farmId);
    res.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    // Fallback to mock data
    res.json({
      totalAnimals: 250,
      healthyAnimals: 245,
      complianceScore: 85,
      lastInspection: '2025-09-15'
    });
  }
});

// Biosecurity routes
app.get('/api/biosecurity/checklist', async (req, res) => {
  try {
    const farmId = 1; // Demo farm
    const data = await Compliance.getChecklist(farmId);
    res.json(data);
  } catch (error) {
    console.error('Checklist error:', error);
    // Fallback to mock data
    res.json({
      checklist: [
        { id: 1, item: 'Footbath at farm entrance', checked: false, critical: true },
        { id: 2, item: 'Visitor log maintained', checked: false, critical: true },
        { id: 3, item: 'Animals isolated when sick', checked: false, critical: true }
      ],
      complianceScore: 0
    });
  }
});

app.put('/api/biosecurity/checklist', async (req, res) => {
  try {
    const { checklist } = req.body;
    const farmId = 1; // Demo farm
    
    // Update each item
    for (const item of checklist) {
      const status = item.checked ? 'completed' : 'pending';
      await Compliance.updateItem(farmId, item.id, status);
    }

    // Recalculate score
    const updatedData = await Compliance.getChecklist(farmId);
    
    res.json({
      message: 'Checklist updated',
      complianceScore: updatedData.complianceScore
    });
  } catch (error) {
    console.error('Update checklist error:', error);
    res.status(500).json({ message: 'Update failed' });
  }
});

// Alert routes
app.get('/api/alerts', async (req, res) => {
  try {
    const farmId = 1; // Demo farm
    const alerts = await Alert.getByFarmId(farmId);
    res.json({ alerts });
  } catch (error) {
    console.error('Alerts error:', error);
    // Fallback to mock data
    res.json({
      alerts: [
        { id: 1, type: 'warning', message: 'Avian Flu reported 15km away', time: '2 hours ago' },
        { id: 2, type: 'info', message: 'Vaccination reminder due tomorrow', time: '1 day ago' }
      ]
    });
  }
});

// Handle preflight requests
app.options('*', cors());

module.exports = app;
