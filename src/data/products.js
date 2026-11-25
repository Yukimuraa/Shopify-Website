export const SIZES = ['S', 'M', 'L', 'XL'];

/**
 * Centralized product catalog.
 * Shared garments (leather-jacket-01, long-charcoal-01) live once here
 * and are referenced by ID across multiple looks.
 */
export const PRODUCTS = {
  'leather-jacket-01': {
    id: 'leather-jacket-01',
    name: 'Leather Jacket 01',
    category: 'Outerwear',
    price: 680,
    image: '/images/products/leather-jacket-01.png',
    sizes: SIZES,
    colors: [
      { name: 'Espresso', hex: '#3D2B22' },
      { name: 'Black', hex: '#141414' },
    ],
    modelIds: ['look-01', 'look-02'],
  },
  'pants-01': {
    id: 'pants-01',
    name: 'Pants 01',
    category: 'Denim',
    price: 290,
    image: '/images/products/pants-01.png',
    sizes: SIZES,
    colors: [
      { name: 'Deep Indigo', hex: '#1E2D46' },
      { name: 'Washed Black', hex: '#232325' },
    ],
    modelIds: ['look-01'],
  },
  'pants-02': {
    id: 'pants-02',
    name: 'Pants 02',
    category: 'Denim',
    price: 270,
    image: '/images/products/pants-02.png',
    sizes: SIZES,
    colors: [
      { name: 'Classic Blue', hex: '#2B4C7E' },
      { name: 'Charcoal', hex: '#2D2E30' },
    ],
    modelIds: ['look-02'],
  },
  'long-charcoal-01': {
    id: 'long-charcoal-01',
    name: 'Long Charcoal 01',
    category: 'Outerwear',
    price: 790,
    image: '/images/products/long-charcoal-01.png',
    sizes: SIZES,
    colors: [
      { name: 'Charcoal', hex: '#2B2C2E' },
      { name: 'Black', hex: '#111111' },
    ],
    modelIds: ['look-03', 'look-04'],
  },
  'pants-03': {
    id: 'pants-03',
    name: 'Pants 03',
    category: 'Denim',
    price: 280,
    image: '/images/products/pants-03.png',
    sizes: SIZES,
    colors: [
      { name: 'Light Wash', hex: '#6F8FAF' },
      { name: 'Indigo', hex: '#243652' },
    ],
    modelIds: ['look-03'],
  },
  'pants-04': {
    id: 'pants-04',
    name: 'Pants 04',
    category: 'Denim',
    price: 295,
    image: '/images/products/pants-04.png',
    sizes: SIZES,
    colors: [
      { name: 'Dark Indigo', hex: '#1C283B' },
      { name: 'Slate', hex: '#393D42' },
    ],
    modelIds: ['look-04'],
  },
  'model-05-black-leather-bomber-jacket': {
    id: 'model-05-black-leather-bomber-jacket',
    name: 'Black Leather Bomber Jacket',
    category: 'Outerwear',
    price: 720,
    image: '/images/products/model-05-black-leather-bomber-jacket.png',
    sizes: SIZES,
    colors: [
      { name: 'Black', hex: '#141414' },
      { name: 'Espresso', hex: '#3D2B22' },
    ],
    modelIds: ['look-05'],
  },
  'model-05-classic-blue-denim-jeans': {
    id: 'model-05-classic-blue-denim-jeans',
    name: 'Classic Blue Denim Jeans',
    category: 'Denim',
    price: 275,
    image: '/images/products/model-05-classic-blue-denim-jeans.png',
    sizes: SIZES,
    colors: [
      { name: 'Classic Blue', hex: '#2E5283' },
      { name: 'Black', hex: '#18181A' },
    ],
    modelIds: ['look-05'],
  },
  'model-06-black-leather-jacket': {
    id: 'model-06-black-leather-jacket',
    name: 'Black Leather Jacket',
    category: 'Outerwear',
    price: 740,
    image: '/images/products/model-06-black-leather-jacket.png',
    sizes: SIZES,
    colors: [
      { name: 'Black', hex: '#141414' },
      { name: 'Charcoal', hex: '#2C2D30' },
    ],
    modelIds: ['look-06'],
  },
  'model-06-classic-blue-denim-jeans': {
    id: 'model-06-classic-blue-denim-jeans',
    name: 'Classic Blue Denim Jeans',
    category: 'Denim',
    price: 285,
    image: '/images/products/model-06-classic-blue-denim-jeans.png',
    sizes: SIZES,
    colors: [
      { name: 'Classic Blue', hex: '#294B7A' },
      { name: 'Deep Indigo', hex: '#1B2A42' },
    ],
    modelIds: ['look-06'],
  },
  'model-07-black-crew-neck-tshirt': {
    id: 'model-07-black-crew-neck-tshirt',
    name: 'Black Crew-Neck T-Shirt',
    category: 'Tops',
    price: 110,
    image: '/images/products/model-07-black-crew-neck-tshirt.png',
    sizes: SIZES,
    colors: [
      { name: 'Black', hex: '#141414' },
      { name: 'Charcoal', hex: '#343538' },
    ],
    modelIds: ['look-07'],
  },
  'model-07-blue-denim-jeans': {
    id: 'model-07-blue-denim-jeans',
    name: 'Blue Denim Jeans',
    category: 'Denim',
    price: 280,
    image: '/images/products/model-07-blue-denim-jeans.png',
    sizes: SIZES,
    colors: [
      { name: 'Classic Blue', hex: '#284B7E' },
      { name: 'Deep Indigo', hex: '#1A2840' },
    ],
    modelIds: ['look-07'],
  },
  'model-08-white-crew-neck-tshirt': {
    id: 'model-08-white-crew-neck-tshirt',
    name: 'White Crew-Neck T-Shirt',
    category: 'Tops',
    price: 110,
    image: '/images/products/model-08-white-crew-neck-tshirt.png',
    sizes: SIZES,
    colors: [
      { name: 'White', hex: '#F4F4F2' },
      { name: 'Off-White', hex: '#E5E1D8' },
    ],
    modelIds: ['look-08'],
  },
  'model-08-gray-stonewashed-jeans': {
    id: 'model-08-gray-stonewashed-jeans',
    name: 'Gray Stonewashed Jeans',
    category: 'Denim',
    price: 290,
    image: '/images/products/model-08-gray-stonewashed-jeans.png',
    sizes: SIZES,
    colors: [
      { name: 'Stonewashed Gray', hex: '#6E7175' },
      { name: 'Washed Black', hex: '#262729' },
    ],
    modelIds: ['look-08'],
  },
  'black-oversized-tshirt': {
    id: 'black-oversized-tshirt',
    name: 'Black Oversized T-Shirt',
    category: 'Tops',
    price: 110,
    description: 'Heavyweight dropped-shoulder cotton jersey in deep black.',
    image: '/images/products/black-oversized-tshirt.png',
    sizes: SIZES,
    colors: [{ name: 'Black', hex: '#141414' }],
    modelIds: ['model-09'],
  },
  'acid-wash-charcoal-baggy-jeans': {
    id: 'acid-wash-charcoal-baggy-jeans',
    name: 'Acid-Wash Charcoal Baggy Jeans',
    category: 'Denim',
    price: 290,
    description: 'Wide-leg acid-washed charcoal denim with relaxed drape.',
    image: '/images/products/acid-wash-charcoal-baggy-jeans.png',
    sizes: SIZES,
    colors: [{ name: 'Acid-Wash Charcoal', hex: '#27282A' }],
    modelIds: ['model-09', 'model-10'],
  },
  'white-crew-neck-tshirt': {
    id: 'white-crew-neck-tshirt',
    name: 'White Crew-Neck T-Shirt',
    category: 'Tops',
    price: 110,
    description: 'Structured heavyweight organic cotton crew-neck tee.',
    image: '/images/products/white-crew-neck-tshirt.png',
    sizes: SIZES,
    colors: [{ name: 'White', hex: '#F4F4F2' }],
    modelIds: ['model-10', 'model-11'],
  },
  'charcoal-washed-baggy-jeans': {
    id: 'charcoal-washed-baggy-jeans',
    name: 'Charcoal Washed Baggy Jeans',
    category: 'Denim',
    price: 290,
    description: 'Sun-faded charcoal wide-leg denim with full-length stack.',
    image: '/images/products/charcoal-washed-baggy-jeans.png',
    sizes: SIZES,
    colors: [{ name: 'Charcoal Washed', hex: '#3B3D40' }],
    modelIds: ['model-11'],
  },
  'gray-fleece-hoodie': {
    id: 'gray-fleece-hoodie',
    name: 'Hoodie',
    category: 'Outerwear',
    price: 240,
    description: 'Brushed heavyweight heather gray fleece hoodie.',
    image: '/images/products/gray-fleece-hoodie.png',
    sizes: SIZES,
    colors: [{ name: 'Heather Gray', hex: '#B4B7BC' }],
    modelIds: ['model-12'],
  },
  'oversized-fleece-sweatpants': {
    id: 'oversized-fleece-sweatpants',
    name: 'Oversized Fleece Sweatpants',
    category: 'Bottoms',
    price: 210,
    description: 'Relaxed-fit heather gray fleece sweatpants with drawcord waist.',
    image: '/images/products/oversized-fleece-sweatpants.png',
    sizes: SIZES,
    colors: [{ name: 'Heather Gray', hex: '#B4B7BC' }],
    modelIds: ['model-12'],
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
  'look-07': [
    'model-07-black-crew-neck-tshirt',
    'model-07-blue-denim-jeans',
  ],
  'look-08': [
    'model-08-white-crew-neck-tshirt',
    'model-08-gray-stonewashed-jeans',
  ],
  'model-09': ['black-oversized-tshirt', 'acid-wash-charcoal-baggy-jeans'],
  'model-10': ['white-crew-neck-tshirt', 'acid-wash-charcoal-baggy-jeans'],
  'model-11': ['white-crew-neck-tshirt', 'charcoal-washed-baggy-jeans'],
  'model-12': ['gray-fleece-hoodie', 'oversized-fleece-sweatpants'],
};

export function getProductsForModel(modelId) {
  const ids = MODEL_PRODUCT_IDS[modelId] || [];
  return ids.map((id) => PRODUCTS[id]).filter(Boolean);
}

export function formatPrice(amount) {
  return `$${amount.toLocaleString('en-US')}`;
}
