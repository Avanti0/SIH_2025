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
    
    return {
      totalAnimals: 250,
      healthyAnimals: 245,
      complianceScore: 85,
      lastInspection: '2025-09-15'
    };
  },

  async getAlerts() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      alerts: [
        { id: 1, type: 'warning', message: 'Avian Flu reported 15km away', time: '2 hours ago' },
        { id: 2, type: 'info', message: 'Vaccination reminder due tomorrow', time: '1 day ago' }
      ]
    };
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
    const complianceScore = Math.round((checkedItems / totalItems) * 100);

    const data = {
      checklist,
      complianceScore
    };

    localStorage.setItem('biosecurityData', JSON.stringify(data));

    return {
      message: 'Checklist updated successfully',
      complianceScore
    };
  }
};

export default mockApi;
