export function notFound(_req, res) {
  res.status(404).json({ error: 'Not found.' });
}

// Translate common PostgreSQL error codes into friendly 4xx responses.
// https://www.postgresql.org/docs/current/errcodes-appendix.html
function mapPgError(err) {
  switch (err.code) {
    case '23505': {
      // unique_violation — surface which field collided when we can tell.
      const c = err.constraint || '';
      if (c.includes('slug')) return { status: 409, message: 'A record with that slug already exists. Choose a different slug.' };
      if (c.includes('pkey')) return { status: 409, message: 'A record with that ID already exists.' };
      if (c.includes('email')) return { status: 409, message: 'That email is already registered.' };
      return { status: 409, message: 'That record already exists (a unique value is duplicated).' };
    }
    case '23503':
      return { status: 400, message: 'A related record was not found.' };
    case '23502':
      return { status: 400, message: `Missing required field${err.column ? `: ${err.column}` : ''}.` };
    case '22P02':
    case '22003':
      return { status: 400, message: 'Invalid input value.' };
    default:
      return null;
  }
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // eslint-disable-next-line no-console
  console.error('[error]', err.code ? `${err.code} ${err.message}` : err.message);

  let status = err.status || 500;
  let message = err.message;

  const pg = mapPgError(err);
  if (pg) {
    status = pg.status;
    message = pg.message;
  } else if (status === 500) {
    message = 'Internal server error.';
  }

  res.status(status).json({ error: message });
}

// Wrap async route handlers so thrown errors hit the error middleware.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
