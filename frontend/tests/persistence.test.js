import test from 'node:test';
import assert from 'node:assert/strict';
import { readStored, writeStored, removeStored, draftKey } from '../src/utils/persistence.js';
import { mockAdapter } from '../src/services/mockAdapter.js';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_REQUESTS } from '../src/services/mockData.js';

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: key => storage.delete(key),
};
const call = (method, url, body = {}, params = {}) => mockAdapter({ method, url, data: JSON.stringify(body), params });
const original = structuredClone({ products: MOCK_PRODUCTS, categories: MOCK_CATEGORIES, requests: MOCK_REQUESTS });
const resetMemory = () => {
  MOCK_PRODUCTS.splice(0, MOCK_PRODUCTS.length, ...structuredClone(original.products));
  MOCK_CATEGORIES.splice(0, MOCK_CATEGORIES.length, ...structuredClone(original.categories));
  MOCK_REQUESTS.splice(0, MOCK_REQUESTS.length, ...structuredClone(original.requests));
};

test('form draft retains nested fields and clears after save', () => {
  const key = draftKey({ role: 'customer', id: 1 }, 'request');
  const value = { project_title: 'Windows', items: [{ product_id: '1', quantity: 2, specifications: 'Black frame' }] };
  writeStored(key, value);
  assert.deepEqual(readStored(key, {}), value);
  removeStored(key);
  assert.deepEqual(readStored(key, {}), {});
});
test('draft keys separate accounts and individual product edits', () => {
  const key = draftKey({ role: 'admin', id: 1 }, 'product-1');
  assert.notEqual(key, draftKey({ role: 'customer', id: 1 }, 'product-1'));
  assert.notEqual(key, draftKey({ role: 'admin', id: 2 }, 'product-1'));
  assert.notEqual(key, draftKey({ role: 'admin', id: 1 }, 'product-2'));
});
test('malformed storage falls back without breaking the form', () => {
  storage.set('broken', '{invalid');
  assert.deepEqual(readStored('broken', { name: '' }), { name: '' });
});
test('blocked storage leaves forms usable', () => {
  const available = globalThis.localStorage;
  globalThis.localStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  try {
    assert.equal(readStored('key', 'fallback'), 'fallback');
    assert.doesNotThrow(() => writeStored('key', 'edit'));
    assert.doesNotThrow(() => removeStored('key'));
  } finally { globalThis.localStorage = available; }
});
test('mock product updates and deletes survive resetting memory', async () => {
  storage.clear(); resetMemory();
  const id = MOCK_PRODUCTS[0].id;
  await call('put', '/products/'+id, { name: 'Persisted window', category_id: MOCK_CATEGORIES[0].id });
  resetMemory();
  assert.equal((await call('get', '/products/'+id)).data.data.name, 'Persisted window');
  await call('delete', '/products/'+id);
  resetMemory();
  assert.equal((await call('get', '/products/'+id)).data.data, undefined);
});
test('mock category creation and quotation status survive refresh', async () => {
  storage.clear(); resetMemory();
  await call('post', '/categories', { name: 'Saved category', description: 'New work' });
  const id = MOCK_REQUESTS[0].id;
  await call('patch', '/quotation-requests/'+id+'/status', { status: 'quoted', quotation_amount: 15000 });
  resetMemory();
  const categories = (await call('get', '/categories')).data.data;
  assert.ok(categories.some(category => category.name === 'Saved category'));
  const request = (await call('get', '/quotation-requests/'+id)).data.data;
  assert.equal(request.status, 'quoted');
  assert.equal(request.quotation_amount, 15000);
});
test('new mock requests retain line item product details after refresh', async () => {
  storage.clear(); resetMemory();
  const product = MOCK_PRODUCTS[0];
  const created = (await call('post', '/quotation-requests', {
    project_title: 'New windows', project_description: 'For our home',
    items: [{ product_id: product.id, quantity: 2, specifications: 'Black finish' }],
  })).data.data;
  resetMemory();
  const restored = (await call('get', '/quotation-requests/'+created.id)).data.data;
  assert.equal(restored.project_title, 'New windows');
  assert.equal(restored.items[0].product.name, product.name);
  assert.equal(restored.items[0].specifications, 'Black finish');
  assert.equal(restored.status, 'pending');
});
