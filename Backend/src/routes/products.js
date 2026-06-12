import { Router } from 'express';
import { query } from '../db/pool.js';
import { asyncHandler } from '../middleware/error.js';
import { requireAdmin } from '../middleware/auth.js';
import { serializeProduct } from './serializers.js';

const router = Router();

// GET /api/products  (public) — optional ?flavor= & ?bestSeller=true
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const clauses = ['active = true'];
    const params = [];

    if (req.query.flavor) {
      params.push(req.query.flavor);
      clauses.push(`flavor ILIKE $${params.length}`);
    }
    if (String(req.query.bestSeller) === 'true') {
      clauses.push('best_seller = true');
    }

    const { rows } = await query(
      `SELECT * FROM products WHERE ${clauses.join(' AND ')} ORDER BY sort_order ASC, name ASC`,
      params
    );
    res.json({ products: rows.map(serializeProduct) });
  })
);

// GET /api/products/admin/all  (admin) — includes unpublished products
router.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const { rows } = await query(
      'SELECT * FROM products ORDER BY sort_order ASC, name ASC'
    );
    res.json({ products: rows.map(serializeProduct) });
  })
);

// GET /api/products/:slug  (public)
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      'SELECT * FROM products WHERE slug = $1 AND active = true',
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product: serializeProduct(rows[0]) });
  })
);

// ---- Admin CRUD ----------------------------------------------------------

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// POST /api/products  (admin)
router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ error: 'Name is required.' });

    const id = b.id || slugify(b.name);
    const slug = b.slug || slugify(b.name);

    const { rows } = await query(
      `INSERT INTO products (
         id, slug, name, short_name, flavor, meat, price_cents, weight,
         image_key, gallery_keys, rating, review_count, badge, best_seller,
         tagline, description, flavor_notes, ingredients, allergens,
         nutrition, pairs, active, sort_order
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
       ) RETURNING *`,
      [
        id, slug, b.name, b.shortName || b.name, b.flavor || null, b.meat || null,
        Math.round(Number(b.priceCents ?? (b.price ? b.price * 100 : 0))), b.weight || null,
        b.imageKey || null, b.galleryKeys || [], b.rating ?? 0, b.reviewCount ?? 0,
        b.badge || null, Boolean(b.bestSeller), b.tagline || null, b.description || [],
        b.flavorNotes || [], b.ingredients || null, b.allergens || null,
        JSON.stringify(b.nutrition || {}), b.pairs || [], b.active ?? true, b.sortOrder ?? 0,
      ]
    );
    res.status(201).json({ product: serializeProduct(rows[0]) });
  })
);

// PUT /api/products/:id  (admin)
router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    const { rows } = await query(
      `UPDATE products SET
         slug = COALESCE($2, slug),
         name = COALESCE($3, name),
         short_name = COALESCE($4, short_name),
         flavor = COALESCE($5, flavor),
         meat = COALESCE($6, meat),
         price_cents = COALESCE($7, price_cents),
         weight = COALESCE($8, weight),
         image_key = COALESCE($9, image_key),
         gallery_keys = COALESCE($10, gallery_keys),
         rating = COALESCE($11, rating),
         review_count = COALESCE($12, review_count),
         badge = $13,
         best_seller = COALESCE($14, best_seller),
         tagline = COALESCE($15, tagline),
         description = COALESCE($16, description),
         flavor_notes = COALESCE($17, flavor_notes),
         ingredients = COALESCE($18, ingredients),
         allergens = COALESCE($19, allergens),
         nutrition = COALESCE($20, nutrition),
         pairs = COALESCE($21, pairs),
         active = COALESCE($22, active),
         sort_order = COALESCE($23, sort_order)
       WHERE id = $1
       RETURNING *`,
      [
        req.params.id, b.slug ?? null, b.name ?? null, b.shortName ?? null,
        b.flavor ?? null, b.meat ?? null,
        b.priceCents != null ? Math.round(b.priceCents) : (b.price != null ? Math.round(b.price * 100) : null),
        b.weight ?? null, b.imageKey ?? null, b.galleryKeys ?? null, b.rating ?? null,
        b.reviewCount ?? null, b.badge ?? null, b.bestSeller ?? null, b.tagline ?? null,
        b.description ?? null, b.flavorNotes ?? null, b.ingredients ?? null,
        b.allergens ?? null, b.nutrition != null ? JSON.stringify(b.nutrition) : null,
        b.pairs ?? null, b.active ?? null, b.sortOrder ?? null,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product: serializeProduct(rows[0]) });
  })
);

// DELETE /api/products/:id  (admin) — permanently removes the product
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { rowCount } = await query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json({ ok: true });
  })
);

export default router;
