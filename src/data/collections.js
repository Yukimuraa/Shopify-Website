export const EDITORIAL_COLLECTIONS = [
  {
    id: 'collection-01',
    slug: 'the-duo',
    number: 'COLLECTION 01',
    title: 'THE DUO',
    cta: 'DISCOVER THE LOOK',
    image: '/images/collections/collection-01-duo.jpg',
    alt: 'TEMPUS Collection 01 — THE DUO featuring Models 01 and 02 in brown leather jackets and denim',
    textTheme: 'light',
    modelIds: ['look-01', 'look-02'],
    subtitle: 'Models 01 & 02 — Shared leather silhouettes paired with tailored indigo denim.',
  },
  {
    id: 'collection-02',
    slug: 'the-form',
    number: 'COLLECTION 02',
    title: 'THE FORM',
    cta: 'DISCOVER THE LOOK',
    image: '/images/collections/collection-02-form.jpg',
    alt: 'TEMPUS Collection 02 — THE FORM featuring Models 03 and 04 in long charcoal wool coats',
    textTheme: 'dark',
    modelIds: ['look-03', 'look-04'],
    subtitle: 'Models 03 & 04 — Architectural wool tailoring and structured proportions.',
  },
  {
    id: 'collection-03',
    slug: 'the-connection',
    number: 'COLLECTION 03',
    title: 'THE CONNECTION',
    cta: 'DISCOVER THE LOOK',
    image: '/images/collections/collection-03-connection.jpg',
    alt: 'TEMPUS Collection 03 — THE CONNECTION featuring Models 05 and 06 in black leather outerwear',
    textTheme: 'dark',
    modelIds: ['look-05', 'look-06'],
    subtitle: 'Models 05 & 06 — Monochrome black leather paired with classic blue denim.',
  },
  {
    id: 'collection-04',
    slug: 'the-new-class',
    number: 'COLLECTION 04',
    title: 'THE NEW CLASS',
    cta: 'DISCOVER THE LOOK',
    image: '/images/collections/collection-04-new-class.jpg',
    alt: 'TEMPUS Collection 04 — THE NEW CLASS featuring Models 07 and 08 in crew-neck tees and denim',
    textTheme: 'light',
    modelIds: ['look-07', 'look-08'],
    subtitle: 'Models 07 & 08 — Essential crew-neck tees paired with relaxed blue and stonewashed denim.',
  },
];

export function getCollectionBySlug(slug) {
  return EDITORIAL_COLLECTIONS.find((c) => c.slug === slug) || null;
}
