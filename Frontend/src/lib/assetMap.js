// Maps backend `image_key` values to bundled front-end image assets so the
// dynamic catalog keeps using the original optimized media.
import {
  productOriginalBuffalo,
  productSweetPepperedVenison,
  productSweetPepperedElk,
  productTeriyakiElk,
  productTeriyakiVenison,
  productTeriyakiBuffalo,
  lifestyleBoard,
} from '../assets';

export const imageByKey = {
  originalBuffalo: productOriginalBuffalo,
  sweetPepperedVenison: productSweetPepperedVenison,
  sweetPepperedElk: productSweetPepperedElk,
  teriyakiElk: productTeriyakiElk,
  teriyakiVenison: productTeriyakiVenison,
  teriyakiBuffalo: productTeriyakiBuffalo,
  lifestyleBoard,
};

// Selectable image keys for admin forms (bundled assets).
export const imageKeyOptions = Object.keys(imageByKey);

// Falls back to the lifestyle board if a key is missing or is already a URL.
export const resolveImage = (key) => {
  if (!key) return lifestyleBoard;
  if (key.startsWith('http') || key.startsWith('/') || key.startsWith('data:')) return key;
  return imageByKey[key] || lifestyleBoard;
};
