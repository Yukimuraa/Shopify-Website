export const SIZES = ['S', 'M', 'L', 'XL'];

/**
 * Centralized product catalog.
 * Shared garments (leather-jacket-01, long-charcoal-01) live once here
 * and are referenced by ID across multiple looks.
 * Models 05 and 06 jeans remain separate products with distinct IDs.
 */
export const PRODUCTS = {
  'leather-jacket-01': {
    id: 'leather-jacket-01',
    name: 'Leather Jacket 01',
    category: 'Outerwear',
    price: 680,
    image: '/images/products/leather-jacket-01.png',
    sizes: SIZES,
    modelIds: ['look-01', 'look-02'],
  },
  'pants-01': {
    id: 'pants-01',
    name: 'Pants 01',
    category: 'Denim',
    price: 290,
    image: '/images/products/pants-01.png',
    sizes: SIZES,
    modelIds: ['look-01'],
  },
  'pants-02': {
    id: 'pants-02',
    name: 'Pants 02',
    category: 'Denim',
    price: 270,
    image: '/images/products/pants-02.png',
    sizes: SIZES,
    modelIds: ['look-02'],
  },
  'long-charcoal-01': {
    id: 'long-charcoal-01',
    name: 'Long Charcoal 01',
    category: 'Outerwear',
    price: 790,
    image: '/images/products/long-charcoal-01.png',
    sizes: SIZES,
    modelIds: ['look-03', 'look-04'],
  },
  'pants-03': {
    id: 'pants-03',
    name: 'Pants 03',
    category: 'Denim',
    price: 280,
    image: '/images/products/pants-03.png',
    sizes: SIZES,
    modelIds: ['look-03'],
  },
  'pants-04': {
    id: 'pants-04',
    name: 'Pants 04',
    category: 'Denim',
    price: 295,
    image: '/images/products/pants-04.png',
    sizes: SIZES,
    modelIds: ['look-04'],
  },
  'model-05-black-leather-bomber-jacket': {
    id: 'model-05-black-leather-bomber-jacket',
    name: 'Black Leather Bomber Jacket',
    category: 'Outerwear',
    price: 720,
    image: '/images/products/model-05-black-leather-bomber-jacket.png',
    sizes: SIZES,
    modelIds: ['look-05'],
  },
  'model-05-classic-blue-denim-jeans': {
    id: 'model-05-classic-blue-denim-jeans',
    name: 'Classic Blue Denim Jeans',
    category: 'Denim',
    price: 275,
    image: '/images/products/model-05-classic-blue-denim-jeans.png',
    sizes: SIZES,
    modelIds: ['look-05'],
  },
  'model-06-black-leather-jacket': {
    id: 'model-06-black-leather-jacket',
    name: 'Black Leather Jacket',
    category: 'Outerwear',
    price: 740,
    image: '/images/products/model-06-black-leather-jacket.png',
    sizes: SIZES,
    modelIds: ['look-06'],
  },
  'model-06-classic-blue-denim-jeans': {
    id: 'model-06-classic-blue-denim-jeans',
    name: 'Classic Blue Denim Jeans',
    category: 'Denim',
    price: 285,
    image: '/images/products/model-06-classic-blue-denim-jeans.png',
    sizes: SIZES,
    modelIds: ['look-06'],
  },
};

/**
 * Product assignments per model look ID.
 */
export const MODEL_PRODUCT_IDS = {
  'look-01': ['leather-jacket-01', 'pants-01'],
  'look-02': ['leather-jacket-01', 'pants-02'],
  'look-03': ['long-charcoal-01', 'pants-03'],
  'look-04': ['long-charcoal-01', 'pants-04'],
  'look-05': [
    'model-05-black-leather-bomber-jacket',
    'model-05-classic-blue-denim-jeans',
  ],
  'look-06': [
    'model-06-black-leather-jacket',
    'model-06-classic-blue-denim-jeans',
  ],
};

export function getProductsForModel(modelId) {
  const ids = MODEL_PRODUCT_IDS[modelId] || [];
  return ids.map((id) => PRODUCTS[id]).filter(Boolean);
}

export function formatPrice(amount) {
  return `$${amount.toLocaleString('en-US')}`;
}
