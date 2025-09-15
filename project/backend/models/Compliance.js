const pool = require('../config/database');

class Compliance {
  static async getChecklist(farmId) {
    const query = `
      SELECT compliance_id as id, checklist_item as item, 
             status = 'completed' as checked,
             CASE WHEN checklist_item LIKE '%critical%' OR 
                       checklist_item LIKE '%vaccination%' OR
                       checklist_item LIKE '%isolation%' OR
                       checklist_item LIKE '%visitor%' OR
                       checklist_item LIKE '%footbath%'
                  THEN true ELSE false END as critical
      FROM compliance 
      WHERE farm_id = $1
      ORDER BY compliance_id
    `;
    
    const result = await pool.query(query, [farmId]);
    
    // If no checklist exists, create default one
    if (result.rows.length === 0) {
      await this.createDefaultChecklist(farmId);
      return await this.getChecklist(farmId);
    }
    
    const checklist = result.rows;
    const totalItems = checklist.length;
    const completedItems = checklist.filter(item => item.checked).length;
    const complianceScore = Math.round((completedItems / totalItems) * 100);
    
    return { checklist, complianceScore };
  }

  static async createDefaultChecklist(farmId) {
    const defaultItems = [
      'Footbath at farm entrance',
      'Visitor log maintained', 
      'Animals isolated when sick',
      'Feed storage properly secured',
      'Water sources protected',
      'Waste disposal system in place',
      'Regular cleaning schedule followed',
      'Vaccination records updated',
      'Equipment disinfected regularly',
      'Dead animal disposal protocol'
    ];

    const query = `
      INSERT INTO compliance (farm_id, checklist_item, status)
      VALUES ($1, $2, 'pending')
    `;

    for (const item of defaultItems) {
      await pool.query(query, [farmId, item]);
    }
  }

  static async updateItem(farmId, itemId, status) {
    const query = `
      UPDATE compliance 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE farm_id = $2 AND compliance_id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, farmId, itemId]);
    return result.rows[0];
  }
}

module.exports = Compliance;
