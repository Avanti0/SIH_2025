// Mock API for demo without backend
const mockApi = {
  async register(userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store user data in localStorage
    const users = JSON.parse(localStorage.getItem('demoUsers') || '[]');
    
    if (users.find(u => u.mobile === userData.mobile)) {
      throw new Error('User already exists with this mobile number');
    }

    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    localStorage.setItem('demoUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));

    return {
      message: 'Registration successful',
      token: 'demo_token_' + user.id,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        farmType: user.farmType
      }
    };
  },

  async login(credentials) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem('demoUsers') || '[]');
    const user = users.find(u => 
      u.mobile === credentials.mobile && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem('currentUser', JSON.stringify(user));

    return {
      message: 'Login successful',
      token: 'demo_token_' + user.id,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        farmType: user.farmType
      }
    };
  },

  async getDashboard() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get compliance score from biosecurity data
    const biosecurityData = JSON.parse(localStorage.getItem('biosecurityData') || '{}');
    const complianceScore = biosecurityData.complianceScore || 0;
    
    // Get animal counts from health records
    let healthRecords = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    
    // If no records exist, create some initial ones
    if (healthRecords.length === 0) {
      healthRecords = [
        { id: 1, animalId: 'PIG001', date: '2025-09-15', condition: 'Healthy', treatment: 'Routine checkup' },
        { id: 2, animalId: 'PIG002', date: '2025-09-15', condition: 'Healthy', treatment: 'Vaccination' },
        { id: 3, animalId: 'PIG003', date: '2025-09-14', condition: 'Fever', treatment: 'Antibiotics' },
        { id: 4, animalId: 'CHICKEN001', date: '2025-09-15', condition: 'Healthy', treatment: 'Routine checkup' },
        { id: 5, animalId: 'CHICKEN002', date: '2025-09-15', condition: 'Healthy', treatment: 'Vaccination' }
      ];
      localStorage.setItem('healthRecords', JSON.stringify(healthRecords));
    }
    
    const uniqueAnimals = [...new Set(healthRecords.map(record => record.animalId))];
    const totalAnimals = uniqueAnimals.length;
    
    // Count healthy animals (animals without recent illness records)
    const recentRecords = healthRecords.filter(record => {
      const recordDate = new Date(record.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return recordDate >= weekAgo;
    });
    
    const sickAnimals = [...new Set(recentRecords
      .filter(record => record.condition.toLowerCase().includes('sick') || 
                       record.condition.toLowerCase().includes('fever') ||
                       record.condition.toLowerCase().includes('disease'))
      .map(record => record.animalId))];
    
    const healthyAnimals = totalAnimals - sickAnimals.length;
    
    return {
      totalAnimals: totalAnimals,
      healthyAnimals: healthyAnimals,
      complianceScore: complianceScore,
      lastInspection: '2025-09-15'
    };
  },

  async getAlerts() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate dynamic alerts based on compliance and other factors
    const alerts = [];
    const biosecurityData = JSON.parse(localStorage.getItem('biosecurityData') || '{}');
    const complianceScore = biosecurityData.complianceScore || 0;
    
    // Low compliance alert
    if (complianceScore < 70) {
      alerts.push({
        id: 1,
        type: 'warning',
        message: `Biosecurity compliance is low (${complianceScore}%). Please complete checklist items.`,
        time: '1 hour ago',
        priority: 'high'
      });
    }
    
    // Disease outbreak alert (simulated)
    alerts.push({
      id: 2,
      type: 'danger',
      message: 'Avian Flu outbreak reported 15km from your location. Increase biosecurity measures.',
      time: '2 hours ago',
      priority: 'critical'
    });
    
    // Vaccination reminder
    alerts.push({
      id: 3,
      type: 'info',
      message: 'Vaccination schedule reminder: Next vaccination due in 3 days.',
      time: '1 day ago',
      priority: 'medium'
    });
    
    // Feed stock alert
    alerts.push({
      id: 4,
      type: 'warning',
      message: 'Feed stock running low. Current stock: 500kg remaining.',
      time: '6 hours ago',
      priority: 'medium'
    });
    
    return { alerts };
  },

  async getBiosecurityChecklist() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const saved = localStorage.getItem('biosecurityData');
    if (saved) {
      return JSON.parse(saved);
    }

    return {
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
  },

  async updateBiosecurityChecklist(checklist) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const totalItems = checklist.length;
    const checkedItems = checklist.filter(item => item.checked).length;
    const criticalItems = checklist.filter(item => item.critical).length;
    const checkedCriticalItems = checklist.filter(item => item.critical && item.checked).length;
    
    // Weight critical items more heavily in scoring
    const criticalScore = (checkedCriticalItems / criticalItems) * 70;
    const regularScore = ((checkedItems - checkedCriticalItems) / (totalItems - criticalItems)) * 30;
    const complianceScore = Math.round(criticalScore + regularScore);

    const data = {
      checklist,
      complianceScore: Math.max(0, complianceScore)
    };

    localStorage.setItem('biosecurityData', JSON.stringify(data));

    return {
      message: 'Checklist updated successfully',
      complianceScore: data.complianceScore
    };
  },

  async dismissAlert(alertId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const dismissedAlerts = JSON.parse(localStorage.getItem('dismissedAlerts') || '[]');
    if (!dismissedAlerts.includes(alertId)) {
      dismissedAlerts.push(alertId);
      localStorage.setItem('dismissedAlerts', JSON.stringify(dismissedAlerts));
    }
    
    return { message: 'Alert dismissed' };
  }
};

export default mockApi;
