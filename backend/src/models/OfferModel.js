import BaseModel from './BaseModel.js';

export class OfferModel extends BaseModel {
  async create({ creatorId, type, amount, priceUsd, minLimit, maxLimit, paymentMethod, terms }) {
    const { rows } = await this.db.query(
      `INSERT INTO offers 
       (creator_id, type, amount, price_usd, min_limit, max_limit, payment_method, terms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [creatorId, type, amount, priceUsd, minLimit, maxLimit, paymentMethod, terms]
    );
    return rows[0];
  }

  async findById(id) {
    const { rows } = await this.db.query(
      `SELECT o.*, u.username as creator_username, u.reputation as creator_reputation
       FROM offers o
       JOIN users u ON o.creator_id = u.id
       WHERE o.id = $1`,
      [id]
    );
    return rows[0];
  }

  async findActive({ type, minAmount, maxAmount }) {
    const params = [type];
    let query = `
      SELECT o.*, u.username as creator_username, u.reputation as creator_reputation
      FROM offers o
      JOIN users u ON o.creator_id = u.id
      WHERE o.status = 'ACTIVE'
      AND o.type = $1
    `;

    if (minAmount) {
      params.push(minAmount);
      query += ` AND o.amount >= $${params.length}`;
    }

    if (maxAmount) {
      params.push(maxAmount);
      query += ` AND o.amount <= $${params.length}`;
    }

    query += ` ORDER BY o.created_at DESC`;

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async updateStatus(id, status) {
    const { rows } = await this.db.query(
      `UPDATE offers 
       SET status = $2
       WHERE id = $1
       RETURNING *`,
      [id, status]
    );
    return rows[0];
  }
}

export default OfferModel;