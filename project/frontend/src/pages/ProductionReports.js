import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductionReports = () => {
  const [reports] = useState({
    daily: {
      date: '2025-09-15',
      eggsCollected: 180,
      milkProduced: 0,
      mortality: 2,
      feedConsumed: 120
    },
    weekly: {
      week: 'Sep 9-15, 2025',
      avgEggsPerDay: 175,
      totalMortality: 8,
      feedEfficiency: 2.1,
      healthScore: 92
    },
    monthly: {
      month: 'September 2025',
      totalProduction: 5250,
      revenue: 157500,
      expenses: 89000,
      profit: 68500
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  return (
    <div className="production-reports">
      <header>
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        <h1>Production Reports</h1>
      </header>

      <div className="report-tabs">
        <button 
          className={selectedPeriod === 'daily' ? 'active' : ''}
          onClick={() => setSelectedPeriod('daily')}
        >
          Daily
        </button>
        <button 
          className={selectedPeriod === 'weekly' ? 'active' : ''}
          onClick={() => setSelectedPeriod('weekly')}
        >
          Weekly
        </button>
        <button 
          className={selectedPeriod === 'monthly' ? 'active' : ''}
          onClick={() => setSelectedPeriod('monthly')}
        >
          Monthly
        </button>
      </div>

      <div className="report-content">
        {selectedPeriod === 'daily' && (
          <div className="daily-report">
            <h3>Daily Report - {reports.daily.date}</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Eggs Collected</h4>
                <div className="metric-value">{reports.daily.eggsCollected}</div>
              </div>
              <div className="metric-card">
                <h4>Feed Consumed</h4>
                <div className="metric-value">{reports.daily.feedConsumed} kg</div>
              </div>
              <div className="metric-card">
                <h4>Mortality</h4>
                <div className="metric-value">{reports.daily.mortality}</div>
              </div>
            </div>
          </div>
        )}

        {selectedPeriod === 'weekly' && (
          <div className="weekly-report">
            <h3>Weekly Report - {reports.weekly.week}</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Avg Eggs/Day</h4>
                <div className="metric-value">{reports.weekly.avgEggsPerDay}</div>
              </div>
              <div className="metric-card">
                <h4>Feed Efficiency</h4>
                <div className="metric-value">{reports.weekly.feedEfficiency}</div>
              </div>
              <div className="metric-card">
                <h4>Health Score</h4>
                <div className="metric-value">{reports.weekly.healthScore}%</div>
              </div>
            </div>
          </div>
        )}

        {selectedPeriod === 'monthly' && (
          <div className="monthly-report">
            <h3>Monthly Report - {reports.monthly.month}</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Total Production</h4>
                <div className="metric-value">{reports.monthly.totalProduction}</div>
              </div>
              <div className="metric-card">
                <h4>Revenue</h4>
                <div className="metric-value">₹{reports.monthly.revenue.toLocaleString()}</div>
              </div>
              <div className="metric-card">
                <h4>Profit</h4>
                <div className="metric-value">₹{reports.monthly.profit.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="export-options">
        <button className="export-btn">📊 Export to Excel</button>
        <button className="export-btn">📄 Generate PDF</button>
      </div>
    </div>
  );
};

export default ProductionReports;
