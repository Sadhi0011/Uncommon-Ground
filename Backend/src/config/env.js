import dotenv from 'dotenv';

dotenv.config();

const toBool = (v) => String(v).toLowerCase() === 'true';

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  databaseUrl: process.env.DATABASE_URL || '',
  pgSsl: toBool(process.env.PGSSL),

  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  admin: {
    name: process.env.ADMIN_NAME || 'Site Admin',
    email: (process.env.ADMIN_EMAIL || 'admin@uncommonground.com').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
  },

  mail: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: toBool(process.env.SMTP_SECURE), // true for port 465, false for 587/STARTTLS
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.MAIL_FROM_NAME || 'Uncommon Ground',
    from: process.env.MAIL_FROM || 'sadaiah.r@d3e.studio',
    // Where contact-form notifications are delivered (defaults to the from address).
    contactTo: process.env.CONTACT_TO || process.env.MAIL_FROM || 'sadaiah.r@d3e.studio',
  },
};

if (env.jwtSecret === 'dev-secret-change-me' && env.nodeEnv === 'production') {
  // eslint-disable-next-line no-console
  console.warn('[env] WARNING: JWT_SECRET is using the insecure default in production.');
}
