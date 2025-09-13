import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function getExecutedMigrations(client) {
  const { rows } = await client.query('SELECT name FROM migrations ORDER BY id');
  return rows.map(row => row.name);
}

async function executeMigration(client, migrationPath, migrationName) {
  console.log(`Executing migration: ${migrationName}`);
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query(
      'INSERT INTO migrations (name) VALUES ($1)',
      [migrationName]
    );
    await client.query('COMMIT');
    console.log(`Migration ${migrationName} completed successfully`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Migration ${migrationName} failed:`, err);
    throw err;
  }
}

async function migrate() {
  const client = await pool.connect();
  try {
    // Create migrations table if it doesn't exist
    await createMigrationsTable(client);

    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations(client);

    // Get all migration files
    const migrationFiles = [
      { name: 'schema.sql', path: path.join(__dirname, 'schema.sql') },
      ...fs.readdirSync(path.join(__dirname, 'migrations'))
        .filter(f => f.endsWith('.sql'))
        .sort()
        .map(f => ({
          name: f,
          path: path.join(__dirname, 'migrations', f)
        }))
    ];

    // Execute migrations that haven't been run yet
    for (const migration of migrationFiles) {
      if (!executedMigrations.includes(migration.name)) {
        await executeMigration(client, migration.path, migration.name);
      } else {
        console.log(`Migration ${migration.name} already executed, skipping...`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (err) {
    console.error('Migration process failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Run migration if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate().then(() => {
    pool.end();
    process.exit(0);
  }).catch(() => {
    pool.end();
    process.exit(1);
  });
}

export default migrate;