// Helper function to convert rows to camelCase
const toCamelCase = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const rowToCamelCase = (row) => {
  const newRow = {};
  for (const [key, value] of Object.entries(row)) {
    newRow[toCamelCase(key)] = value;
  }
  return newRow;
};

export class BaseModel {
  constructor(db) {
    this.db = db;
  }

  async transaction(callback) {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default BaseModel;