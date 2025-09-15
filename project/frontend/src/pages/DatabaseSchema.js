import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DatabaseSchema.css';

const DatabaseSchema = () => {
  const tables = [
    {
      name: 'users',
      description: 'User management with role-based access',
      columns: [
        { name: 'user_id', type: 'SERIAL PRIMARY KEY', description: 'Unique user identifier' },
        { name: 'name', type: 'VARCHAR(100)', description: 'User full name' },
        { name: 'role', type: 'VARCHAR(50)', description: 'farmer, vet, or admin' },
        { name: 'phone', type: 'VARCHAR(15)', description: 'Mobile number for login' },
        { name: 'email', type: 'VARCHAR(100)', description: 'Email address' },
        { name: 'password_hash', type: 'TEXT', description: 'Encrypted password' },
        { name: 'created_at', type: 'TIMESTAMP', description: 'Registration date' }
      ]
    },
    {
      name: 'farms',
      description: 'Farm information linked to users',
      columns: [
        { name: 'farm_id', type: 'SERIAL PRIMARY KEY', description: 'Unique farm identifier' },
        { name: 'user_id', type: 'INT REFERENCES users', description: 'Owner reference' },
        { name: 'farm_name', type: 'VARCHAR(100)', description: 'Farm name' },
        { name: 'farm_type', type: 'VARCHAR(20)', description: 'pig, poultry, or both' },
        { name: 'location', type: 'TEXT', description: 'Farm location' },
        { name: 'created_at', type: 'TIMESTAMP', description: 'Farm registration date' }
      ]
    },
    {
      name: 'compliance',
      description: 'Biosecurity checklist tracking',
      columns: [
        { name: 'compliance_id', type: 'SERIAL PRIMARY KEY', description: 'Unique compliance record' },
        { name: 'farm_id', type: 'INT REFERENCES farms', description: 'Farm reference' },
        { name: 'checklist_item', type: 'VARCHAR(200)', description: 'Biosecurity requirement' },
        { name: 'status', type: 'VARCHAR(10)', description: 'pending or completed' },
        { name: 'updated_at', type: 'TIMESTAMP', description: 'Last update time' }
      ]
    },
    {
      name: 'risk_assessment',
      description: 'Farm risk scoring system',
      columns: [
        { name: 'assessment_id', type: 'SERIAL PRIMARY KEY', description: 'Unique assessment ID' },
        { name: 'farm_id', type: 'INT REFERENCES farms', description: 'Farm reference' },
        { name: 'score', type: 'INT', description: 'Risk score (1-10)' },
        { name: 'risk_level', type: 'VARCHAR(10)', description: 'low, medium, or high' },
        { name: 'completed_at', type: 'TIMESTAMP', description: 'Assessment date' }
      ]
    },
    {
      name: 'alerts',
      description: 'Alert and notification system',
      columns: [
        { name: 'alert_id', type: 'SERIAL PRIMARY KEY', description: 'Unique alert identifier' },
        { name: 'farm_id', type: 'INT REFERENCES farms', description: 'Farm reference' },
        { name: 'alert_type', type: 'VARCHAR(50)', description: 'Type of alert' },
        { name: 'message', type: 'TEXT', description: 'Alert message content' },
        { name: 'severity', type: 'VARCHAR(10)', description: 'low, medium, or high' },
        { name: 'created_at', type: 'TIMESTAMP', description: 'Alert creation time' },
        { name: 'resolved', type: 'BOOLEAN', description: 'Alert resolution status' }
      ]
    },
    {
      name: 'training_modules',
      description: 'Educational content management',
      columns: [
        { name: 'module_id', type: 'SERIAL PRIMARY KEY', description: 'Unique module identifier' },
        { name: 'title', type: 'VARCHAR(100)', description: 'Training module title' },
        { name: 'description', type: 'TEXT', description: 'Module description' },
        { name: 'language', type: 'VARCHAR(20)', description: 'Content language' },
        { name: 'created_at', type: 'TIMESTAMP', description: 'Module creation date' }
      ]
    },
    {
      name: 'training_progress',
      description: 'User learning progress tracking',
      columns: [
        { name: 'progress_id', type: 'SERIAL PRIMARY KEY', description: 'Unique progress record' },
        { name: 'user_id', type: 'INT REFERENCES users', description: 'User reference' },
        { name: 'module_id', type: 'INT REFERENCES training_modules', description: 'Module reference' },
        { name: 'status', type: 'VARCHAR(20)', description: 'not_started, in_progress, completed' },
        { name: 'updated_at', type: 'TIMESTAMP', description: 'Last progress update' }
      ]
    }
  ];

  const sampleData = {
    users: [
      { user_id: 1, name: 'Ramesh Kumar', role: 'farmer', phone: '9876543210', email: 'ramesh@example.com' }
    ],
    farms: [
      { farm_id: 1, user_id: 1, farm_name: 'Green Valley Farm', farm_type: 'poultry', location: 'Telangana' }
    ],
    compliance: [
      { compliance_id: 1, farm_id: 1, checklist_item: 'Footbath at farm entrance', status: 'completed' },
      { compliance_id: 2, farm_id: 1, checklist_item: 'Visitor log maintained', status: 'pending' }
    ]
  };

  return (
    <div className="database-schema">
      <header className="schema-header">
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        <h2>Database Schema - Member 3's Work</h2>
        <p>PostgreSQL database design for Pashu Kavach</p>
      </header>

      <div className="schema-overview">
        <div className="overview-stats">
          <div className="stat-item">
            <h4>7</h4>
            <span>Database Tables</span>
          </div>
          <div className="stat-item">
            <h4>PostgreSQL</h4>
            <span>Database Engine</span>
          </div>
          <div className="stat-item">
            <h4>Production Ready</h4>
            <span>Schema Status</span>
          </div>
        </div>
      </div>

      <div className="tables-section">
        <h3>Database Tables</h3>
        {tables.map((table, index) => (
          <div key={index} className="table-card">
            <div className="table-header">
              <h4>{table.name}</h4>
              <span className="table-description">{table.description}</span>
            </div>
            <div className="table-columns">
              <table>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((column, colIndex) => (
                    <tr key={colIndex}>
                      <td className="column-name">{column.name}</td>
                      <td className="column-type">{column.type}</td>
                      <td className="column-desc">{column.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="sample-data-section">
        <h3>Sample Data</h3>
        <div className="sample-tables">
          {Object.entries(sampleData).map(([tableName, data]) => (
            <div key={tableName} className="sample-table">
              <h4>{tableName} table</h4>
              <div className="sample-content">
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h3>Advanced Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>🔐 Authentication</h4>
            <p>Secure password hashing with bcrypt</p>
          </div>
          <div className="feature-card">
            <h4>👥 Role-Based Access</h4>
            <p>Farmer, Veterinarian, and Admin roles</p>
          </div>
          <div className="feature-card">
            <h4>📊 Risk Assessment</h4>
            <p>Automated risk scoring system</p>
          </div>
          <div className="feature-card">
            <h4>🎓 Training System</h4>
            <p>Multi-language educational modules</p>
          </div>
          <div className="feature-card">
            <h4>🚨 Alert Management</h4>
            <p>Severity-based notification system</p>
          </div>
          <div className="feature-card">
            <h4>📈 Progress Tracking</h4>
            <p>Compliance and learning analytics</p>
          </div>
        </div>
      </div>

      <div className="technical-details">
        <h3>Technical Implementation</h3>
        <div className="tech-grid">
          <div className="tech-item">
            <strong>Database:</strong> PostgreSQL with proper relationships
          </div>
          <div className="tech-item">
            <strong>Security:</strong> Password hashing, input validation
          </div>
          <div className="tech-item">
            <strong>Scalability:</strong> SERIAL primary keys, indexed columns
          </div>
          <div className="tech-item">
            <strong>Data Integrity:</strong> Foreign key constraints, CHECK constraints
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchema;
