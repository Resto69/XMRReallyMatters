import BaseModel from './BaseModel.js';

export class TradeModel extends BaseModel {
  async create({ offerId, buyerId, sellerId, amount, priceUsd, paymentMethod }) {
    return this.transaction(async (client) => {
      // Create the trade
      const { rows: [trade] } = await client.query(
        `INSERT INTO trades 
         (offer_id, buyer_id, seller_id, amount, price_usd, payment_method)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [offerId, buyerId, sellerId, amount, priceUsd, paymentMethod]
      );

      // Update offer status
      await client.query(
        `UPDATE offers 
         SET status = 'PAUSED'
         WHERE id = $1`,
        [offerId]
      );

      return trade;
    });
  }

  async findById(id) {
    const { rows } = await this.db.query(
      `SELECT t.*, 
              b.username as buyer_username,
              s.username as seller_username,
              o.type as offer_type
       FROM trades t
       JOIN users b ON t.buyer_id = b.id
       JOIN users s ON t.seller_id = s.id
       JOIN offers o ON t.offer_id = o.id
       WHERE t.id = $1`,
      [id]
    );
    return rows[0];
  }

  async updateStatus(id, status, escrowData = null) {
    const updates = ['status = $2'];
    const params = [id, status];

    if (escrowData) {
      updates.push('escrow_address = $3', 'escrow_key = $4');
      params.push(escrowData.address, escrowData.key);
    }

    const { rows } = await this.db.query(
      `UPDATE trades 
       SET ${updates.join(', ')}
       WHERE id = $1
       RETURNING *`,
      params
    );
    return rows[0];
  }

  async initiateDispute(id, reason) {
    const { rows } = await this.db.query(
      `UPDATE trades 
       SET status = 'DISPUTED',
           dispute_reason = $2
       WHERE id = $1
       RETURNING *`,
      [id, reason]
    );
    return rows[0];
  }

  async resolveDispute(id, winnerId) {
    return this.transaction(async (client) => {
      const { rows: [trade] } = await client.query(
        `UPDATE trades 
         SET status = 'COMPLETED',
             dispute_winner = $2
         WHERE id = $1
         RETURNING *`,
        [id, winnerId]
      );

      // Release escrow based on winner
      // Implementation depends on escrow system

      return trade;
    });
  }
}

export default TradeModel;