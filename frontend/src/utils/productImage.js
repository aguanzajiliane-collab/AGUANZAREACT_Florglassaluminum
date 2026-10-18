// Product image paths come from Laravel, never category stock-photo fallbacks.
export function productImage(product) {
  if (!product?.image) return '';
  const apiUrl = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:8000/api';
  return new URL(product.image, new URL(apiUrl).origin).href;
}

export function productImageFit(product) {
  return product.category?.name === 'Windows' ? 'cover' : 'contain';
}

export function productPrice(product) {
  return product.estimated_price == null || product.estimated_price === ''
    ? 'Request a Quote'
    : `PHP ${Number(product.estimated_price).toLocaleString()}`;
}
