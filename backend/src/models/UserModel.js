import BaseModel from './BaseModel.js';

export class UserModel extends BaseModel {
  async create({ username, passwordHash, email, torAddress, pgpKey }) {
    const { rows } = await this.db.query(
      `INSERT INTO users (username, password_hash, email, tor_address, pgp_key)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [username, passwordHash, email, torAddress, pgpKey]
    );
    return rows[0];
  }

  async findByUsername(username) {
    const { rows } = await this.db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return rows[0];
  }

  async findById(id) {
    const { rows } = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  async updatePreferences(userId, preferences) {
    const { rows } = await this.db.query(
      `UPDATE users 
       SET preferences = preferences || $2::jsonb
       WHERE id = $1
       RETURNING *`,
      [userId, JSON.stringify(preferences)]
    );
    return rows[0];
  }

  async updateVerificationStatus(userId, verified) {
    const { rows } = await this.db.query(
      `UPDATE users 
       SET verified = $2
       WHERE id = $1
       RETURNING *`,
      [userId, verified]
    );
    return rows[0];
  }
}

export default UserModel;