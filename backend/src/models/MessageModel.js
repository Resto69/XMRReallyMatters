import BaseModel from './BaseModel.js';

export class MessageModel extends BaseModel {
  async create({ tradeId, senderId, message }) {
    const { rows } = await this.db.query(
      `INSERT INTO trade_messages 
       (trade_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tradeId, senderId, message]
    );
    return rows[0];
  }

  async findByTradeId(tradeId) {
    const { rows } = await this.db.query(
      `SELECT m.*, u.username as sender_username
       FROM trade_messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.trade_id = $1
       ORDER BY m.created_at ASC`,
      [tradeId]
    );
    return rows;
  }
}

export default MessageModel;