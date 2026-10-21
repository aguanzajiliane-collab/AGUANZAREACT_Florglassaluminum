import { validateForm } from '../utils/formValidation';
import { useFormFeedback } from '../hooks/useFormFeedback';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { productImage, productImageFit, productPrice } from '../utils/productImage';
import {
    Alert,
    Button,
    FormInput,
    LoadingSpinner,
    Pagination,
    StatusBadge
} from '../components/Ui';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [currentYear] = useState(() => new Date().getFullYear());
  useEffect(() => { api.get('/products', { params: { per_page: 100 } }).then(r => setFeatured(r.data.data)).catch(() => setFeatured([])); }, []);
  const services = ['Windows', 'Doors', 'Glass Panels', 'Mirrors', 'Metal Works'].map(category => featured.find(product => product.category?.name === category)).filter(Boolean);
  const projects = ['Windows', 'Metal Works'].map(category => featured.find(product => product.category?.name === category)).filter(Boolean);
  return <section className="fg-home">
    <div className="fg-hero" style={{backgroundImage: 'linear-gradient(90deg, #0b1117f5 0%, #0b1117b8 38%, #0b111710 85%), url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85)'}}><div className="fg-hero-copy"><p className="fg-kicker">GLASS AND ALUMINUM SOLUTIONS <span/></p><h1>Modern Spaces,<br/><em>Built to Last</em></h1><p>Flor Glass & Aluminum Works provides customized glass and aluminum solutions for homes and businesses in Tubigon, Bohol.</p><div className="fg-actions"><a className="fg-button" href="#home-services">Our Services &rarr;</a><a className="fg-button fg-outline" href="#home-projects">View Projects</a></div><div className="fg-trust"><span><HomeTrustIcon type="shield"/>Durable<br/><b>Materials</b></span><span><HomeTrustIcon type="diamond"/>Custom<br/><b>Designs</b></span><span><HomeTrustIcon type="tools"/>Professional<br/><b>Installation</b></span></div></div></div>
    <div className="fg-container" id="home-services"><div className="fg-section-heading"><div><p className="fg-kicker">OUR SERVICES</p><h2>Quality Fabrication<br/>for <em>Every Space</em></h2></div><p>Glass and aluminum products<br/>customized to fit your style and needs.</p><Link to="/products">View All Services &rarr;</Link></div><div className="fg-service-grid">{services.map(product=><Link to={'/products/'+product.id} className="fg-service" key={product.id}><img src={productImage(product)} style={{objectFit:productImageFit(product)}} alt={product.name} loading="lazy"/><div><h3>{product.name}</h3><p>{product.description}</p><span aria-hidden="true">&rarr;</span></div></Link>)}</div></div>
    <div className="fg-value-strip"><span>Custom fabrication<small>Made for your space</small></span><span>Glass & aluminum<small>Considered materials. Clean finishes.</small></span><span>Tubigon, Bohol<small>Your local business</small></span></div>
    <div className="fg-container" id="home-projects"><div className="fg-section-heading"><div><p className="fg-kicker">PROJECT INSPIRATION</p><h2>A clearer view of <em>what’s possible.</em></h2></div><p>Architectural inspiration for your next project.<br/>Tell us how you would make it your own.</p></div><div className="fg-project-grid">{projects.map(product=><Link to={'/products/'+product.id} className="fg-project" key={product.id}><img src={productImage(product)} style={{objectFit:productImageFit(product)}} alt={product.name} loading="lazy"/><div><small>{product.category?.name}</small><h3>{product.name} &rarr;</h3></div></Link>)}</div></div>
    {featured.length>0&&<div className="fg-container"><div className="fg-section-heading"><div><p className="fg-kicker">FROM OUR CATALOG</p><h2>Explore our services</h2></div><Link to="/products">Browse all &rarr;</Link></div><div className="fg-catalog-links">{featured.map(product=><Link key={product.id} to={'/products/'+product.id}>{product.name}<span aria-hidden="true">&rarr;</span></Link>)}</div></div>}
    <div className="fg-container fg-cta"><div><p className="fg-kicker">LET’S BUILD SOMETHING LASTING</p><h2>Your space. Our craftsmanship.</h2><p>Welcome{user?.name ? ', '+user.name.split(' ')[0] : ''}. Let’s bring your next project to life.</p></div><Link className="fg-button" to="/requests/create">Get a Quote &rarr;</Link></div>
    <footer className="fg-footer fg-container"><div><b>FLOR <span>GLASS & ALUMINUM WORKS</span></b><p>Modern solutions. Built around you.</p></div><div><Link to="/products">Services</Link><Link to="/requests">My Requests</Link><Link to="/profile">My Profile</Link></div><small>Tubigon, Bohol · © {currentYear} Flor Glass & Aluminum Works</small></footer>
  </section>;
}
function HomeTrustIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === 'shield' ? <><path d="M12 3l9 4v6c0 4-5 7-9 9-4-2-9-5-9-9V7l9-4Z"/><path d="m8 12 3 3 5-6"/></> : type === 'diamond' ? <><path d="m3 8 4-5h10l4 5-9 13L3 8Zm0 0h18M7 3l5 18 5-18"/></> : <><path d="m14 6 4 4M3 21l8-8m4-10a6 6 0 0 0-7 8L3 16l5 5 5-5a6 6 0 0 0 8-7l-4 4-6-6 4-4Z"/></>}</svg>;
}
export function ProductsPage(){const[error,setError]=useState(''),[data,setData]=useState([]),[categories,setCategories]=useState([]),[meta,setMeta]=useState(),[filters,setFilters]=useState({search:'',category_id:''}),[loading,setLoading]=useState(true);const load=async(page=1)=>{setLoading(true);setError('');try{const r=await api.get('/products',{params:{...filters,page}});setData(r.data.data);setMeta(r.data.meta);}catch(e){setError(e.response?.data?.message||'Services could not be loaded. Please try again.');}finally{setLoading(false);}};useEffect(()=>{api.get('/categories').then(r=>setCategories(r.data.data)).catch(()=>setError('Categories could not be loaded.'));load()},[]);return <section><h1>Products & services</h1><Alert message={error}/><div className="filters"><input placeholder="Search services" value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})}/><select value={filters.category_id} onChange={e=>setFilters({...filters,category_id:e.target.value})}><option value="">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><Button onClick={()=>load()}>Search</Button></div>{loading?<LoadingSpinner/>:<><div className="grid">{data.map(p=><article className="card product-card" key={p.id}><img src={productImage(p)} alt={p.name} loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/><p className="eyebrow">{p.category?.name}</p><h2>{p.name}</h2><p>{p.description}</p><strong>{productPrice(p)}</strong><Link to={`/products/${p.id}`}>View service</Link></article>)}</div><Pagination meta={meta} onChange={load}/></>}</section>}
export function ProductDetail(){const{id}=useParams(),[item,setItem]=useState();useEffect(()=>{api.get(`/products/${id}`).then(r=>setItem(r.data.data))},[id]);if(!item)return <LoadingSpinner/>;return <section className="card product-detail"><img src={productImage(item)} alt={item.name} onError={e=>{e.currentTarget.style.display='none'}}/><div><p className="eyebrow">{item.category?.name}</p><h1>{item.name}</h1><p>{item.description}</p><h2>{productPrice(item)}</h2><Link className="button request-service-button" to={'/requests/create?product_id=' + encodeURIComponent(item.id)}>Request this service</Link></div></section>}
export function RequestsPage(){const[data,setData]=useState([]),[meta,setMeta]=useState(),[error,setError]=useState('');const load=async(page=1)=>{try{const r=await api.get('/quotation-requests',{params:{page}});setData(r.data.data);setMeta(r.data.meta)}catch(e){setError(e.message)}};useEffect(()=>{load()},[]);const pending=data.filter(q=>q.status==='pending').length;const active=data.filter(q=>['quoted','accepted'].includes(q.status)).length;const completed=data.filter(q=>q.status==='completed').length;return <section className="my-requests"><div className="requests-hero"><div><p className="eyebrow">CUSTOMER PROJECTS</p><h1>My quotation requests</h1><p>Keep track of your projects from the initial request through completion.</p></div><Link className="button" to="/requests/create">New request</Link></div><div className="request-summary"><article><span>All requests</span><strong>{meta?.total??data.length}</strong></article><article><span>Pending review</span><strong>{pending}</strong></article><article><span>Active projects</span><strong>{active}</strong></article><article><span>Completed</span><strong>{completed}</strong></article></div><Alert message={error}/><div className="requests-list-card"><div className="panel-heading"><div><p className="eyebrow">PROJECT ACTIVITY</p><h2>Your requests</h2></div><span>{meta?.total??0} total</span></div>{data.length?<div className="table-wrap"><table><thead><tr><th>Project</th><th>Submitted</th><th>Budget</th><th>Status</th><th/></tr></thead><tbody>{data.map(q=><tr key={q.id}><td><b>{q.project_title}</b><small>{q.project_location}</small></td><td>{new Date(q.created_at).toLocaleDateString()}</td><td>PHP {Number(q.estimated_budget).toLocaleString()}</td><td><StatusBadge status={q.status}/></td><td><Link to={`/requests/${q.id}`}>View details</Link></td></tr>)}</tbody></table></div>:<p className="empty-copy">You have not submitted a quotation request yet.</p>}<Pagination meta={meta} onChange={load}/></div></section>}
export function RequestDetail() {
  const { id } = useParams();
  const [q, setQ] = useState();
  const [loading, setLoading] = useState(true);
  const feedback = useFormFeedback();
  const load = async () => { setLoading(true); try { setQ((await api.get('/quotation-requests/' + id)).data.data); } catch (e) { feedback.fail(e); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [id]);
  const accept = () => feedback.run(async () => { setQ((await api.patch('/quotation-requests/' + id + '/accept')).data.data); }, {}, 'Quotation accepted. FlorGlassAluminum will coordinate the project with you.');
  if (loading) return <LoadingSpinner />;
  if (!q) return <section><Alert message={feedback.error} /><Button onClick={load}>Retry</Button></section>;
  return <section><h1>{q.project_title}</h1><StatusBadge status={q.status} /><Alert message={feedback.error} /><Alert type="success" message={feedback.message} /><p>{q.project_description}</p><div className="card"><b>Location:</b> {q.project_location}<br /><b>Preferred date:</b> {q.preferred_date}<br /><b>Budget:</b> PHP {Number(q.estimated_budget).toLocaleString()}{q.quotation_amount != null && <><br /><b>FlorGlass quotation:</b> PHP {Number(q.quotation_amount).toLocaleString()}</>}</div>{q.status === 'quoted' && <Button loading={feedback.pending} onClick={accept}>Accept quotation</Button>}<h2>Requested services</h2>{q.items.map(item => <article className="card" key={item.id}><b>{item.product.name}</b> x {item.quantity}<p>{item.specifications}</p></article>)}</section>;
}
export function CreateRequest() {
  const [searchParams] = useSearchParams();
  const feedback = useFormFeedback();
  const selectedProduct = /^[1-9][0-9]*$/.test(searchParams.get('product_id') || '') ? searchParams.get('product_id') : '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ project_title: '', project_description: '', project_location: '', preferred_date: '', estimated_budget: '', items: [{ product_id: selectedProduct, quantity: 1, specifications: '' }] });
  const load = async () => {
    setLoading(true); setReady(false);
    try { setProducts((await api.get('/products', { params: { per_page: 100 } })).data.data); setReady(true); }
    catch (e) { feedback.fail(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const change = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const item = (index, key, value) => setForm(previous => ({ ...previous, items: previous.items.map((entry, i) => i === index ? { ...entry, [key]: value } : entry) }));
  const submit = async event => {
    event.preventDefault();
    if (!ready) return;
    const ok = await feedback.run(() => api.post('/quotation-requests', {
      ...form, preferred_date: form.preferred_date || null,
      estimated_budget: form.estimated_budget === '' ? null : Number(form.estimated_budget),
      items: form.items.map(entry => ({ ...entry, product_id: Number(entry.product_id), quantity: Number(entry.quantity) })),
    }), validateForm('quotation', form), 'Your request was submitted and is now pending review.');
    if (ok) setForm({ project_title: '', project_description: '', project_location: '', preferred_date: '', estimated_budget: '', items: [{ product_id: selectedProduct, quantity: 1, specifications: '' }] });
  };
  return <section><h1>New quotation request</h1><Alert message={feedback.error} /><Alert type="success" message={feedback.message} />
    {loading ? <LoadingSpinner /> : !ready ? <Button onClick={load}>Retry loading services</Button> :
      <form onSubmit={submit} noValidate className="form-card" aria-busy={feedback.pending}>
        <fieldset className="form-fields" disabled={feedback.pending}>
          {[['project_title', 'Project title', 'text'], ['project_location', 'Project location', 'text'], ['preferred_date', 'Preferred date (optional)', 'date'], ['estimated_budget', 'Estimated budget (PHP, optional)', 'number']].map(([key, label, type]) => <FormInput key={key} label={label} type={type} required={key === 'project_title' || key === 'project_location'} value={form[key]} error={feedback.fields[key]} onChange={e => change(key, e.target.value)} />)}
          <FormInput as="textarea" label="Project description" required value={form.project_description} error={feedback.fields.project_description} onChange={e => change('project_description', e.target.value)} />
          <h2>Requested services</h2><Alert message={feedback.fields.items} />
          {form.items.map((entry, index) => <div className="item" key={index}>
            <FormInput as="select" label={'Service ' + (index + 1)} required value={entry.product_id} error={feedback.fields['items.' + index + '.product_id']} onChange={e => item(index, 'product_id', e.target.value)}><option value="">Select a service</option>{products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</FormInput>
            <FormInput label="Quantity" type="number" min="1" max="1000" required value={entry.quantity} error={feedback.fields['items.' + index + '.quantity']} onChange={e => item(index, 'quantity', e.target.value)} />
            <FormInput label="Specifications" value={entry.specifications} error={feedback.fields['items.' + index + '.specifications']} onChange={e => item(index, 'specifications', e.target.value)} />
          </div>)}
          <Button type="button" onClick={() => change('items', [...form.items, { product_id: '', quantity: 1, specifications: '' }])}>Add service</Button> <Button type="submit" loading={feedback.pending}>Submit request</Button>
        </fieldset>
      </form>}
  </section>;
}
export function Profile(){const{user}=useAuth(),[requests,setRequests]=useState([]),[loading,setLoading]=useState(true);useEffect(()=>{api.get('/quotation-requests',{params:{per_page:5}}).then(r=>setRequests(r.data.data)).finally(()=>setLoading(false))},[]);const initials=user?.name?.split(' ').map(part=>part[0]).slice(0,2).join('').toUpperCase()||'CU';const pending=requests.filter(request=>request.status==='pending').length;const completed=requests.filter(request=>request.status==='completed').length;return <section className="customer-profile"><div className="profile-hero"><div className="profile-avatar">{initials}</div><div><p className="eyebrow">CUSTOMER ACCOUNT</p><h1>{user?.name}</h1><p>{user?.email}</p></div><Link className="button" to="/requests/create">New quotation request</Link></div><div className="profile-stats"><article><span>My recent requests</span><strong>{requests.length}</strong><small>shown in your activity list</small></article><article><span>Awaiting review</span><strong>{pending}</strong><small>requests currently pending</small></article><article><span>Completed</span><strong>{completed}</strong><small>projects in this list</small></article></div><div className="profile-columns"><article className="profile-details"><p className="eyebrow">ACCOUNT DETAILS</p><h2>Your information</h2><dl><div><dt>Full name</dt><dd>{user?.name}</dd></div><div><dt>Email address</dt><dd>{user?.email}</dd></div><div><dt>Account type</dt><dd>Customer</dd></div></dl></article><article className="profile-activity"><div className="panel-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Quotation progress</h2></div><Link to="/requests">View all</Link></div>{loading?<LoadingSpinner/>:requests.length?<div className="profile-request-list">{requests.map(request=><Link to={`/requests/${request.id}`} key={request.id}><span><b>{request.project_title}</b><small>{new Date(request.created_at).toLocaleDateString()}</small></span><StatusBadge status={request.status}/></Link>)}</div>:<p className="empty-copy">You have not submitted a quotation request yet.</p>}</article></div></section>}
