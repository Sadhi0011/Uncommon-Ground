import { Router } from 'express';
import { query } from '../db/pool.js';
import { asyncHandler } from '../middleware/error.js';
import { requireAdmin } from '../middleware/auth.js';
import { serializeCollection } from './serializers.js';

const router = Router();

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// GET /api/collections  (public)
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const { rows } = await query('SELECT * FROM collections ORDER BY sort_order ASC, name ASC');
    res.json({ collections: rows.map(serializeCollection) });
  })
);

// GET /api/collections/:slug  (public)
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const { rows } = await query('SELECT * FROM collections WHERE slug = $1', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Collection not found.' });
    res.json({ collection: serializeCollection(rows[0]) });
  })
);

// POST /api/collections  (admin)
router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ error: 'Name is required.' });
    const id = b.id || slugify(b.name);
    const slug = b.slug || slugify(b.name);
    const { rows } = await query(
      `INSERT INTO collections (id, name, slug, blurb, image_key, accent, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, b.name, slug, b.blurb || null, b.imageKey || null, b.accent || 'ember', b.sortOrder ?? 0]
    );
    res.status(201).json({ collection: serializeCollection(rows[0]) });
  })
);

// PUT /api/collections/:id  (admin)
router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    const { rows } = await query(
      `UPDATE collections SET
         name = COALESCE($2, name),
         slug = COALESCE($3, slug),
         blurb = COALESCE($4, blurb),
         image_key = COALESCE($5, image_key),
         accent = COALESCE($6, accent),
         sort_order = COALESCE($7, sort_order)
       WHERE id = $1 RETURNING *`,
      [req.params.id, b.name ?? null, b.slug ?? null, b.blurb ?? null, b.imageKey ?? null, b.accent ?? null, b.sortOrder ?? null]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Collection not found.' });
    res.json({ collection: serializeCollection(rows[0]) });
  })
);

// DELETE /api/collections/:id  (admin)
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { rowCount } = await query('DELETE FROM collections WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Collection not found.' });
    res.json({ ok: true });
  })
);

export default router;
