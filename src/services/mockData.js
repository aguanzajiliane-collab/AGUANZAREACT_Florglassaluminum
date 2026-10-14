// ─── Temporary mock data ────────────────────────────────────────────────────
// Remove this file (and its import in api.js) once the real backend is running.

export const MOCK_USER = {
  id: 1,
  name: 'Juan dela Cruz',
  email: 'juan@example.com',
  role: 'customer',
};

export const MOCK_ADMIN = {
  id: 99,
  name: 'Admin Aguanza',
  email: 'admin@florglassaluminum.ph',
  role: 'admin',
};

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Aluminum Windows', description: 'Sliding, casement, and awning windows.', products_count: 3 },
  { id: 2, name: 'Glass Doors',      description: 'Frameless and framed glass door systems.', products_count: 4 },
  { id: 3, name: 'Curtain Walls',    description: 'Commercial-grade structural curtain wall systems.', products_count: 2 },
  { id: 4, name: 'Shower Enclosures',description: 'Tempered glass shower enclosures and partitions.', products_count: 3 },
  { id: 5, name: 'Railings',         description: 'Glass and aluminum balustrade systems.', products_count: 2 },
];

export const MOCK_PRODUCTS = [
  {
    id: 1, category_id: 1, name: 'Sliding Aluminum Window', type: 'Sliding',
    description: 'Double-track aluminum sliding window with mosquito screen. Available in powder-coat or mill finish.',
    estimated_price: 3500, is_active: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    category: { name: 'Aluminum Windows' },
  },
  {
    id: 2, category_id: 1, name: 'Casement Window', type: 'Casement',
    description: 'Hinged casement window with heavy-duty locking mechanism. Ideal for bedrooms and offices.',
    estimated_price: 4200, is_active: true,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    category: { name: 'Aluminum Windows' },
  },
  {
    id: 3, category_id: 1, name: 'Awning Window', type: 'Awning',
    description: 'Top-hinged awning window; great for ventilation even during light rain.',
    estimated_price: 3800, is_active: true,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    category: { name: 'Aluminum Windows' },
  },
  {
    id: 4, category_id: 2, name: 'Frameless Glass Door', type: 'Frameless',
    description: 'Tempered 10 mm frameless glass door with stainless patch fittings. Modern and minimalist.',
    estimated_price: 18000, is_active: true,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    category: { name: 'Glass Doors' },
  },
  {
    id: 5, category_id: 2, name: 'Aluminum Framed Glass Door', type: 'Framed',
    description: 'Heavy-duty aluminum frame with clear or tinted glass panels. Available in single and double leaf.',
    estimated_price: 12500, is_active: true,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    category: { name: 'Glass Doors' },
  },
  {
    id: 6, category_id: 2, name: 'Folding Glass Door System', type: 'Bi-Fold',
    description: 'Bi-fold glass door perfect for open-plan spaces. Folds neatly to the side.',
    estimated_price: 22000, is_active: true,
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80',
    category: { name: 'Glass Doors' },
  },
  {
    id: 7, category_id: 2, name: 'Automatic Sliding Glass Door', type: 'Automatic',
    description: 'Sensor-activated sliding glass door suitable for commercial entrances.',
    estimated_price: 45000, is_active: true,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    category: { name: 'Glass Doors' },
  },
  {
    id: 8, category_id: 3, name: 'Unitized Curtain Wall', type: 'Unitized',
    description: 'Pre-fabricated curtain wall panels for high-rise and commercial buildings.',
    estimated_price: 120000, is_active: true,
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    category: { name: 'Curtain Walls' },
  },
  {
    id: 9, category_id: 3, name: 'Stick Curtain Wall', type: 'Stick-built',
    description: 'Field-assembled curtain wall system. Flexible design for irregular façades.',
    estimated_price: 85000, is_active: true,
    image: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?w=600&q=80',
    category: { name: 'Curtain Walls' },
  },
  {
    id: 10, category_id: 4, name: 'Walk-in Shower Enclosure', type: 'Walk-in',
    description: 'Open-plan walk-in shower with 8 mm tempered glass panel and chrome fittings.',
    estimated_price: 16000, is_active: true,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
    category: { name: 'Shower Enclosures' },
  },
  {
    id: 11, category_id: 4, name: 'Sliding Shower Enclosure', type: 'Sliding',
    description: 'Space-saving sliding shower door with easy-clean coating.',
    estimated_price: 12000, is_active: true,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
    category: { name: 'Shower Enclosures' },
  },
  {
    id: 12, category_id: 4, name: 'Frameless Shower Cabin', type: 'Frameless',
    description: 'Fully enclosed frameless shower cabin with pivot door. Available in custom sizes.',
    estimated_price: 20000, is_active: true,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
    category: { name: 'Shower Enclosures' },
  },
  {
    id: 13, category_id: 5, name: 'Glass Balustrade', type: 'Balustrade',
    description: 'Frameless glass railing system for balconies and staircases. 12 mm tempered glass.',
    estimated_price: 9500, is_active: true,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
    category: { name: 'Railings' },
  },
  {
    id: 14, category_id: 5, name: 'Aluminum Handrail System', type: 'Handrail',
    description: 'Powder-coated aluminum handrail with tempered glass infill panels.',
    estimated_price: 7500, is_active: true,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
    category: { name: 'Railings' },
  },
];

export const MOCK_REQUESTS = [
  {
    id: 1, project_title: 'Residence Window Replacement', project_location: 'Quezon City',
    project_description: 'Replace all existing wooden windows with new aluminum sliding windows throughout the 2-storey house.',
    preferred_date: '2026-11-15', estimated_budget: 85000, status: 'completed',
    created_at: '2026-08-10T09:00:00Z',
    customer: { name: 'Juan dela Cruz', email: 'juan@example.com' },
    items: [
      { id: 1, quantity: 10, specifications: '4ft x 4ft, powder-coat white', product: { name: 'Sliding Aluminum Window' } },
      { id: 2, quantity: 4,  specifications: '2ft x 3ft, powder-coat white', product: { name: 'Casement Window' } },
    ],
  },
  {
    id: 2, project_title: 'Office Glass Façade', project_location: 'Makati City',
    project_description: 'Install frameless glass doors and a curtain wall system for the ground floor office lobby.',
    preferred_date: '2026-12-01', estimated_budget: 320000, status: 'in_progress',
    created_at: '2026-09-03T14:30:00Z',
    customer: { name: 'Juan dela Cruz', email: 'juan@example.com' },
    items: [
      { id: 3, quantity: 2,  specifications: 'Double-leaf, 10mm tempered glass', product: { name: 'Frameless Glass Door' } },
      { id: 4, quantity: 1,  specifications: '8m wide x 4m height, clear glass', product: { name: 'Stick Curtain Wall' } },
    ],
  },
  {
    id: 3, project_title: 'Condo Shower Upgrade', project_location: 'Pasig City',
    project_description: 'Replace existing shower curtains with a frameless glass enclosure in the master bathroom.',
    preferred_date: '2026-11-05', estimated_budget: 22000, status: 'approved',
    created_at: '2026-10-01T10:00:00Z',
    customer: { name: 'Juan dela Cruz', email: 'juan@example.com' },
    items: [
      { id: 5, quantity: 1, specifications: '900mm x 1800mm, chrome fittings', product: { name: 'Frameless Shower Cabin' } },
    ],
  },
  {
    id: 4, project_title: 'Balcony Glass Railing', project_location: 'Taguig City',
    project_description: 'Install tempered glass balustrade along the 12-meter balcony of a residential unit.',
    preferred_date: '2026-11-20', estimated_budget: 55000, status: 'pending',
    created_at: '2026-10-12T08:45:00Z',
    customer: { name: 'Juan dela Cruz', email: 'juan@example.com' },
    items: [
      { id: 6, quantity: 12, specifications: '1m sections, 12mm tempered glass', product: { name: 'Glass Balustrade' } },
    ],
  },
];

export const MOCK_CUSTOMERS = [
  { id: 1,  name: 'Juan dela Cruz',     email: 'juan@example.com',         created_at: '2026-01-15T00:00:00Z' },
  { id: 2,  name: 'Maria Santos',       email: 'maria.santos@gmail.com',   created_at: '2026-02-03T00:00:00Z' },
  { id: 3,  name: 'Roberto Reyes',      email: 'rreyes@business.ph',       created_at: '2026-03-18T00:00:00Z' },
  { id: 4,  name: 'Ana Flores',         email: 'ana.flores@yahoo.com',     created_at: '2026-04-07T00:00:00Z' },
  { id: 5,  name: 'Carlo Mendoza',      email: 'cmendoza@outlook.com',     created_at: '2026-05-22T00:00:00Z' },
  { id: 6,  name: 'Liza Uy',            email: 'liza.uy@designs.ph',       created_at: '2026-06-11T00:00:00Z' },
  { id: 7,  name: 'Ernesto Garcia',     email: 'egarcia@contractor.ph',    created_at: '2026-07-30T00:00:00Z' },
  { id: 8,  name: 'Kristine Pascual',   email: 'kpascual@email.com',       created_at: '2026-08-14T00:00:00Z' },
];

export const MOCK_DASHBOARD = {
  total_customers: 8,
  total_products: 14,
  pending_requests: 1,
  approved_requests: 1,
  in_progress_requests: 1,
  completed_requests: 1,
};

// ── Mock token / auth ──────────────────────────────────────────────────────
export const MOCK_TOKEN = 'mock-token-florglass-dev';
