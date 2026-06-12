import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const { mail } = env;

// Mail is "configured" only when an SMTP host is provided. When it isn't, the
// app keeps working and we simply log that the message was skipped — so contact
// submissions / orders never fail just because SMTP isn't set up yet.
export const isMailConfigured = Boolean(mail.host);

let transporter = null;
if (isMailConfigured) {
  transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.secure,
    auth: mail.user ? { user: mail.user, pass: mail.pass } : undefined,
  });
}

export async function verifyMailer() {
  if (!isMailConfigured) {
    console.log('[mail] SMTP not configured — emails will be skipped (set SMTP_HOST to enable).');
    return false;
  }
  try {
    await transporter.verify();
    console.log(`[mail] SMTP ready via ${mail.host}:${mail.port} (from ${mail.from})`);
    return true;
  } catch (err) {
    console.warn('[mail] SMTP verify failed:', err.message);
    return false;
  }
}

/**
 * Send an email. Never throws — returns { sent, skipped, error } so callers can
 * fire-and-forget without risking the request.
 */
export async function sendMail({ to, subject, text, html, replyTo }) {
  if (!isMailConfigured) {
    console.log(`[mail] skipped (SMTP not configured) → "${subject}" to ${to}`);
    return { sent: false, skipped: true };
  }
  try {
    const info = await transporter.sendMail({
      from: `"${mail.fromName}" <${mail.from}>`,
      to,
      subject,
      text,
      html,
      replyTo,
    });
    console.log(`[mail] sent "${subject}" to ${to} (id: ${info.messageId})`);
    return { sent: true, id: info.messageId };
  } catch (err) {
    console.error(`[mail] FAILED "${subject}" to ${to}:`, err.message);
    return { sent: false, error: err.message };
  }
}

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Lightweight branded HTML wrapper for consistent-looking emails.
export function wrapHtml(title, bodyHtml) {
  return `<!doctype html><html><body style="margin:0;background:#0b0b0b;padding:24px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#171717;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden;">
      <div style="background:#D96A2C;padding:18px 24px;">
        <h1 style="margin:0;color:#0b0b0b;font-size:18px;letter-spacing:1px;text-transform:uppercase;">Uncommon Ground</h1>
      </div>
      <div style="padding:24px;color:#e5decf;">
        <h2 style="margin:0 0 16px;color:#fff;font-size:18px;">${escapeHtml(title)}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:16px 24px;border-top:1px solid #2a2a2a;color:#8a8a8a;font-size:12px;">
        Uncommon Ground · Springville, Utah
      </div>
    </div>
  </body></html>`;
}

export { escapeHtml };
