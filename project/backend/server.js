const express = require('express');
const cors = require('cors');

const app = express();

// Middleware - Allow all origins for demo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// In-memory data store for prototype
let users = [];
let farms = {};
let biosecurity = {};
let alerts = [
  { id: 1, type: 'warning', message: 'Avian Flu reported 15km away', time: '2 hours ago' },
  { id: 2, type: 'info', message: 'Vaccination reminder due tomorrow', time: '1 day ago' }
];

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Farm Management API is running!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Farm Management API is running!' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, mobile, password, farmType, farmSize, location } = req.body;
    
    if (users.find(u => u.mobile === mobile)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = { id: Date.now(), name, mobile, password, farmType, farmSize, location };
    users.push(user);
    
    // Initialize farm and biosecurity data
    farms[user.id] = {
      totalAnimals: 0,
      healthyAnimals: 0,
      complianceScore: 0,
      lastInspection: new Date().toISOString().split('T')[0]
    };

    biosecurity[user.id] = {
      checklist: [
        { id: 1, item: 'Footbath at farm entrance', checked: false, critical: true },
        { id: 2, item: 'Visitor log maintained', checked: false, critical: true },
        { id: 3, item: 'Animals isolated when sick', checked: false, critical: true },
        { id: 4, item: 'Feed storage properly secured', checked: false, critical: false },
        { id: 5, item: 'Water sources protected', checked: false, critical: true },
        { id: 6, item: 'Waste disposal system in place', checked: false, critical: true },
        { id: 7, item: 'Regular cleaning schedule followed', checked: false, critical: false },
        { id: 8, item: 'Vaccination records updated', checked: false, critical: true },
        { id: 9, item: 'Equipment disinfected regularly', checked: false, critical: false },
        { id: 10, item: 'Dead animal disposal protocol', checked: false, critical: true }
      ],
      complianceScore: 0
    };

    res.json({ 
      message: 'Registration successful', 
      token: 'demo_token', 
      user: { id: user.id, name, mobile, farmType } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = users.find(u => u.mobile === mobile && u.password === password);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ 
      message: 'Login successful', 
      token: 'demo_token', 
      user: { id: user.id, name: user.name, mobile, farmType: user.farmType } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Farm routes
app.get('/api/farm/dashboard', (req, res) => {
  try {
    const userId = 1;
    const farmData = farms[userId] || farms[Object.keys(farms)[0]] || {
      totalAnimals: 250,
      healthyAnimals: 245,
      complianceScore: 85,
      lastInspection: '2025-09-15'
    };
    
    res.json(farmData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Biosecurity routes
app.get('/api/biosecurity/checklist', (req, res) => {
  try {
    const userId = 1;
    const data = biosecurity[userId] || biosecurity[Object.keys(biosecurity)[0]] || {
      checklist: [
        { id: 1, item: 'Footbath at farm entrance', checked: false, critical: true },
        { id: 2, item: 'Visitor log maintained', checked: false, critical: true },
        { id: 3, item: 'Animals isolated when sick', checked: false, critical: true },
        { id: 4, item: 'Feed storage properly secured', checked: false, critical: false },
        { id: 5, item: 'Water sources protected', checked: false, critical: true }
      ],
      complianceScore: 0
    };
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/biosecurity/checklist', (req, res) => {
  try {
    const { checklist } = req.body;
    const userId = 1;
    
    if (biosecurity[userId]) {
      biosecurity[userId].checklist = checklist;
      const totalItems = checklist.length;
      const checkedItems = checklist.filter(item => item.checked).length;
      biosecurity[userId].complianceScore = Math.round((checkedItems / totalItems) * 100);
      
      if (farms[userId]) {
        farms[userId].complianceScore = biosecurity[userId].complianceScore;
      }
    }
    
    res.json({ 
      message: 'Checklist updated', 
      complianceScore: biosecurity[userId]?.complianceScore || 0 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Alert routes
app.get('/api/alerts', (req, res) => {
  try {
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle preflight requests
app.options('*', cors());

module.exports = app;
