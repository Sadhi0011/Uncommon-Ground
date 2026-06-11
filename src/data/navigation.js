export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/shop?view=collections' },
  { label: 'About', to: '/about' },
  { label: 'Podcast', to: '/podcast' },
  { label: 'Community', to: '/community' },
  { label: 'Contact', to: '/contact' },
];

export const footerColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Jerky', to: '/shop' },
      { label: 'Original', to: '/shop?collection=original' },
      { label: 'Teriyaki', to: '/shop?collection=teriyaki' },
      { label: 'Sweet Peppered', to: '/shop?collection=sweet-peppered' },
      { label: 'Collections', to: '/shop?view=collections' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Our Story', to: '/about' },
      { label: 'The Podcast', to: '/podcast' },
      { label: 'Community', to: '/community' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Bulk Orders', to: '/contact' },
      { label: 'Wholesale', to: '/contact' },
      { label: 'Retail Partnerships', to: '/contact' },
      { label: 'Your Cart', to: '/cart' },
    ],
  },
];

export const communityImpact = {
  stats: [
    { value: '2022', label: 'Established in Utah' },
    { value: '100%', label: 'Woman-Owned' },
    { value: 'Small', label: 'Batch Crafted' },
    { value: '3+', label: 'Premium Game Meats' },
  ],
  partnerships: [
    {
      title: 'Local Sourcing',
      description:
        'We work with regional suppliers to keep our craft grounded in Utah and our standards uncommonly high.',
    },
    {
      title: 'Neighborhood Events',
      description:
        'From markets to meet-ups, we show up for the community that shows up for us.',
    },
    {
      title: 'The Podcast Platform',
      description:
        'We give local leaders, creators and entrepreneurs a microphone and an audience.',
    },
    {
      title: 'Common-Ground Giving',
      description:
        'A portion of what we build goes back into the people and places that make Springville home.',
    },
  ],
  voices: [
    {
      quote:
        'Uncommon Ground feels like more than a jerky brand — it feels like a neighbor invested in all of us.',
      name: 'A Springville Local',
    },
    {
      quote:
        'They put the community on the mic and actually listen. That is rare.',
      name: 'Podcast Guest',
    },
  ],
};
