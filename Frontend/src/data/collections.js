import {
  productOriginalBuffalo,
  productTeriyakiElk,
  productSweetPepperedElk,
  productTeriyakiBuffalo,
  productSweetPepperedVenison,
  lifestyleBoard,
} from '../assets';

// Flavor collections preserved from the original "Shop By Flavor Collections" page.
export const collections = [
  {
    id: 'original',
    name: 'Original',
    slug: 'original',
    blurb: 'Honest smoke, clean spice. Where every flavor journey begins.',
    image: productOriginalBuffalo,
    accent: 'ember',
  },
  {
    id: 'teriyaki',
    name: 'Teriyaki',
    slug: 'teriyaki',
    blurb: 'Pineapple and cane sugar glaze over lean mountain game.',
    image: productTeriyakiElk,
    accent: 'teal',
  },
  {
    id: 'sweet-peppered',
    name: 'Sweet Peppered',
    slug: 'sweet-peppered',
    blurb: 'Brown-sugar sweetness met with a confident crack of pepper.',
    image: productSweetPepperedElk,
    accent: 'ember',
  },
  {
    id: 'hot',
    name: 'Hot',
    slug: 'hot',
    blurb: 'A slow-building heat for those who like it bold.',
    image: productTeriyakiBuffalo,
    accent: 'ember',
  },
  {
    id: 'sweet-and-hot',
    name: 'Sweet & Hot',
    slug: 'sweet-and-hot',
    blurb: 'The push-and-pull of sweet glaze and lingering fire.',
    image: productSweetPepperedVenison,
    accent: 'teal',
  },
  {
    id: 'peppered',
    name: 'Peppered',
    slug: 'peppered',
    blurb: 'Cracked black pepper, front and center. Pure and bold.',
    image: lifestyleBoard,
    accent: 'teal',
  },
];

export const getCollectionBySlug = (slug) =>
  collections.find((c) => c.slug === slug);
