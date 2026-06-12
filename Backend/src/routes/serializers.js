// Map DB rows to the client-facing shape used by the React front-end.

export function serializeProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    flavor: row.flavor,
    meat: row.meat,
    price: row.price_cents / 100,
    priceCents: row.price_cents,
    weight: row.weight,
    imageKey: row.image_key,
    galleryKeys: row.gallery_keys || [],
    rating: row.rating != null ? Number(row.rating) : 0,
    reviewCount: row.review_count,
    badge: row.badge,
    bestSeller: row.best_seller,
    tagline: row.tagline,
    description: row.description || [],
    flavorNotes: row.flavor_notes || [],
    ingredients: row.ingredients,
    allergens: row.allergens,
    nutrition: row.nutrition || {},
    pairs: row.pairs || [],
    active: row.active,
  };
}

export function serializeCollection(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    blurb: row.blurb,
    imageKey: row.image_key,
    accent: row.accent,
  };
}

export function serializeUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
}
