

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../.env.local')
});

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hacker_sim',
    multipleStatements: true,
  });

  try {
    console.log('[SEED] Connecting to MySQL...');

    console.log('[SEED] Resetting database...');

    await conn.query(`
      SET FOREIGN_KEY_CHECKS = 0;

      TRUNCATE TABLE system_events;
      TRUNCATE TABLE darknet_listings;
      TRUNCATE TABLE crypto_wallets;
      TRUNCATE TABLE ai_conversations;
      TRUNCATE TABLE terminal_logs;
      TRUNCATE TABLE user_missions;
      TRUNCATE TABLE mission_stages;
      TRUNCATE TABLE missions;
      TRUNCATE TABLE filesystem_nodes;
      TRUNCATE TABLE settings;
      TRUNCATE TABLE users;

      SET FOREIGN_KEY_CHECKS = 1;
    `);

    console.log('[SEED] Database reset complete.');

    const seedsPath = path.join(__dirname, 'seeds.sql');
    const seeds = fs.readFileSync(seedsPath, 'utf8');

    console.log('[SEED] Running seed data...');
    await conn.query(seeds);

    console.log('[SEED] Seed data applied successfully.');
    console.log('[SEED] Default user: ghost / ghost2077');

  } catch (err) {
    console.error('[SEED] Error:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

seed();