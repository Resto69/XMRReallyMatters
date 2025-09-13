// Authentication decorator
fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource',
    });
  }
});