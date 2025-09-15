const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, phone, email, password, role = 'farmer' } = userData;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (name, role, phone, email, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id, name, role, phone, email, created_at
    `;
    
    const result = await pool.query(query, [name, role, phone, email, passwordHash]);
    return result.rows[0];
  }

  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await pool.query(query, [phone]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async validatePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = User;
