import { config } from 'dotenv';
import pg from 'pg';

// Load environment variables
config();

// Create a PostgreSQL pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URI,
});

// Test the connection
try {
  const client = await pool.connect();
  console.log('Connected to PostgreSQL successfully');
  client.release();
} catch (err) {
  console.error('Error connecting to PostgreSQL:', err);
  process.exit(1);
}

export default pool;