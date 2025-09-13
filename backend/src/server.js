import { config } from 'dotenv';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import postgres from '@fastify/postgres';
import swagger from '@fastify/swagger';

import authRoutes from './routes/auth.js';
import offerRoutes from './routes/offers.js';
import tradeRoutes from './routes/trades.js';
import testRoutes from './routes/test.js';
import authenticate from './plugins/authenticate.js';

// Load environment variables
config();

// Create Fastify instance
const fastify = Fastify({
  logger: true,
  trustProxy: true,
});

// Register plugins
fastify.register(cors, {
  origin: process.env.NODE_ENV === 'development' ? true : process.env.CORS_ORIGIN,
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: process.env.JWT_EXPIRE,
  },
});

// Register authentication decorator
fastify.register(authenticate);

fastify.register(postgres, {
  connectionString: process.env.POSTGRES_URI,
});

fastify.register(swagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'XMRMatters API',
      description: 'P2P Monero Trading Platform API',
      version: '1.0.0',
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
  exposeRoute: true,
});

// Health check route
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  // Don't expose internal errors to clients
  if (error.statusCode === undefined) {
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
    return;
  }
  
  reply.status(error.statusCode).send({
    error: error.name,
    message: error.message,
  });
});

// Register routes
fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(offerRoutes, { prefix: '/offers' });
fastify.register(tradeRoutes, { prefix: '/trades' });
fastify.register(testRoutes, { prefix: '/test' });

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT,
      host: process.env.HOST,
    });

    console.log(`Server is running on: http://${process.env.HOST}:${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();