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
        <h1>Pashu Kavach Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name || 'Farmer'}</span>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="alerts-section">
          <h3>Recent Alerts</h3>
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <AlertNotification key={alert.id} alert={alert} />
            ))
          ) : (
            <p>No active alerts</p>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>Compliance Score</h4>
            <div className="score">{farmStats.complianceScore}%</div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{width: `${farmStats.complianceScore}%`}}
              ></div>
            </div>
          </div>

          <div className="stat-card">
            <h4>Total Animals</h4>
            <div className="number">{farmStats.totalAnimals}</div>
          </div>

          <div className="stat-card">
            <h4>Healthy Animals</h4>
            <div className="number">{farmStats.healthyAnimals}</div>
          </div>

          <div className="stat-card">
            <h4>Last Inspection</h4>
            <div className="date">{farmStats.lastInspection}</div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/checklist" className="btn-action">
              📋 Biosecurity Checklist
            </Link>
            <button className="btn-action">
              📊 Health Records
            </button>
            <button className="btn-action">
              🍽️ Feed Management
            </button>
            <button className="btn-action">
              📈 Production Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
