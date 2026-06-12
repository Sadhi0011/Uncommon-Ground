import bcrypt from 'bcryptjs';
import { pool, query } from './pool.js';
import { ensureSchema } from './schema.js';
import { env } from '../config/env.js';
import { productsSeed, collectionsSeed } from './seedData.js';

async function seedAdmin() {
  const { rows } = await query('SELECT id FROM users WHERE email = $1', [env.admin.email]);
  if (rows.length > 0) {
    console.log(`[seed] Admin already exists: ${env.admin.email}`);
    return;
  }
  const hash = await bcrypt.hash(env.admin.password, 10);
  await query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
    [env.admin.name, env.admin.email, hash, 'admin']
  );
  console.log(`[seed] Created default admin: ${env.admin.email}`);
}

async function seedCollections() {
  for (const c of collectionsSeed) {
    await query(
      `INSERT INTO collections (id, name, slug, blurb, image_key, accent, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         slug = EXCLUDED.slug,
         blurb = EXCLUDED.blurb,
         image_key = EXCLUDED.image_key,
         accent = EXCLUDED.accent,
         sort_order = EXCLUDED.sort_order`,
      [c.id, c.name, c.slug, c.blurb, c.image_key, c.accent, c.sort_order]
    );
  }
  console.log(`[seed] Upserted ${collectionsSeed.length} collections`);
}

async function seedProducts() {
  for (const p of productsSeed) {
    await query(
      `INSERT INTO products (
         id, slug, name, short_name, flavor, meat, price_cents, weight,
         image_key, gallery_keys, rating, review_count, badge, best_seller,
         tagline, description, flavor_notes, ingredients, allergens,
         nutrition, pairs, active, sort_order
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
       )
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug,
         name = EXCLUDED.name,
         short_name = EXCLUDED.short_name,
         flavor = EXCLUDED.flavor,
         meat = EXCLUDED.meat,
         price_cents = EXCLUDED.price_cents,
         weight = EXCLUDED.weight,
         image_key = EXCLUDED.image_key,
         gallery_keys = EXCLUDED.gallery_keys,
         rating = EXCLUDED.rating,
         review_count = EXCLUDED.review_count,
         badge = EXCLUDED.badge,
         best_seller = EXCLUDED.best_seller,
         tagline = EXCLUDED.tagline,
         description = EXCLUDED.description,
         flavor_notes = EXCLUDED.flavor_notes,
         ingredients = EXCLUDED.ingredients,
         allergens = EXCLUDED.allergens,
         nutrition = EXCLUDED.nutrition,
         pairs = EXCLUDED.pairs,
         sort_order = EXCLUDED.sort_order`,
      [
        p.id, p.slug, p.name, p.short_name, p.flavor, p.meat, p.price_cents, p.weight,
        p.image_key, p.gallery_keys, p.rating, p.review_count, p.badge, p.best_seller,
        p.tagline, p.description, p.flavor_notes, p.ingredients, p.allergens,
        JSON.stringify(p.nutrition), p.pairs, true, p.sort_order,
      ]
    );
  }
  console.log(`[seed] Upserted ${productsSeed.length} products`);
}

const FREE_SHIP_CENTS = 4000;
const SHIPPING_CENTS = 599;
const STATUSES = ['paid', 'paid', 'paid', 'fulfilled', 'fulfilled', 'refunded'];
const SAMPLE_NAMES = [
  ['Kate', 'Mills'], ['Curtis', 'Boone'], ['Ryan', 'Vance'], ['Dana', 'Holt'],
  ['Marcus', 'Reed'], ['Lena', 'Frost'], ['Owen', 'Park'], ['Priya', 'Shah'],
  ['Caleb', 'Snow'], ['Nina', 'Ford'], ['Eli', 'Ross'], ['Tara', 'Quinn'],
];

const randId = () =>
  'ord_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seedOrders() {
  const { rows: existing } = await query('SELECT COUNT(*)::int AS c FROM orders');
  if (existing[0].c > 0) {
    console.log(`[seed] Orders already exist (${existing[0].c}) — skipping sample orders`);
    return;
  }

  const ORDER_COUNT = 90;
  let created = 0;

  for (let i = 0; i < ORDER_COUNT; i += 1) {
    const [first, last] = pick(SAMPLE_NAMES);
    const email = `${first}.${last}@example.com`.toLowerCase();
    const daysAgo = randInt(0, 89);
    const createdAt = new Date(Date.now() - daysAgo * 86400000 - randInt(0, 86399) * 1000);
    const status = pick(STATUSES);

    // 1–3 distinct line items
    const lineCount = randInt(1, 3);
    const chosen = [...productsSeed].sort(() => Math.random() - 0.5).slice(0, lineCount);
    const items = chosen.map((p) => ({
      product_id: p.id,
      product_name: p.short_name,
      quantity: randInt(1, 4),
      unit_price_cents: p.price_cents,
    }));

    const subtotal = items.reduce((s, it) => s + it.unit_price_cents * it.quantity, 0);
    const shipping = subtotal >= FREE_SHIP_CENTS ? 0 : SHIPPING_CENTS;
    const total = subtotal + shipping;
    const id = randId() + i;

    await query(
      `INSERT INTO orders (id, customer_name, email, status, subtotal_cents, shipping_cents, total_cents, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, `${first} ${last}`, email, status, subtotal, shipping, total, createdAt.toISOString()]
    );
    for (const it of items) {
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price_cents)
         VALUES ($1,$2,$3,$4,$5)`,
        [id, it.product_id, it.product_name, it.quantity, it.unit_price_cents]
      );
    }
    created += 1;
  }
  console.log(`[seed] Created ${created} sample orders`);
}

export async function runSeed() {
  await ensureSchema();
  await seedAdmin();
  await seedCollections();
  await seedProducts();
  await seedOrders();
}

// Allow running directly: `npm run seed`
const isDirectRun = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isDirectRun) {
  runSeed()
    .then(() => {
      console.log('[seed] Done.');
      return pool.end();
    })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[seed] Failed:', err);
      process.exit(1);
    });
}
