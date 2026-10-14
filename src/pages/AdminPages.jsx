import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { Alert, Button, FormInput, LoadingSpinner, Pagination, StatusBadge } from '../components/Ui';

const errorMessage = (error) => error.response?.data?.message || 'The request could not be completed.';

export function AdminDashboard() {
  const [data, setData] = useState();
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/quotation-requests', { params: { per_page: 5 } })])
      .then(([dashboard, requests]) => { setData(dashboard.data.data); setRecentRequests(requests.data.data); });
  }, []);

  if (!data) return <LoadingSpinner />;

  const metrics = [
    ['Customers', data.total_customers, 'people'], ['Products & services', data.total_products, 'products'],
    ['Pending requests', data.pending_requests, 'pending'], ['Approved', data.approved_requests, 'approved'],
    ['In progress', data.in_progress_requests, 'progress'], ['Completed', data.completed_requests, 'completed'],
  ];

  return <section className="admin-dashboard"><div className="dashboard-hero"><div><p className="eyebrow">ADMIN OVERVIEW</p><h1>Keep every project moving.</h1><p>Monitor customer requests, update fabrication progress, and keep FlorGlassAluminum operations organized.</p></div><div className="hero-request"><span>Needs attention</span><strong>{data.pending_requests}</strong><p>pending quotation requests</p><Link className="button" to="/admin/requests">Review requests</Link></div></div><div className="metric-grid">{metrics.map(([label, value, style]) => <article className={`metric-card ${style}`} key={label}><span className="metric-mark" aria-hidden="true" /><p>{label}</p><strong>{Number(value).toLocaleString()}</strong></article>)}</div><div className="dashboard-lower"><article className="recent-panel"><div className="panel-heading"><div><p className="eyebrow">LATEST ACTIVITY</p><h2>Recent quotation requests</h2></div><Link to="/admin/requests">View all</Link></div>{recentRequests.length ? <div className="recent-list">{recentRequests.map((request) => <Link className="recent-request" to={`/admin/requests/${request.id}`} key={request.id}><span className="request-avatar">{request.customer.name.charAt(0)}</span><span><b>{request.project_title}</b><small>{request.customer.name} - {new Date(request.created_at).toLocaleDateString()}</small></span><StatusBadge status={request.status} /></Link>)}</div> : <p className="empty-copy">No quotation requests yet.</p>}</article><aside className="quick-panel"><p className="eyebrow">QUICK ACTIONS</p><h2>Manage your catalog</h2><p>Keep services and product categories ready for new customer requests.</p><Link to="/admin/products/create">Add product / service</Link><Link to="/admin/categories">Manage categories</Link><Link to="/admin/customers">View customers</Link></aside></div></section>;
}

export function AdminRequests() {
  const [items, setItems] = useState([]); const [meta, setMeta] = useState(); const [filters, setFilters] = useState({ search: '', status: '' });
  const load = async (page = 1) => { const response = await api.get('/quotation-requests', { params: { ...filters, page } }); setItems(response.data.data); setMeta(response.data.meta); };
  useEffect(() => { load(); }, []);
  return <section><h1>Quotation requests</h1><div className="filters"><input placeholder="Search project or customer" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /><select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option>{['pending', 'approved', 'in_progress', 'completed', 'rejected'].map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select><Button onClick={() => load()}>Filter</Button></div><div className="table-wrap"><table><thead><tr><th>ID</th><th>Customer</th><th>Project</th><th>Budget</th><th>Status</th><th /></tr></thead><tbody>{items.map((request) => <tr key={request.id}><td>#{request.id}</td><td>{request.customer.name}</td><td>{request.project_title}</td><td>PHP {request.estimated_budget}</td><td><StatusBadge status={request.status} /></td><td><Link to={`/admin/requests/${request.id}`}>Manage</Link></td></tr>)}</tbody></table></div><Pagination meta={meta} onChange={load} /></section>;
}

export function AdminRequestDetail() {
  const { id } = useParams(); const [request, setRequest] = useState(); const [error, setError] = useState('');
  const load = async () => { const response = await api.get(`/quotation-requests/${id}`); setRequest(response.data.data); };
  useEffect(() => { load().catch((e) => setError(errorMessage(e))); }, [id]);
  const updateStatus = async (status) => { try { await api.patch(`/quotation-requests/${id}/status`, { status }); await load(); } catch (e) { setError(errorMessage(e)); } };
  if (!request) return <LoadingSpinner />;
  const next = { pending: ['approved', 'rejected'], approved: ['in_progress'], in_progress: ['completed'] }[request.status] || [];
  return <section><h1>{request.project_title}</h1><p><b>{request.customer.name}</b> - {request.customer.email}</p><StatusBadge status={request.status} /><Alert message={error} /><p>{request.project_description}</p><h2>Requested services</h2>{request.items.map((item) => <article className="card" key={item.id}><b>{item.product.name}</b> x {item.quantity}<p>{item.specifications}</p></article>)}{next.length > 0 && <><h2>Update request status</h2>{next.map((status) => <Button key={status} onClick={() => updateStatus(status)}>Mark {status.replace('_', ' ')}</Button>)}</>}</section>;
}

export function AdminCategories() {
  const [categories, setCategories] = useState([]); const [form, setForm] = useState({ name: '', description: '' }); const [editing, setEditing] = useState(null); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  const load = () => api.get('/categories').then((response) => setCategories(response.data.data)); useEffect(() => { load(); }, []);
  const submit = async (event) => { event.preventDefault(); setError(''); try { if (editing) await api.put(`/categories/${editing}`, form); else await api.post('/categories', form); setMessage('Category saved successfully.'); setForm({ name: '', description: '' }); setEditing(null); load(); } catch (e) { setError(errorMessage(e)); } };
  const remove = async (category) => { if (!window.confirm(`Delete ${category.name}?`)) return; try { await api.delete(`/categories/${category.id}`); load(); } catch (e) { setError(errorMessage(e)); } };
  return <section><h1>Categories</h1><Alert message={message} type="success" /><Alert message={error} /><form className="form-card" onSubmit={submit}><FormInput label="Category name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><label className="field">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><Button>{editing ? 'Save changes' : 'Add category'}</Button> {editing && <Button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }}>Cancel</Button>}</form><div className="table-wrap"><table><thead><tr><th>Name</th><th>Description</th><th>Products</th><th /></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td>{category.name}</td><td>{category.description}</td><td>{category.products_count}</td><td><button onClick={() => { setEditing(category.id); setForm({ name: category.name, description: category.description || '' }); }}>Edit</button> <button onClick={() => remove(category)}>Delete</button></td></tr>)}</tbody></table></div></section>;
}

export function AdminProducts() {
  const [products, setProducts] = useState([]); const [error, setError] = useState(''); const load = () => api.get('/products', { params: { per_page: 100 } }).then((response) => setProducts(response.data.data)); useEffect(() => { load(); }, []);
  const remove = async (product) => { if (!window.confirm(`Delete ${product.name}?`)) return; try { await api.delete(`/products/${product.id}`); load(); } catch (e) { setError(errorMessage(e)); } };
  return <section><h1>Products / services</h1><Link className="button" to="/admin/products/create">Add product</Link><Alert message={error} /><div className="table-wrap"><table><thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Status</th><th /></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.category?.name}</td><td>PHP {product.estimated_price}</td><td>{product.is_active ? 'Active' : 'Inactive'}</td><td><Link to={`/admin/products/${product.id}/edit`}>Edit</Link> <button onClick={() => remove(product)}>Delete</button></td></tr>)}</tbody></table></div></section>;
}

export function ProductEditor() {
  const { id } = useParams(); const navigate = useNavigate(); const [categories, setCategories] = useState([]); const [form, setForm] = useState({ category_id: '', name: '', description: '', type: '', estimated_price: '', image: '', is_active: true }); const [error, setError] = useState('');
  useEffect(() => { api.get('/categories').then((r) => setCategories(r.data.data)); if (id) api.get(`/products/${id}`).then((r) => { const product = r.data.data; setForm({ ...product, category_id: String(product.category_id), estimated_price: String(product.estimated_price) }); }); }, [id]);
  const submit = async (event) => { event.preventDefault(); try { const payload = { ...form, category_id: Number(form.category_id), estimated_price: Number(form.estimated_price), is_active: Boolean(form.is_active) }; if (id) await api.put(`/products/${id}`, payload); else await api.post('/products', payload); navigate('/admin/products'); } catch (e) { setError(errorMessage(e)); } };
  return <section><h1>{id ? 'Edit product / service' : 'Add product / service'}</h1><Alert message={error} /><form className="form-card" onSubmit={submit}><label className="field">Category<select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><FormInput label="Service name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><FormInput label="Type" required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /><FormInput label="Estimated starting price" type="number" min="0" required value={form.estimated_price} onChange={(e) => setForm({ ...form, estimated_price: e.target.value })} /><FormInput label="Project image URL (optional)" type="url" placeholder="https://..." value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} /><label className="field">Description<textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Available for quotation</label><p><Button>Save product</Button></p></form></section>;
}

export function AdminCustomers() { const [customers, setCustomers] = useState([]); useEffect(() => { api.get('/customers').then((response) => setCustomers(response.data.data)); }, []); return <section><h1>Customers</h1><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id}><td>{customer.name}</td><td>{customer.email}</td><td>{new Date(customer.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>; }
