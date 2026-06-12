import { Router } from 'express';
import { query } from '../db/pool.js';
import { asyncHandler } from '../middleware/error.js';
import { requireAdmin } from '../middleware/auth.js';
import { env } from '../config/env.js';
import { sendMail, wrapHtml, escapeHtml } from '../lib/email.js';

const router = Router();
const EMAIL_RE = /^\S+@\S+\.\S+$/;

// POST /api/contact  (public)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    const firstName = (b.firstName || '').trim();
    const lastName = (b.lastName || '').trim();
    const email = (b.email || '').trim().toLowerCase();
    const type = (b.type || '').trim();
    const message = (b.message || '').trim();

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First and last name are required.' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }
    if (!type) return res.status(400).json({ error: 'Please select an inquiry type.' });
    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters.' });
    }

    await query(
      `INSERT INTO contact_messages (first_name, last_name, email, type, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, email, type, message]
    );

    const fullName = `${firstName} ${lastName}`;

    // Notify the business (reply-to set to the customer so a reply goes to them).
    sendMail({
      to: env.mail.contactTo,
      replyTo: email,
      subject: `New ${type} inquiry from ${fullName}`,
      text: `${fullName} <${email}> — ${type}\n\n${message}`,
      html: wrapHtml(
        `New ${escapeHtml(type)} inquiry`,
        `<p style="margin:0 0 8px;"><strong>From:</strong> ${escapeHtml(fullName)} &lt;${escapeHtml(email)}&gt;</p>
         <p style="margin:0 0 16px;"><strong>Type:</strong> ${escapeHtml(type)}</p>
         <p style="margin:0;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>`
      ),
    });

    // Auto-reply / acknowledgement to the customer.
    sendMail({
      to: email,
      subject: 'We received your message — Uncommon Ground',
      text: `Hi ${firstName},\n\nThanks for reaching out to Uncommon Ground. We received your ${type} message and will get back to you soon.\n\n— The Uncommon Ground Team`,
      html: wrapHtml(
        `Thanks, ${escapeHtml(firstName)}!`,
        `<p style="margin:0 0 16px;line-height:1.6;">We received your <strong>${escapeHtml(type)}</strong> message and will get back to you soon.</p>
         <p style="margin:0;color:#8a8a8a;line-height:1.6;">For reference, here is what you sent:</p>
         <p style="margin:8px 0 0;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>`
      ),
    });

    res.status(201).json({ ok: true, message: 'Thanks! We will get back to you soon.' });
  })
);

// GET /api/contact  (admin) — view submissions
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const { rows } = await query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 200'
    );
    res.json({ messages: rows });
  })
);

export default router;
