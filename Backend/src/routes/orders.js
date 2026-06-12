import { Router } from 'express';
import { pool, query } from '../db/pool.js';
import { asyncHandler } from '../middleware/error.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendMail, wrapHtml, escapeHtml } from '../lib/email.js';

const router = Router();

const dollars = (cents) => `$${(cents / 100).toFixed(2)}`;

const FREE_SHIP_CENTS = 4000;
const SHIPPING_CENTS = 599;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

const randId = () => 'ord_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// Build a created_at date filter (?from=YYYY-MM-DD&to=YYYY-MM-DD).
// `prefix` lets the same param order be reused for aliased queries (e.g. 'o.').
function buildDateClauses(query_, prefix = '', startIndex = 1) {
  const clauses = [];
  const params = [];
  let idx = startIndex;
  if (query_.from) {
    params.push(query_.from);
    clauses.push(`${prefix}created_at >= $${idx++}`);
  }
  if (query_.to) {
    params.push(query_.to);
    clauses.push(`${prefix}created_at < ($${idx++}::date + INTERVAL '1 day')`);
  }
  return { clauses, params, nextIndex: idx };
}

// POST /api/orders  (checkout) — prices are recomputed server-side.
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
    if (rawItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const email = (req.body?.email || req.user?.email || '').trim().toLowerCase();
    const customerName = (req.body?.name || req.user?.name || '').trim();
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email is required to place an order.' });
    }

    // Look up real prices for the requested product ids.
    const ids = rawItems.map((i) => i.id);
    const { rows: products } = await query(
      'SELECT id, short_name, price_cents FROM products WHERE id = ANY($1) AND active = true',
      [ids]
    );
    const byId = new Map(products.map((p) => [p.id, p]));

    const items = [];
    for (const item of rawItems) {
      const product = byId.get(item.id);
      const qty = Math.max(1, Math.min(99, Number(item.quantity) || 1));
      if (!product) continue;
      items.push({
        product_id: product.id,
        product_name: product.short_name,
        quantity: qty,
        unit_price_cents: product.price_cents,
      });
    }
    if (items.length === 0) {
      return res.status(400).json({ error: 'No valid products in cart.' });
    }

    const subtotal = items.reduce((s, it) => s + it.unit_price_cents * it.quantity, 0);
    const shipping = subtotal >= FREE_SHIP_CENTS ? 0 : SHIPPING_CENTS;
    const total = subtotal + shipping;
    const id = randId();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO orders (id, user_id, customer_name, email, status, subtotal_cents, shipping_cents, total_cents)
         VALUES ($1,$2,$3,$4,'paid',$5,$6,$7)`,
        [id, req.user?.sub || null, customerName, email, subtotal, shipping, total]
      );
      for (const it of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price_cents)
           VALUES ($1,$2,$3,$4,$5)`,
          [id, it.product_id, it.product_name, it.quantity, it.unit_price_cents]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    // Order confirmation email (fire-and-forget; never blocks the response).
    const rowsHtml = items
      .map(
        (it) =>
          `<tr><td style="padding:6px 0;">${escapeHtml(it.product_name)} × ${it.quantity}</td>
           <td style="padding:6px 0;text-align:right;">${dollars(it.unit_price_cents * it.quantity)}</td></tr>`
      )
      .join('');
    sendMail({
      to: email,
      subject: `Order confirmed — ${id}`,
      text: `Thanks for your order!\n\n${items
        .map((it) => `${it.product_name} x${it.quantity} — ${dollars(it.unit_price_cents * it.quantity)}`)
        .join('\n')}\n\nSubtotal: ${dollars(subtotal)}\nShipping: ${shipping === 0 ? 'Free' : dollars(shipping)}\nTotal: ${dollars(total)}`,
      html: wrapHtml(
        'Order confirmed',
        `<p style="margin:0 0 16px;line-height:1.6;">Thanks for your order! Here is your receipt (order <strong>${escapeHtml(id)}</strong>).</p>
         <table style="width:100%;border-collapse:collapse;color:#e5decf;font-size:14px;">${rowsHtml}
           <tr><td style="padding-top:12px;border-top:1px solid #2a2a2a;">Subtotal</td><td style="padding-top:12px;border-top:1px solid #2a2a2a;text-align:right;">${dollars(subtotal)}</td></tr>
           <tr><td>Shipping</td><td style="text-align:right;">${shipping === 0 ? 'Free' : dollars(shipping)}</td></tr>
           <tr><td style="font-weight:bold;color:#fff;">Total</td><td style="text-align:right;font-weight:bold;color:#D96A2C;">${dollars(total)}</td></tr>
         </table>`
      ),
    });

    res.status(201).json({
      order: { id, email, subtotalCents: subtotal, shippingCents: shipping, totalCents: total, items },
    });
  })
);

// GET /api/orders  (admin) — filters: status, from, to, q, limit
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { clauses, params, nextIndex } = buildDateClauses(req.query, '', 1);
    let idx = nextIndex;
    const where = [...clauses];

    if (req.query.status && req.query.status !== 'all') {
      params.push(req.query.status);
      where.push(`status = $${idx++}`);
    }
    if (req.query.q) {
      params.push(`%${req.query.q}%`);
      where.push(`(email ILIKE $${idx} OR customer_name ILIKE $${idx})`);
      idx++;
    }

    const limit = Math.min(Number(req.query.limit) || 100, 500);
    params.push(limit);
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const { rows } = await query(
      `SELECT o.*,
              COALESCE(json_agg(json_build_object(
                'productId', oi.product_id,
                'productName', oi.product_name,
                'quantity', oi.quantity,
                'unitPriceCents', oi.unit_price_cents
              )) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ${whereSql}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT $${idx}`,
      params
    );

    res.json({
      orders: rows.map((o) => ({
        id: o.id,
        customerName: o.customer_name,
        email: o.email,
        status: o.status,
        subtotalCents: o.subtotal_cents,
        shippingCents: o.shipping_cents,
        totalCents: o.total_cents,
        createdAt: o.created_at,
        items: o.items,
      })),
    });
  })
);

// GET /api/orders/stats  (admin) — aggregated sales for the dashboard
router.get(
  '/stats',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const plain = buildDateClauses(req.query, '', 1);
    const joined = buildDateClauses(req.query, 'o.', 1);
    const params = plain.params; // identical values/order to joined.params

    const whereSql = plain.clauses.length ? `WHERE ${plain.clauses.join(' AND ')}` : '';
    const oWhereNonRefunded = joined.clauses.length
      ? `WHERE ${joined.clauses.join(' AND ')} AND o.status <> 'refunded'`
      : `WHERE o.status <> 'refunded'`;

    // Totals (exclude refunded from revenue/units).
    const totals = await query(
      `SELECT
         COUNT(*)::int AS order_count,
         COALESCE(SUM(total_cents) FILTER (WHERE status <> 'refunded'), 0)::bigint AS revenue_cents,
         COUNT(*) FILTER (WHERE status = 'refunded')::int AS refunded_count
       FROM orders ${whereSql}`,
      params
    );

    const units = await query(
      `SELECT COALESCE(SUM(oi.quantity), 0)::int AS units_sold
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
       ${oWhereNonRefunded}`,
      params
    );

    const byProduct = await query(
      `SELECT oi.product_id AS id, oi.product_name AS name,
              SUM(oi.quantity)::int AS units,
              SUM(oi.quantity * oi.unit_price_cents)::bigint AS revenue_cents
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
       ${oWhereNonRefunded}
       GROUP BY oi.product_id, oi.product_name
       ORDER BY revenue_cents DESC`,
      params
    );

    const byDay = await query(
      `SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
              COUNT(*)::int AS orders,
              COALESCE(SUM(total_cents) FILTER (WHERE status <> 'refunded'), 0)::bigint AS revenue_cents
       FROM orders ${whereSql}
       GROUP BY 1 ORDER BY 1 ASC`,
      params
    );

    const byStatus = await query(
      `SELECT status, COUNT(*)::int AS count FROM orders ${whereSql} GROUP BY status`,
      params
    );

    const orderCount = totals.rows[0].order_count;
    const revenueCents = Number(totals.rows[0].revenue_cents);
    const paidCount = orderCount - totals.rows[0].refunded_count;

    res.json({
      totals: {
        orderCount,
        revenueCents,
        unitsSold: units.rows[0].units_sold,
        avgOrderValueCents: paidCount > 0 ? Math.round(revenueCents / paidCount) : 0,
        refundedCount: totals.rows[0].refunded_count,
      },
      byProduct: byProduct.rows.map((r) => ({
        id: r.id,
        name: r.name,
        units: r.units,
        revenueCents: Number(r.revenue_cents),
      })),
      byDay: byDay.rows.map((r) => ({
        day: r.day,
        orders: r.orders,
        revenueCents: Number(r.revenue_cents),
      })),
      byStatus: byStatus.rows,
    });
  })
);

export default router;
