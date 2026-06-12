import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { pool } from './db/pool.js';
import { runSeed } from './db/seed.js';
import { verifyMailer } from './lib/email.js';
import { authOptional } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import collectionRoutes from './routes/collections.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';
import orderRoutes from './routes/orders.js';

const app = express();

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser tools (no origin) and the configured front-ends.
      if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(authOptional);

// Throttle public write endpoints (forms / auth) to deter abuse.
const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (_req, res) => res.json({ ok: true, env: env.nodeEnv }));

app.use('/api/auth', publicWriteLimiter, authRoutes);
app.use('/api/contact', publicWriteLimiter, contactRoutes);
app.use('/api/newsletter', publicWriteLimiter, newsletterRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await runSeed();
    console.log('[db] Schema ready & data seeded.');
  } catch (err) {
    console.error('[db] Startup seeding failed — is PostgreSQL running and DATABASE_URL correct?');
    console.error('     ', err.message);
  }

  await verifyMailer();

  app.listen(env.port, () => {
    console.log(`[server] Uncommon Ground API listening on http://localhost:${env.port}`);
    console.log(`[server] Allowed origins: ${env.clientOrigins.join(', ')}`);
  });
}

start();

const shutdown = async () => {
  await pool.end().catch(() => {});
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
