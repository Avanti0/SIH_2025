const pool = require('../config/database');

class Alert {
  static async getByFarmId(farmId) {
    const query = `
      SELECT alert_id as id, alert_type as type, message, severity, 
             CASE 
               WHEN created_at > NOW() - INTERVAL '1 hour' THEN 'Just now'
               WHEN created_at > NOW() - INTERVAL '1 day' THEN 
                 EXTRACT(HOUR FROM NOW() - created_at) || ' hours ago'
               ELSE 
                 EXTRACT(DAY FROM NOW() - created_at) || ' days ago'
             END as time
      FROM alerts 
      WHERE farm_id = $1 AND resolved = false
      ORDER BY created_at DESC
      LIMIT 10
    `;
    
    const result = await pool.query(query, [farmId]);
    return result.rows;
  }

  static async create(alertData) {
    const { farmId, alertType, message, severity = 'medium' } = alertData;
    
    const query = `
      INSERT INTO alerts (farm_id, alert_type, message, severity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [farmId, alertType, message, severity]);
    return result.rows[0];
  }

  static async resolve(alertId) {
    const query = `
      UPDATE alerts 
      SET resolved = true 
      WHERE alert_id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [alertId]);
    return result.rows[0];
  }
}

module.exports = Alert;
