import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    animalId: '',
    condition: '',
    treatment: ''
  });

  useEffect(() => {
    // Load existing records from localStorage
    const savedRecords = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    setRecords(savedRecords);
  }, []);

  const addRecord = () => {
    if (newRecord.animalId && newRecord.condition) {
      const record = {
        id: Date.now(),
        ...newRecord,
        date: new Date().toISOString().split('T')[0]
      };
      
      const updatedRecords = [record, ...records];
      setRecords(updatedRecords);
      localStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
      setNewRecord({ animalId: '', condition: '', treatment: '' });
    }
  };

  return (
    <div className="health-records">
      <header>
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        <h1>Health Records</h1>
      </header>

      <div className="add-record">
        <h3>Add New Record</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Animal ID (e.g., PIG001, CHICKEN001)"
            value={newRecord.animalId}
            onChange={(e) => setNewRecord({...newRecord, animalId: e.target.value})}
          />
          <input
            type="text"
            placeholder="Condition (e.g., Healthy, Fever, Sick)"
            value={newRecord.condition}
            onChange={(e) => setNewRecord({...newRecord, condition: e.target.value})}
          />
          <input
            type="text"
            placeholder="Treatment"
            value={newRecord.treatment}
            onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
          />
          <button onClick={addRecord}>Add Record</button>
        </div>
      </div>

      <div className="records-list">
        <h3>Recent Records ({records.length} total)</h3>
        {records.length === 0 ? (
          <p>No health records yet. Add some records to see animal counts on dashboard.</p>
        ) : (
          records.map(record => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <span className="animal-id">{record.animalId}</span>
                <span className="date">{record.date}</span>
              </div>
              <div className="record-details">
                <p><strong>Condition:</strong> {record.condition}</p>
                <p><strong>Treatment:</strong> {record.treatment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthRecords;
