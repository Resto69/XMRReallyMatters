import BaseModel from './BaseModel.js';

export class FeedbackModel extends BaseModel {
  async create({ tradeId, reviewerId, reviewedId, rating, comment }) {
    const { rows } = await this.db.query(
      `INSERT INTO feedback 
       (trade_id, reviewer_id, reviewed_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tradeId, reviewerId, reviewedId, rating, comment]
    );
    return rows[0];
  }

  async findByTradeId(tradeId) {
    const { rows } = await this.db.query(
      `SELECT f.*, u.username as reviewer_username
       FROM feedback f
       JOIN users u ON f.reviewer_id = u.id
       WHERE f.trade_id = $1`,
      [tradeId]
    );
    return rows;
  }

  async findByUserId(userId) {
    const { rows } = await this.db.query(
      `SELECT f.*, 
              u.username as reviewer_username,
              t.amount, t.price_usd,
              t.created_at as trade_date
       FROM feedback f
       JOIN users u ON f.reviewer_id = u.id
       JOIN trades t ON f.trade_id = t.id
       WHERE f.reviewed_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return rows;
  }
}

export default FeedbackModel;