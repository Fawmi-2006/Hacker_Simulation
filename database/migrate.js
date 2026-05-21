

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    console.log('[MIGRATE] Connecting to MySQL...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    console.log('[MIGRATE] Running schema...');
    await conn.query(schema);
    console.log('[MIGRATE] Schema applied successfully.');
  } catch (err) {
    console.error('[MIGRATE] Error:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

migrate();
