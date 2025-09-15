const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo (simulating PostgreSQL)
let users = [
  { user_id: 1, name: 'Demo Farmer', phone: '9876543210', password_hash: 'demo123', role: 'farmer' }
];
let farms = [
  { farm_id: 1, user_id: 1, farm_name: 'Demo Farm', farm_type: 'poultry', location: 'Karnataka' }
];
let compliance = [
  { compliance_id: 1, farm_id: 1, checklist_item: 'Footbath at farm entrance', status: 'pending' },
  { compliance_id: 2, farm_id: 1, checklist_item: 'Visitor log maintained', status: 'completed' },
  { compliance_id: 3, farm_id: 1, checklist_item: 'Animals isolated when sick', status: 'pending' },
  { compliance_id: 4, farm_id: 1, checklist_item: 'Feed storage properly secured', status: 'completed' },
  { compliance_id: 5, farm_id: 1, checklist_item: 'Water sources protected', status: 'pending' }
];
let alerts = [
  { alert_id: 1, farm_id: 1, alert_type: 'warning', message: 'Avian Flu reported 15km away', severity: 'high', time: '2 hours ago' },
  { alert_id: 2, farm_id: 1, alert_type: 'info', message: 'Vaccination reminder due tomorrow', severity: 'medium', time: '1 day ago' }
];

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Pashu Kavach API with PostgreSQL Models (Demo Mode)',
    features: ['User Authentication', 'Farm Management', 'Compliance Tracking', 'Alert System'],
    database: 'In-memory (PostgreSQL models ready)'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Pashu Kavach API is running with latest updates!' });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, mobile, password, farmType, farmSize, location } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.phone === mobile);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this mobile number' });
    }

    // Create user (simulating PostgreSQL User.create)
    const user = {
      user_id: Date.now(),
      name,
      phone: mobile,
      password_hash: password, // In real app, this would be bcrypt hashed
      role: 'farmer'
    };
    users.push(user);

    // Create farm (simulating PostgreSQL Farm.create)
    const farm = {
      farm_id: Date.now() + 1,
      user_id: user.user_id,
      farm_name: `${name}'s Farm`,
      farm_type: farmType,
      location
    };
    farms.push(farm);

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
    
    const user = users.find(u => u.phone === mobile && u.password_hash === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const farm = farms.find(f => f.user_id === user.user_id);

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
    // Simulate PostgreSQL Farm.getDashboardStats
    const farmId = 1;
    const totalItems = compliance.filter(c => c.farm_id === farmId).length;
    const completedItems = compliance.filter(c => c.farm_id === farmId && c.status === 'completed').length;
    const complianceScore = Math.round((completedItems / totalItems) * 100);
    
    const stats = {
      totalAnimals: 250,
      healthyAnimals: 245,
      complianceScore,
      lastInspection: '2025-09-15',
      riskLevel: 'medium',
      activeAlerts: alerts.length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Dashboard error' });
  }
});

// Biosecurity routes
app.get('/api/biosecurity/checklist', async (req, res) => {
  try {
    // Simulate PostgreSQL Compliance.getChecklist
    const farmId = 1;
    const checklist = compliance
      .filter(c => c.farm_id === farmId)
      .map(c => ({
        id: c.compliance_id,
        item: c.checklist_item,
        checked: c.status === 'completed',
        critical: ['footbath', 'visitor', 'isolation', 'vaccination'].some(keyword => 
          c.checklist_item.toLowerCase().includes(keyword)
        )
      }));
    
    const totalItems = checklist.length;
    const completedItems = checklist.filter(item => item.checked).length;
    const complianceScore = Math.round((completedItems / totalItems) * 100);
    
    res.json({ checklist, complianceScore });
  } catch (error) {
    console.error('Checklist error:', error);
    res.status(500).json({ message: 'Checklist error' });
  }
});

app.put('/api/biosecurity/checklist', async (req, res) => {
  try {
    const { checklist } = req.body;
    
    // Simulate PostgreSQL Compliance.updateItem
    checklist.forEach(item => {
      const complianceItem = compliance.find(c => c.compliance_id === item.id);
      if (complianceItem) {
        complianceItem.status = item.checked ? 'completed' : 'pending';
      }
    });

    const totalItems = checklist.length;
    const completedItems = checklist.filter(item => item.checked).length;
    const complianceScore = Math.round((completedItems / totalItems) * 100);
    
    res.json({
      message: 'Checklist updated',
      complianceScore
    });
  } catch (error) {
    console.error('Update checklist error:', error);
    res.status(500).json({ message: 'Update failed' });
  }
});

// Alert routes
app.get('/api/alerts', async (req, res) => {
  try {
    // Simulate PostgreSQL Alert.getByFarmId
    const farmAlerts = alerts.map(alert => ({
      id: alert.alert_id,
      type: alert.alert_type,
      message: alert.message,
      time: alert.time
    }));
    
    res.json({ alerts: farmAlerts });
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({ message: 'Alerts error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Pashu Kavach API running on port ${PORT}`);
  console.log(`📊 Features: PostgreSQL Models, Authentication, Compliance Tracking`);
  console.log(`🔧 Mode: Demo (In-memory storage simulating PostgreSQL)`);
});

module.exports = app;
