const fs = require('fs');
const path = require('path');
const pool = require('./config/database');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Read and execute the SQL file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'tables.psql'), 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlFile.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    
    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
