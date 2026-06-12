// Central registry of all existing brand media assets.
// Every image/video here was pulled from the original Uncommon Ground site.

import logo from './logo/logo.png';

import productSweetPepperedElk from './images/product-sweet-peppered-elk.jpg';
import productSweetPepperedVenison from './images/product-sweet-peppered-venison.jpg';
import productTeriyakiElk from './images/product-teriyaki-elk.jpg';
import productTeriyakiVenison from './images/product-teriyaki-venison.jpg';
import productTeriyakiBuffalo from './images/product-teriyaki-buffalo.jpg';
import productOriginalBuffalo from './images/product-original-buffalo.jpg';

import lifestyleBoard from './images/lifestyle-board.jpg';

import avatarKate from './images/avatar-kate.png';
import avatarCurtis from './images/avatar-curtis.png';
import avatarRyan from './images/avatar-ryan.png';

import heroVideo from './videos/hero.mp4';

export const assets = {
  logo,
  heroVideo,
  lifestyleBoard,
  products: {
    sweetPepperedElk: productSweetPepperedElk,
    sweetPepperedVenison: productSweetPepperedVenison,
    teriyakiElk: productTeriyakiElk,
    teriyakiVenison: productTeriyakiVenison,
    teriyakiBuffalo: productTeriyakiBuffalo,
    originalBuffalo: productOriginalBuffalo,
  },
  avatars: {
    kate: avatarKate,
    curtis: avatarCurtis,
    ryan: avatarRyan,
  },
};

export {
  logo,
  heroVideo,
  lifestyleBoard,
  productSweetPepperedElk,
  productSweetPepperedVenison,
  productTeriyakiElk,
  productTeriyakiVenison,
  productTeriyakiBuffalo,
  productOriginalBuffalo,
  avatarKate,
  avatarCurtis,
  avatarRyan,
};
