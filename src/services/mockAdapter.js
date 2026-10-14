// ─── Mock API adapter ────────────────────────────────────────────────────────
// Intercepts every axios request when VITE_MOCK_API=true (or when no real API
// URL is set) and returns plausible local data instead.
//
// Remove this file and its import from api.js once the real backend is live.

import {
  MOCK_ADMIN,
  MOCK_CATEGORIES,
  MOCK_CUSTOMERS,
  MOCK_DASHBOARD,
  MOCK_PRODUCTS,
  MOCK_REQUESTS,
  MOCK_TOKEN,
  MOCK_USER,
} from './mockData';

// ── helpers ──────────────────────────────────────────────────────────────────

/** Wrap a plain object in a proper axios-compatible response. */
function axiosOk(data, config) {
  return Promise.resolve({
    data,
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config,
    request: {},
  });
}

function paginate(array, page = 1, perPage = 10) {
  const total = array.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(1, page), lastPage);
  const from = (currentPage - 1) * perPage;
  const data = array.slice(from, from + perPage);
  return {
    data,
    meta: {
      current_page: currentPage,
      last_page: lastPage,
      per_page: perPage,
      total,
      from: from + 1,
      to: from + data.length,
    },
  };
}

/** Which user is mock-logged-in? Persisted in localStorage by the login handler. */
function currentUser() {
  const role = localStorage.getItem('florglass_mock_role') || 'customer';
  return role === 'admin' ? MOCK_ADMIN : MOCK_USER;
}

// ── route table ──────────────────────────────────────────────────────────────
// Each entry: [method, urlPattern, handler(path, body, params) -> plain object]
// The adapter wraps the returned plain object in axiosOk().

const routes = [

  // ── Auth ──────────────────────────────────────────────────────────────────

  ['post', '/login', (path, body) => {
    const isAdmin = String(body?.email || '').includes('admin');
    const user = isAdmin ? MOCK_ADMIN : MOCK_USER;
    localStorage.setItem('florglass_mock_role', user.role);
    return { token: MOCK_TOKEN, user };
  }],

  ['post', '/register', (path, body) => {
    const user = { ...MOCK_USER, name: body?.name || 'New User', email: body?.email || MOCK_USER.email };
    localStorage.setItem('florglass_mock_role', 'customer');
    return { token: MOCK_TOKEN, user };
  }],

  ['post', '/logout', () => {
    localStorage.removeItem('florglass_mock_role');
    return {};
  }],

  ['get', '/user', () => ({ data: currentUser() })],

  // ── Dashboard ─────────────────────────────────────────────────────────────

  ['get', '/dashboard', () => ({ data: MOCK_DASHBOARD })],

  // ── Categories ────────────────────────────────────────────────────────────

  ['get', '/categories', () => ({ data: MOCK_CATEGORIES })],

  ['post', '/categories', (path, body) => {
    const cat = { id: Date.now(), products_count: 0, ...body };
    MOCK_CATEGORIES.push(cat);
    return { data: cat };
  }],

  ['put', /\/categories\/\d+$/, (path, body) => {
    const id = Number(path.split('/').pop());
    const idx = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (idx !== -1) Object.assign(MOCK_CATEGORIES[idx], body);
    return { data: MOCK_CATEGORIES[idx] };
  }],

  ['delete', /\/categories\/\d+$/, (path) => {
    const id = Number(path.split('/').pop());
    const idx = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (idx !== -1) MOCK_CATEGORIES.splice(idx, 1);
    return {};
  }],

  // ── Products ──────────────────────────────────────────────────────────────

  ['get', /\/products\/\d+$/, (path) => {
    const id = Number(path.split('/').pop());
    return { data: MOCK_PRODUCTS.find(p => p.id === id) };
  }],

  ['get', '/products', (path, body, params) => {
    let list = [...MOCK_PRODUCTS];
    if (params?.search) list = list.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
    if (params?.category_id) list = list.filter(p => p.category_id === Number(params.category_id));
    return paginate(list, Number(params?.page) || 1, Number(params?.per_page) || 10);
  }],

  ['post', '/products', (path, body) => {
    const product = {
      id: Date.now(),
      is_active: true,
      category: MOCK_CATEGORIES.find(c => c.id === Number(body.category_id)),
      ...body,
    };
    MOCK_PRODUCTS.push(product);
    return { data: product };
  }],

  ['put', /\/products\/\d+$/, (path, body) => {
    const id = Number(path.split('/').pop());
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      Object.assign(MOCK_PRODUCTS[idx], body);
      MOCK_PRODUCTS[idx].category = MOCK_CATEGORIES.find(c => c.id === Number(body.category_id));
    }
    return { data: MOCK_PRODUCTS[idx] };
  }],

  ['delete', /\/products\/\d+$/, (path) => {
    const id = Number(path.split('/').pop());
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) MOCK_PRODUCTS.splice(idx, 1);
    return {};
  }],

  // ── Quotation requests ────────────────────────────────────────────────────

  ['get', /\/quotation-requests\/\d+$/, (path) => {
    const id = Number(path.split('/').pop());
    return { data: MOCK_REQUESTS.find(r => r.id === id) };
  }],

  ['get', '/quotation-requests', (path, body, params) => {
    const user = currentUser();
    let list = user.role === 'admin'
      ? MOCK_REQUESTS
      : MOCK_REQUESTS.filter(r => r.customer.email === user.email);
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(r =>
        r.project_title.toLowerCase().includes(q) ||
        r.customer.name.toLowerCase().includes(q)
      );
    }
    if (params?.status) list = list.filter(r => r.status === params.status);
    return paginate(list, Number(params?.page) || 1, Number(params?.per_page) || 10);
  }],

  ['post', '/quotation-requests', (path, body) => {
    const user = currentUser();
    const req = {
      id: Date.now(),
      status: 'pending',
      created_at: new Date().toISOString(),
      customer: { name: user.name, email: user.email },
      items: (body.items || []).map((item, i) => ({
        id: i + 1,
        ...item,
        product: MOCK_PRODUCTS.find(p => p.id === Number(item.product_id)) || { name: 'Unknown product' },
      })),
      ...body,
    };
    MOCK_REQUESTS.unshift(req);
    return { data: req };
  }],

  ['patch', /\/quotation-requests\/\d+\/status$/, (path, body) => {
    const parts = path.split('/');
    // path looks like /quotation-requests/42/status
    const id = Number(parts[parts.length - 2]);
    const req = MOCK_REQUESTS.find(r => r.id === id);
    if (req) req.status = body.status;
    return { data: req };
  }],

  // ── Customers ─────────────────────────────────────────────────────────────

  ['get', '/customers', () => ({ data: MOCK_CUSTOMERS })],
];

// ── matcher ──────────────────────────────────────────────────────────────────

function findRoute(method, path) {
  for (const [m, pattern, handler] of routes) {
    if (m !== method) continue;
    if (typeof pattern === 'string' && path.endsWith(pattern)) return handler;
    if (pattern instanceof RegExp && pattern.test(path)) return handler;
  }
  return null;
}

// ── axios adapter ─────────────────────────────────────────────────────────────
// A custom axios adapter must return a Promise that resolves to an object with
// at minimum: { data, status, statusText, headers, config }.

export function mockAdapter(config) {
  const method = (config.method || 'get').toLowerCase();

  // Strip base URL so matching works against the path alone (e.g. /products)
  const baseURL = (config.baseURL || '').replace(/\/$/, '');
  const rawUrl = config.url || '';
  const path = rawUrl.startsWith(baseURL) ? rawUrl.slice(baseURL.length) : rawUrl;

  const handler = findRoute(method, path);
  if (!handler) {
    console.warn('[mock] unhandled', method.toUpperCase(), path);
    return axiosOk({ data: [], meta: { total: 0 } }, config);
  }

  let body = {};
  try { body = JSON.parse(config.data || '{}'); } catch { /* ignore */ }
  const params = config.params || {};

  const result = handler(path, body, params);
  return axiosOk(result, config);
}
