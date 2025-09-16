import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertNotification from '../components/AlertNotification';
import mockApi from '../services/mockApi';

const Dashboard = () => {
  const [farmStats, setFarmStats] = useState({
    complianceScore: 0,
    totalAnimals: 0,
    healthyAnimals: 0,
    lastInspection: ''
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      title: 'Pashu Kavach Dashboard',
      welcome: 'Welcome',
      recentAlerts: 'Recent Alerts',
      noAlerts: 'No active alerts',
      complianceScore: 'Compliance Score',
      totalAnimals: 'Total Animals',
      healthyAnimals: 'Healthy Animals',
      lastInspection: 'Last Inspection',
      quickActions: 'Quick Actions',
      biosecurityChecklist: 'Biosecurity Checklist',
      healthRecords: 'Health Records',
      feedManagement: 'Feed Management',
      productionReports: 'Production Reports',
      videoUpload: 'Video Upload & Awareness'
    },
    hi: {
      title: 'पशु कवच डैशबोर्ड',
      welcome: 'स्वागत',
      recentAlerts: 'हाल की अलर्ट',
      noAlerts: 'कोई सक्रिय अलर्ट नहीं',
      complianceScore: 'अनुपालन स्कोर',
      totalAnimals: 'कुल पशु',
      healthyAnimals: 'स्वस्थ पशु',
      lastInspection: 'अंतिम निरीक्षण',
      quickActions: 'त्वरित कार्य',
      biosecurityChecklist: 'जैव सुरक्षा चेकलिस्ट',
      healthRecords: 'स्वास्थ्य रिकॉर्ड',
      feedManagement: 'आहार प्रबंधन',
      productionReports: 'उत्पादन रिपोर्ट',
      videoUpload: 'वीडियो अपलोड और जागरूकता'
    },
    te: {
      title: 'పశు కవచ్ డాష్‌బోర్డ్',
      welcome: 'స్వాగతం',
      recentAlerts: 'ఇటీవలి అలర్ట్‌లు',
      noAlerts: 'క్రియాశీల అలర్ట్‌లు లేవు',
      complianceScore: 'కంప్లయన్స్ స్కోర్',
      totalAnimals: 'మొత్తం జంతువులు',
      healthyAnimals: 'ఆరోగ్యకరమైన జంతువులు',
      lastInspection: 'చివరి తనిఖీ',
      quickActions: 'త్వరిత చర్యలు',
      biosecurityChecklist: 'బయోసెక్యూరిటీ చెక్‌లిస్ట్',
      healthRecords: 'ఆరోగ్య రికార్డులు',
      feedManagement: 'ఆహార నిర్వహణ',
      productionReports: 'ఉత్పాదన నివేదికలు',
      videoUpload: 'వీడియో అప్‌లోడ్ & అవగాహన'
    },
    ta: {
      title: 'பசு கவச் டாஷ்போர்டு',
      welcome: 'வரவேற்கிறோம்',
      recentAlerts: 'சமீபத்திய எச்சரிக்கைகள்',
      noAlerts: 'செயலில் உள்ள எச்சரிக்கைகள் இல்லை',
      complianceScore: 'இணக்க மதிப்பெண்',
      totalAnimals: 'மொத்த விலங்குகள்',
      healthyAnimals: 'ஆரோக்கியமான விலங்குகள்',
      lastInspection: 'கடைசி ஆய்வு',
      quickActions: 'விரைவு நடவடிக்கைகள்',
      biosecurityChecklist: 'உயிர்பாதுகாப்பு சரிபார்ப்பு பட்டியல்',
      healthRecords: 'சுகாதார பதிவுகள்',
      feedManagement: 'தீவன மேலாண்மை',
      productionReports: 'உற்பத்தி அறிக்கைகள்',
      videoUpload: 'வீடியோ பதிவேற்றம் & விழிப்புணர்வு'
    },
    mr: {
      title: 'पशु कवच डॅशबोर्ड',
      welcome: 'स्वागत',
      recentAlerts: 'अलीकडील अलर्ट',
      noAlerts: 'कोणतेही सक्रिय अलर्ट नाहीत',
      complianceScore: 'अनुपालन स्कोअर',
      totalAnimals: 'एकूण प्राणी',
      healthyAnimals: 'निरोगी प्राणी',
      lastInspection: 'शेवटची तपासणी',
      quickActions: 'त्वरित कृती',
      biosecurityChecklist: 'जैवसुरक्षा चेकलिस्ट',
      healthRecords: 'आरोग्य नोंदी',
      feedManagement: 'आहार व्यवस्थापन',
      productionReports: 'उत्पादन अहवाल',
      videoUpload: 'व्हिडिओ अपलोड आणि जागरूकता'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchDashboardData();
    fetchAlerts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await mockApi.getDashboard();
      setFarmStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const data = await mockApi.getAlerts();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{t.title}</h1>
        <div className="header-controls">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
            <option value="ta">தமிழ்</option>
            <option value="mr">मराठी</option>
          </select>
          <div className="user-info">
            <span>{t.welcome}, {user.name || 'Farmer'}</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="alerts-section">
          <h3>{t.recentAlerts}</h3>
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <AlertNotification key={alert.id} alert={alert} />
            ))
          ) : (
            <p>{t.noAlerts}</p>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>{t.complianceScore}</h4>
            <div className="score">{farmStats.complianceScore}%</div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{width: `${farmStats.complianceScore}%`}}
              ></div>
            </div>
            <small>Based on biosecurity checklist completion</small>
          </div>

          <div className="stat-card">
            <h4>{t.totalAnimals}</h4>
            <div className="number">{farmStats.totalAnimals}</div>
          </div>

          <div className="stat-card">
            <h4>{t.healthyAnimals}</h4>
            <div className="number">{farmStats.healthyAnimals}</div>
          </div>

          <div className="stat-card">
            <h4>{t.lastInspection}</h4>
            <div className="date">{farmStats.lastInspection}</div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>{t.quickActions}</h3>
          <div className="action-buttons">
            <Link to="/checklist" className="btn-action">
              📋 {t.biosecurityChecklist}
            </Link>
            <Link to="/health-records" className="btn-action">
              📊 {t.healthRecords}
            </Link>
            <Link to="/feed-management" className="btn-action">
              🍽️ {t.feedManagement}
            </Link>
            <Link to="/production-reports" className="btn-action">
              📈 {t.productionReports}
            </Link>
            <Link to="/video-upload" className="btn-action">
              📹 {t.videoUpload}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
