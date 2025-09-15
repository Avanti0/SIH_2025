import React from 'react';

const AlertNotification = ({ alert }) => {
  const getAlertIcon = (type) => {
    switch(type) {
      case 'warning': return '⚠️';
      case 'danger': return '🚨';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`alert alert-${alert.type}`}>
      <div className="alert-content">
        <span className="alert-icon">{getAlertIcon(alert.type)}</span>
        <div className="alert-text">
          <p>{alert.message}</p>
          <small>{alert.time}</small>
        </div>
      </div>
      <button className="alert-close">×</button>
    </div>
  );
};

export default AlertNotification;
