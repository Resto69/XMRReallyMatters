
export default async function testRoutes(fastify) {
  fastify.get('/test-db', async (request, reply) => {
    try {
      // Try to query the database
      const result = await fastify.pg.query('SELECT NOW()');
      return {
        status: 'success',
        message: 'Database connection successful',
        timestamp: result.rows[0].now
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      });
    }
  });
}