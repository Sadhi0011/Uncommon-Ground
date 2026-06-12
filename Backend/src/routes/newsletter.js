import { Router } from 'express';
import { query } from '../db/pool.js';
import { asyncHandler } from '../middleware/error.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendMail, wrapHtml } from '../lib/email.js';

const router = Router();
const EMAIL_RE = /^\S+@\S+\.\S+$/;

// POST /api/newsletter  (public)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const email = (req.body?.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }
    const { rowCount } = await query(
      'INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email]
    );

    // Only welcome brand-new subscribers (rowCount === 0 means already subscribed).
    if (rowCount > 0) {
      sendMail({
        to: email,
        subject: 'Welcome to Uncommon Ground',
        text: 'Thanks for subscribing! Expect new drops, podcast episodes, and exclusive rewards.',
        html: wrapHtml(
          'Welcome to the community',
          `<p style="margin:0;line-height:1.6;">Thanks for subscribing! Expect new drops, podcast episodes, community events, and exclusive rewards — straight to your inbox.</p>`
        ),
      });
    }

    res.status(201).json({ ok: true, message: 'Welcome to the community!' });
  })
);

// GET /api/newsletter  (admin) — view subscribers
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const { rows } = await query('SELECT * FROM subscribers ORDER BY created_at DESC LIMIT 500');
    res.json({ subscribers: rows });
  })
);

export default router;
