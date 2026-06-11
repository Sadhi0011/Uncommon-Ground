import { Helmet } from 'react-helmet-async';
import { brand } from '../../data/brand';

export default function Seo({ title, description, image, path = '' }) {
  const fullTitle = title
    ? `${title} | ${brand.name}`
    : `${brand.name} | Premium Utah-Made Jerky`;
  const desc = description || brand.shortPitch;
  const url = `https://uncommongroundutah.com${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
