import { TradeModel } from '../models/TradeModel.js';
import { MessageModel } from '../models/MessageModel.js';
import { FeedbackModel } from '../models/FeedbackModel.js';
import { OfferModel } from '../models/OfferModel.js';

/**
 * Trade routes
 * @param {FastifyInstance} fastify Fastify instance
 */
export default async function tradeRoutes(fastify) {
  const tradeModel = new TradeModel(fastify.pg);
  const messageModel = new MessageModel(fastify.pg);
  const feedbackModel = new FeedbackModel(fastify.pg);
  const offerModel = new OfferModel(fastify.pg);

  // Create a new trade
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['offerId', 'amount'],
        properties: {
          offerId: { type: 'string', format: 'uuid' },
          amount: { type: 'number', minimum: 0 },
          paymentMethod: { type: 'string' },
        },
      },
    },
    preHandler: fastify.authenticate,
    handler: async (request, reply) => {
      try {
        const offer = await offerModel.findById(request.body.offerId);
        if (!offer) {
          reply.code(404).send({
            error: 'Not Found',
            message: 'Offer not found',
          });
          return;
        }

        if (offer.status !== 'ACTIVE') {
          reply.code(400).send({
            error: 'Invalid Operation',
            message: 'This offer is no longer active',
          });
          return;
        }

        if (offer.creator_id === request.user.id) {
          reply.code(400).send({
            error: 'Invalid Operation',
            message: 'You cannot trade with your own offer',
          });
          return;
        }

        if (request.body.amount < offer.min_limit || request.body.amount > offer.max_limit) {
          reply.code(400).send({
            error: 'Invalid Amount',
            message: 'Trade amount is outside the offer limits',
          });
          return;
        }

        if (!offer.payment_method.includes(request.body.paymentMethod)) {
          reply.code(400).send({
            error: 'Invalid Payment Method',
            message: 'Selected payment method is not supported by this offer',
          });
          return;
        }

        const trade = await tradeModel.create({
          offerId: offer.id,
          buyerId: offer.type === 'SELL' ? request.user.id : offer.creator_id,
          sellerId: offer.type === 'SELL' ? offer.creator_id : request.user.id,
          amount: request.body.amount,
          priceUsd: offer.price_usd,
          paymentMethod: request.body.paymentMethod,
        });

        reply.code(201).send(trade);
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while creating the trade',
        });
      }
    },
  });

  // Get trade by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
    preHandler: fastify.authenticate,
    handler: async (request, reply) => {
      try {
        const trade = await tradeModel.findById(request.params.id);
        if (!trade) {
          reply.code(404).send({
            error: 'Not Found',
            message: 'Trade not found',
          });
          return;
        }

        if (trade.buyer_id !== request.user.id && trade.seller_id !== request.user.id) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'You can only view your own trades',
          });
          return;
        }

        // Get trade messages
        const messages = await messageModel.findByTradeId(trade.id);
        
        // Get feedback if trade is completed
        let feedback = null;
        if (trade.status === 'COMPLETED') {
          feedback = await feedbackModel.findByTradeId(trade.id);
        }

        reply.send({ ...trade, messages, feedback });
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while fetching the trade',
        });
      }
    },
  });

  // Update trade status
  fastify.patch('/:id/status', {
    onRequest: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: [
              'FUNDED',
              'PAYMENT_SENT',
              'PAYMENT_CONFIRMED',
              'RELEASED',
              'DISPUTED',
              'CANCELLED',
              'COMPLETED',
            ],
          },
          escrowData: {
            type: 'object',
            properties: {
              address: { type: 'string' },
              key: { type: 'string' },
            },
          },
        },
      },
    },
    preHandler: fastify.authenticate,
    handler: async (request, reply) => {
      try {
        const trade = await tradeModel.findById(request.params.id);
        if (!trade) {
          reply.code(404).send({
            error: 'Not Found',
            message: 'Trade not found',
          });
          return;
        }

        if (trade.buyer_id !== request.user.id && trade.seller_id !== request.user.id) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'You can only update your own trades',
          });
          return;
        }

        // Validate status transitions
        const validTransitions = {
          INITIATED: ['FUNDED', 'CANCELLED'],
          FUNDED: ['PAYMENT_SENT', 'DISPUTED', 'CANCELLED'],
          PAYMENT_SENT: ['PAYMENT_CONFIRMED', 'DISPUTED'],
          PAYMENT_CONFIRMED: ['RELEASED', 'DISPUTED'],
          RELEASED: ['COMPLETED'],
          DISPUTED: ['COMPLETED'],
        };

        if (!validTransitions[trade.status]?.includes(request.body.status)) {
          reply.code(400).send({
            error: 'Invalid Status',
            message: `Cannot transition from ${trade.status} to ${request.body.status}`,
          });
          return;
        }

        // Additional validation for specific status changes
        if (request.body.status === 'FUNDED' && request.user.id !== trade.seller_id) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'Only the seller can mark the trade as funded',
          });
          return;
        }

        if (request.body.status === 'PAYMENT_SENT' && request.user.id !== trade.buyer_id) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'Only the buyer can mark the payment as sent',
          });
          return;
        }

        if (request.body.status === 'PAYMENT_CONFIRMED' && request.user.id !== trade.seller_id) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'Only the seller can confirm the payment',
          });
          return;
        }

        const updatedTrade = await tradeModel.updateStatus(
          request.params.id,
          request.body.status,
          request.body.escrowData
        );

        reply.send(updatedTrade);
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while updating the trade',
        });
      }
    },
  });

  // Add message to trade
  fastify.post('/:id/messages', {
    onRequest: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', maxLength: 1000 },
        },
      },
    },
    preHandler: fastify.authenticate,
    handler: async (request, reply) => {
      try {
        const trade = await tradeModel.findById(request.params.id);
        if (!trade) {
          reply.code(404).send({
            error: 'Not Found',
            message: 'Trade not found',
          });
          return;
        }

        if (trade.buyer_id !== request.user.id && trade.seller_id !== request.user.id) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'You can only message in your own trades',
          });
          return;
        }

        const message = await messageModel.create({
          tradeId: trade.id,
          senderId: request.user.id,
          message: request.body.message,
        });

        reply.code(201).send(message);
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while sending the message',
        });
      }
    },
  });

  // Submit feedback
  fastify.post('/:id/feedback', {
    onRequest: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['rating'],
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string', maxLength: 500 },
        },
      },
    },
    preHandler: fastify.authenticate,
    handler: async (request, reply) => {
      try {
        const trade = await tradeModel.findById(request.params.id);
        if (!trade) {
          reply.code(404).send({
            error: 'Not Found',
            message: 'Trade not found',
          });
          return;
        }

        if (trade.buyer_id !== request.user.id && trade.seller_id !== request.user.id) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'You can only leave feedback for your own trades',
          });
          return;
        }

        if (trade.status !== 'COMPLETED') {
          reply.code(400).send({
            error: 'Invalid Operation',
            message: 'Can only leave feedback for completed trades',
          });
          return;
        }

        // Check if user has already left feedback
        const existingFeedback = await feedbackModel.findByTradeId(trade.id);
        if (existingFeedback.some(f => f.reviewer_id === request.user.id)) {
          reply.code(400).send({
            error: 'Invalid Operation',
            message: 'You have already left feedback for this trade',
          });
          return;
        }

        const feedback = await feedbackModel.create({
          tradeId: trade.id,
          reviewerId: request.user.id,
          reviewedId: request.user.id === trade.buyer_id ? trade.seller_id : trade.buyer_id,
          rating: request.body.rating,
          comment: request.body.comment,
        });

        reply.code(201).send(feedback);
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while submitting feedback',
        });
      }
    },
  });
}