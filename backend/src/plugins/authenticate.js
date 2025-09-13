import fp from 'fastify-plugin';

export default fp(async function(fastify, opts) {
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({
        error: 'Unauthorized',
        message: 'Invalid token or no token provided'
      });
    }
  });
});