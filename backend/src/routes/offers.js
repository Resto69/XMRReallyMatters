import { OfferModel } from '../models/OfferModel.js';

/**
 * Offer routes
 * @param {FastifyInstance} fastify Fastify instance
 */
export default async function offerRoutes(fastify) {
  const offerModel = new OfferModel(fastify.pg);

  // Create a new offer
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['type', 'amount', 'priceUsd', 'paymentMethod'],
        properties: {
          type: { type: 'string', enum: ['BUY', 'SELL'] },
          amount: { type: 'number', minimum: 0 },
          priceUsd: { type: 'number', minimum: 0 },
          minLimit: { type: 'number', minimum: 0 },
          maxLimit: { type: 'number', minimum: 0 },
          paymentMethod: { type: 'array', items: { type: 'string' } },
          terms: { type: 'string' },
        },
      },
    },
    preHandler: fastify.authenticate,
    handler: async (request, reply) => {
      try {
        const offer = await offerModel.create({
          creatorId: request.user.id,
          ...request.body,
        });

        reply.code(201).send(offer);
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while creating the offer',
        });
      }
    },
  });

  // Get all active offers
  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['BUY', 'SELL'] },
          minAmount: { type: 'number', minimum: 0 },
          maxAmount: { type: 'number', minimum: 0 },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const offers = await offerModel.findActive(request.query);
        reply.send(offers);
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while fetching offers',
        });
      }
    },
  });

  // Get offer by ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const offer = await offerModel.findById(request.params.id);
        if (!offer) {
          reply.code(404).send({
            error: 'Not Found',
            message: 'Offer not found',
          });
          return;
        }
        reply.send(offer);
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while fetching the offer',
        });
      }
    },
  });

  // Update offer status
  fastify.patch('/:id/status', {
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
          status: { type: 'string', enum: ['ACTIVE', 'PAUSED', 'CLOSED'] },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const offer = await offerModel.findById(request.params.id);
        if (!offer) {
          reply.code(404).send({
            error: 'Not Found',
            message: 'Offer not found',
          });
          return;
        }

        if (offer.creator_id !== request.user.id) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'You can only update your own offers',
          });
          return;
        }

        const updatedOffer = await offerModel.updateStatus(
          request.params.id,
          request.body.status
        );
        reply.send(updatedOffer);
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while updating the offer',
        });
      }
    },
  });
}