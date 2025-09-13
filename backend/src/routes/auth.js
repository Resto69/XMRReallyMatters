import argon2 from 'argon2';
import { randomBytes } from 'crypto';

/**
 * Authentication routes
 * @param {FastifyInstance} fastify Fastify instance
 */
export default async function authRoutes(fastify) {
  // Login route
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { username, password } = request.body;

      try {
        // Get user from database
        const { rows } = await fastify.pg.query(
          'SELECT id, username, password_hash, preferences FROM users WHERE username = $1',
          [username]
        );

        const user = rows[0];
        if (!user) {
          reply.code(401).send({
            error: 'Authentication failed',
            message: 'Invalid username or password',
          });
          return;
        }

        // Verify password
        const valid = await argon2.verify(user.password_hash, password);
        if (!valid) {
          reply.code(401).send({
            error: 'Authentication failed',
            message: 'Invalid username or password',
          });
          return;
        }

        // Generate refresh token
        const refreshToken = randomBytes(40).toString('hex');
        const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Store refresh token
        await fastify.pg.query(
          'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
          [user.id, refreshToken, refreshExpires]
        );

        // Generate access token
        const token = await reply.jwtSign({
          id: user.id,
          username: user.username,
        });

        // Send response
        reply.send({
          token,
          refreshToken,
          user: {
            id: user.id,
            username: user.username,
            preferences: user.preferences,
          },
        });
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred during login',
        });
      }
    },
  });

  // Register route
  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password', 'email'],
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 50 },
          password: { type: 'string', minLength: 8 },
          email: { type: 'string', format: 'email' },
        },
      },
    },
    handler: async (request, reply) => {
      const { username, password, email } = request.body;

      try {
        // Check if username exists
        const { rows } = await fastify.pg.query(
          'SELECT id FROM users WHERE username = $1 OR email = $2',
          [username, email]
        );

        if (rows.length > 0) {
          reply.code(409).send({
            error: 'Registration failed',
            message: 'Username or email already exists',
          });
          return;
        }

        // Hash password
        const passwordHash = await argon2.hash(password);

        // Create user
        const result = await fastify.pg.query(
          `INSERT INTO users (username, password_hash, email)
           VALUES ($1, $2, $3)
           RETURNING id, username, preferences`,
          [username, passwordHash, email]
        );

        const user = result.rows[0];

        // Generate tokens
        const token = await reply.jwtSign({
          id: user.id,
          username: user.username,
        });

        const refreshToken = randomBytes(40).toString('hex');
        const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await fastify.pg.query(
          'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
          [user.id, refreshToken, refreshExpires]
        );

        // Send response
        reply.code(201).send({
          token,
          refreshToken,
          user: {
            id: user.id,
            username: user.username,
            preferences: user.preferences,
          },
        });
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred during registration',
        });
      }
    },
  });

  // Refresh token route
  fastify.post('/refresh', {
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { refreshToken } = request.body;

      try {
        // Verify refresh token
        const { rows } = await fastify.pg.query(
          `SELECT rt.user_id, rt.expires_at, u.username
           FROM refresh_tokens rt
           JOIN users u ON u.id = rt.user_id
           WHERE rt.token = $1`,
          [refreshToken]
        );

        if (rows.length === 0) {
          reply.code(401).send({
            error: 'Invalid refresh token',
            message: 'Please log in again',
          });
          return;
        }

        const token = rows[0];

        // Check if token is expired
        if (new Date(token.expires_at) < new Date()) {
          // Delete expired token
          await fastify.pg.query(
            'DELETE FROM refresh_tokens WHERE token = $1',
            [refreshToken]
          );

          reply.code(401).send({
            error: 'Expired refresh token',
            message: 'Please log in again',
          });
          return;
        }

        // Generate new access token
        const newToken = await reply.jwtSign({
          id: token.user_id,
          username: token.username,
        });

        // Send response
        reply.send({
          token: newToken,
        });
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while refreshing token',
        });
      }
    },
  });

  // Logout route
  fastify.post('/logout', {
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { refreshToken } = request.body;

      try {
        // Delete refresh token
        await fastify.pg.query(
          'DELETE FROM refresh_tokens WHERE token = $1',
          [refreshToken]
        );

        reply.send({
          message: 'Logged out successfully',
        });
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred during logout',
        });
      }
    },
  });
}