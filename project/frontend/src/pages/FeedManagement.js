import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FeedManagement = () => {
  const [feedStock, setFeedStock] = useState([
    { id: 1, type: 'Starter Feed', quantity: 500, unit: 'kg', lastUpdated: '2025-09-15' },
    { id: 2, type: 'Grower Feed', quantity: 300, unit: 'kg', lastUpdated: '2025-09-14' }
  ]);

  const [feedSchedule] = useState([
    { id: 1, time: '06:00', type: 'Starter Feed', amount: '50kg' },
    { id: 2, time: '18:00', type: 'Grower Feed', amount: '40kg' }
  ]);

  const updateStock = (id, newQuantity) => {
    setFeedStock(feedStock.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
  };

  return (
    <div className="feed-management">
      <header>
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        <h1>Feed Management</h1>
      </header>

      <div className="feed-sections">
        <div className="feed-stock">
          <h3>Current Stock</h3>
          {feedStock.map(item => (
            <div key={item.id} className="stock-card">
              <div className="stock-info">
                <h4>{item.type}</h4>
                <p>{item.quantity} {item.unit}</p>
                <small>Last updated: {item.lastUpdated}</small>
              </div>
              <div className="stock-actions">
                <button onClick={() => updateStock(item.id, item.quantity + 50)}>
                  Add 50kg
                </button>
                <button onClick={() => updateStock(item.id, Math.max(0, item.quantity - 50))}>
                  Use 50kg
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="feed-schedule">
          <h3>Feeding Schedule</h3>
          {feedSchedule.map(schedule => (
            <div key={schedule.id} className="schedule-card">
              <div className="schedule-time">{schedule.time}</div>
              <div className="schedule-details">
                <p><strong>{schedule.type}</strong></p>
                <p>{schedule.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="feed-alerts">
        <h3>Feed Alerts</h3>
        <div className="alert-card warning">
          <p>⚠️ Starter Feed running low (500kg remaining)</p>
        </div>
      </div>
    </div>
  );
};

export default FeedManagement;
