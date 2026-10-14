const categoryImages = {
  Windows: 'https://otrackegypt.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-22-at-4.29.59-PM-1024x731-optimized.jpeg',
  Doors: 'https://blob.prosgrade.com/uploads/business-gallery/business-32954/photo-04.png',
  'Glass Works': 'https://gunakasihaluminium.com/wp-content/uploads/2021/08/etalase-aluminium.jpg',
  'Security Works': 'https://blob.prosgrade.com/uploads/business-gallery/business-32954/photo-04.png',
  'Roofing & Canopies': 'https://www.doorclosersusa.com/v/vspfiles/assets/images/custom%20storefront.jpg',
  'Aluminum Layouts': 'https://otrackegypt.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-22-at-4.29.59-PM-1024x731-optimized.jpeg',
};

export function productImage(product) {
  return product.image || categoryImages[product.category?.name] || categoryImages['Glass Works'];
}
