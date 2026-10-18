import test from 'node:test';
import assert from 'node:assert/strict';
import { productImage, productImageFit, productPrice } from '../src/utils/productImage.js';

test('NULL and blank prices display quotation pricing without inventing zero', () => {
  assert.equal(productPrice({ estimated_price: null }), 'Request a Quote');
  assert.equal(productPrice({ estimated_price: '' }), 'Request a Quote');
  assert.equal(productPrice({ estimated_price: '1250.00' }), 'PHP 1,250');
});
test('Laravel image paths resolve to the API server and preserve spaces', () => {
  assert.equal(productImage({ image: '/products/Glass%20Door%20Panels.jpg' }), 'http://127.0.0.1:8000/products/Glass%20Door%20Panels.jpg');
  assert.equal(productImage({ image: 'https://example.com/product.png' }), 'https://example.com/product.png');
  assert.equal(productImage({ image: null }), '');
});
test('raw materials, hardware and mirrors remain fully visible', () => {
  for (const name of ['Glass Panels', 'Accessories', 'Mirrors', 'Metal Works', 'Doors']) {
    assert.equal(productImageFit({ category: { name } }), 'contain');
  }
  assert.equal(productImageFit({ category: { name: 'Windows' } }), 'cover');
});
