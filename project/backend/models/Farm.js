const pool = require('../config/database');

class Farm {
  static async create(farmData) {
    const { userId, farmName, farmType, location } = farmData;
    
    const query = `
      INSERT INTO farms (user_id, farm_name, farm_type, location)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, farmName, farmType, location]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM farms WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getDashboardStats(farmId) {
    const queries = {
      compliance: `
        SELECT 
          COUNT(*) as total_items,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_items
        FROM compliance WHERE farm_id = $1
      `,
      riskAssessment: `
        SELECT score, risk_level 
        FROM risk_assessment 
        WHERE farm_id = $1 
        ORDER BY completed_at DESC 
        LIMIT 1
      `,
      alerts: `
        SELECT COUNT(*) as active_alerts 
        FROM alerts 
        WHERE farm_id = $1 AND resolved = false
      `
    };

    const [compliance, risk, alerts] = await Promise.all([
      pool.query(queries.compliance, [farmId]),
      pool.query(queries.riskAssessment, [farmId]),
      pool.query(queries.alerts, [farmId])
    ]);

    const complianceData = compliance.rows[0];
    const complianceScore = complianceData.total_items > 0 
      ? Math.round((complianceData.completed_items / complianceData.total_items) * 100)
      : 0;

    return {
      totalAnimals: 250, // Mock data - can be added to farms table
      healthyAnimals: 245, // Mock data
      complianceScore,
      lastInspection: new Date().toISOString().split('T')[0],
      riskLevel: risk.rows[0]?.risk_level || 'low',
      activeAlerts: parseInt(alerts.rows[0].active_alerts)
    };
  }
}

module.exports = Farm;
