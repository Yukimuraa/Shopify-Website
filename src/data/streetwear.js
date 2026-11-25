export const STREETWEAR_MODELS = [
  {
    id: 'model-09',
    label: 'MODEL 09',
    image: '/images/streetwear/model-09.png',
    alt: 'TEMPUS Streetwear Model 09 — Black oversized tee, wide black washed denim, and sneakers',
  },
  {
    id: 'model-10',
    label: 'MODEL 10',
    image: '/images/streetwear/model-10.png',
    alt: 'TEMPUS Streetwear Model 10 — Yankees cap, cropped white tee, and wide black denim',
  },
  {
    id: 'model-11',
    label: 'MODEL 11',
    image: '/images/streetwear/model-11.png',
    alt: 'TEMPUS Streetwear Model 11 — White oversized tee, washed charcoal wide denim, and sneakers',
  },
  {
    id: 'model-12',
    label: 'MODEL 12',
    image: '/images/streetwear/model-12.png',
    alt: 'TEMPUS Streetwear Model 12 — Black beanie, heather gray tracksuit, and brown slouchy bag',
  },
];

export function getStreetwearModelById(id) {
  return STREETWEAR_MODELS.find((m) => m.id === id) || null;
}
