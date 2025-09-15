import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../services/mockApi';

const BiosecurityChecklist = () => {
  const [checklist, setChecklist] = useState([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    try {
      const data = await mockApi.getBiosecurityChecklist();
      setChecklist(data.checklist || []);
      setComplianceScore(data.complianceScore || 0);
    } catch (error) {
      console.error('Error fetching checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckChange = async (id) => {
    const updatedChecklist = checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updatedChecklist);

    // Calculate new score
    const totalItems = updatedChecklist.length;
    const checkedItems = updatedChecklist.filter(item => item.checked).length;
    const newScore = Math.round((checkedItems / totalItems) * 100);
    setComplianceScore(newScore);

    // Update mock API
    try {
      await mockApi.updateBiosecurityChecklist(updatedChecklist);
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  const criticalIssues = checklist.filter(item => item.critical && !item.checked);

  if (loading) {
    return <div className="loading">Loading checklist...</div>;
  }

  return (
    <div className="checklist-container">
      <header className="checklist-header">
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        <h2>Biosecurity Checklist</h2>
      </header>

      <div className="score-section">
        <div className="current-score">
          <h3>Current Score: {complianceScore}%</h3>
          <div className="score-indicator">
            <div 
              className={`score-circle ${complianceScore >= 80 ? 'good' : complianceScore >= 60 ? 'warning' : 'danger'}`}
            >
              {complianceScore}%
            </div>
          </div>
        </div>
      </div>

      {criticalIssues.length > 0 && (
        <div className="critical-alerts">
          <h4>⚠️ Critical Issues ({criticalIssues.length})</h4>
          <ul>
            {criticalIssues.map(issue => (
              <li key={issue.id}>{issue.item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="checklist-items">
        {checklist.map(item => (
          <div key={item.id} className={`checklist-item ${item.critical ? 'critical' : ''}`}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckChange(item.id)}
              />
              <span className="checkmark"></span>
              <span className="item-text">
                {item.item}
                {item.critical && <span className="critical-badge">Critical</span>}
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="btn-primary">Save Progress</button>
        <button className="btn-secondary">Generate Report</button>
      </div>
    </div>
  );
};

export default BiosecurityChecklist;
