import pg from 'pg';
import { env } from '../config/env.js';

// node-postgres returns NUMERIC as strings by default; parse to Number so
// prices/ratings arrive as numbers on the client.
pg.types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

const config = env.databaseUrl
  ? { connectionString: env.databaseUrl }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'uncommon_ground',
    };

if (env.pgSsl) {
  config.ssl = { rejectUnauthorized: false };
}

export const pool = new pg.Pool(config);

export const query = (text, params) => pool.query(text, params);

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[db] Unexpected pool error:', err.message);
});
