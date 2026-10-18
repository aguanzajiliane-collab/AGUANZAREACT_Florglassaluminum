import { useFormFeedback } from '../hooks/useFormFeedback';
import { validateForm } from '../utils/formValidation';
import { productImage, productPrice } from '../utils/productImage';
import { useDraft } from '../hooks/useDraft';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert, Button, FormInput, LoadingSpinner, Pagination, StatusBadge } from '../components/Ui';

const errorMessage = (error) => error.response?.data?.message || 'The request could not be completed.';

function DashboardIcon({ type = 'box' }) {
  const paths = { box: 'M3 7l9-4 9 4v10l-9 4-9-4V7zm0 0l9 4 9-4M12 11v10', file: 'M14 2H6v20h12V6l-4-4zm0 0v5h5M9 12h6m-6 4h6', clock: 'M12 8v4l3 2', people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3a4 4 0 0 1 0 8' };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type==='clock'&&<circle cx="12" cy="12" r="9"/>}{type==='people'&&<circle cx="9" cy="7" r="4"/>}<path d={paths[type]||paths.box}/></svg>;
}
export function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState();
  const [recentRequests, setRecentRequests] = useState([]);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const mockMode = import.meta.env.VITE_MOCK_API === 'true';
  const load = useCallback(() => {
    if (mockMode) { setError('Live business data is unavailable while the existing mock API is enabled. Configure VITE_API_URL and disable VITE_MOCK_API to view your Laravel records.'); setLoading(false); return; }
    setLoading(true); setError('');
    Promise.all([api.get('/dashboard'), api.get('/quotation-requests', { params: { per_page: 5 } })])
      .then(([dashboard, requests]) => { setData(dashboard.data.data); setRecentRequests(requests.data.data); setTotal(requests.data.meta?.total ?? null); })
      .catch(e => setError(errorMessage(e))).finally(() => setLoading(false));
  }, [mockMode]);
  useEffect(() => { load(); }, [load]);
  const metrics = [['Total quotation requests', total, 'file', 'All submitted requests'],['Pending requests', data?.pending_requests, 'clock', 'Awaiting your review'],['Clients', data?.total_customers, 'people', 'Registered customers'],['Projects', data ? Number(data.accepted_requests)+Number(data.completed_requests) : null, 'box', 'Accepted + completed requests']];
  const stages = [['Pending',data?.pending_requests],['Quoted',data?.quoted_requests],['Accepted',data?.accepted_requests],['Completed',data?.completed_requests]];
  const stageTotal = stages.reduce((sum,[,value])=>sum+Number(value||0),0);
  return <section className="fg-admin"><div className="fg-admin-top"><span>Workspace <span>/ Overview</span></span><div><span className="fg-admin-avatar">{user?.name?.charAt(0)||'A'}</span><span>{user?.name || 'Administrator'}<small>Administrator</small></span></div></div>
    <div className="fg-admin-heading"><div><p className="fg-admin-label">BUSINESS OVERVIEW</p><h1>Dashboard</h1><p>Welcome back{user?.name ? ', '+user.name.split(' ')[0] : ''}. Here’s how your business is doing.</p></div><Link className="fg-button" to="/admin/requests">Review requests &rarr;</Link></div>
    <Alert message={error}/>{error&&!mockMode&&<button onClick={load}>Retry loading</button>}
    <div className="fg-metrics">{metrics.map(([label,value,icon,caption])=><article key={label}><div><span>{label}</span><DashboardIcon type={icon}/></div><strong>{loading ? '…' : value == null ? '—' : Number(value).toLocaleString()}</strong><small>{caption}</small></article>)}</div>
    {loading&&<LoadingSpinner/>}
    <div className="fg-admin-columns"><article className="fg-admin-panel"><div className="fg-panel-title"><div><h2>Recent quotation requests</h2><p>The latest requests from your clients</p></div><Link to="/admin/requests">View all &rarr;</Link></div><div className="fg-admin-table"><table><thead><tr><th>Project / Client</th><th>Submitted</th><th>Budget</th><th>Status</th><th>Action</th></tr></thead><tbody>{recentRequests.map(request=><tr key={request.id}><td><b>{request.project_title}</b><small>{request.customer?.name || 'Customer'}</small></td><td>{new Date(request.created_at).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}</td><td>PHP {Number(request.estimated_budget||0).toLocaleString()}</td><td><StatusBadge status={request.status}/></td><td><Link to={'/admin/requests/'+request.id}>View &rarr;</Link></td></tr>)}</tbody></table>{!loading&&!recentRequests.length&&<p className="fg-admin-empty">{error ? 'Requests could not be loaded.' : 'No quotation requests yet. New requests will appear here.'}</p>}</div></article>
    <aside className="fg-admin-panel"><div className="fg-panel-title"><div><h2>Request pipeline</h2><p>Current status distribution</p></div></div><div className="fg-pipeline">{stages.map(([label,value])=><div key={label}><div><span>{label}</span><b>{value==null ? '—' : Number(value).toLocaleString()}</b></div><div className="fg-track"><span style={{width:stageTotal ? Number(value||0)/stageTotal*100+'%' : '0%'}}/></div></div>)}<small>Distribution excludes rejected requests.</small></div><div className="fg-admin-sales"><span>Completed project sales</span><strong>{data ? 'PHP '+Number(data.sales_total||0).toLocaleString() : '—'}</strong></div></aside></div>
    <div className="fg-admin-quick"><span>QUICK ACTIONS</span><Link to="/admin/products/create">Add product / service &rarr;</Link><Link to="/admin/categories">Manage categories &rarr;</Link><Link to="/admin/customers">View clients &rarr;</Link><Link to="/admin/products">Products & services {data ? '('+data.total_products+')' : ''} &rarr;</Link></div>
  </section>;
}

export function AdminRequests() {
  const [loading,setLoading]=useState(true),feedback=useFormFeedback(); const [items, setItems] = useState([]); const [meta, setMeta] = useState(); const [filters, setFilters] = useDraft('admin-request-filters', { search: '', status: '' });
  const load = async (page = 1) => { setLoading(true);try{const response = await api.get('/quotation-requests', { params: { ...filters, page } }); setItems(response.data.data); setMeta(response.data.meta);}catch(e){feedback.fail(e);}finally{setLoading(false);} };
  useEffect(() => { load(); }, []);
  return <section><h1>Quotation requests</h1><Alert message={feedback.error}/>{loading&&<LoadingSpinner/>}<div className="filters"><input placeholder="Search project or customer" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /><select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option>{['pending', 'quoted', 'accepted', 'completed', 'rejected'].map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select><Button loading={loading} onClick={() => load()}>Filter</Button></div><div className="table-wrap"><table><thead><tr><th>ID</th><th>Customer</th><th>Project</th><th>Budget</th><th>Status</th><th /></tr></thead><tbody>{items.map((request) => <tr key={request.id}><td>#{request.id}</td><td>{request.customer.name}</td><td>{request.project_title}</td><td>PHP {request.estimated_budget}</td><td><StatusBadge status={request.status} /></td><td><Link to={`/admin/requests/${request.id}`}>Manage</Link></td></tr>)}</tbody></table></div><Pagination meta={meta} onChange={load} /></section>;
}

export function AdminRequestDetail(){
 const {id}=useParams(),feedback=useFormFeedback(),[request,setRequest]=useState(),[loading,setLoading]=useState(true);
 const [amount,setAmount,clearAmount]=useDraft('quotation-amount-'+id,null);
 const load=async()=>{setLoading(true);try{setRequest((await api.get('/quotation-requests/'+id)).data.data);}catch(e){feedback.fail(e);}finally{setLoading(false);}};
 useEffect(()=>{load();},[id]);
 const updateStatus=async status=>{const value=amount??request.quotation_amount??'';const errors=validateForm('status',{status,quotation_amount:value});const ok=await feedback.run(async()=>{const response=await api.patch('/quotation-requests/'+id+'/status',{status,...(status==='quoted'?{quotation_amount:Number(value)}:{})});setRequest(response.data.data);clearAmount();},errors,'Request marked '+status+' successfully.');return ok;};
 if(loading)return <LoadingSpinner/>;
 if(!request)return <section><Alert message={feedback.error}/><Button onClick={load}>Retry</Button></section>;
 const next={pending:['quoted','rejected'],accepted:['completed']}[request.status]||[];
 return <section><h1>{request.project_title}</h1><p><b>{request.customer.name}</b> - {request.customer.email}</p><StatusBadge status={request.status}/><Alert message={feedback.error}/><Alert type="success" message={feedback.message}/><p>{request.project_description}</p><h2>Requested services</h2>{request.items.map(item=><article className="card" key={item.id}><b>{item.product.name}</b> x {item.quantity}<p>{item.specifications}</p></article>)}{request.quotation_amount!=null&&<p><b>Quotation amount:</b> PHP {Number(request.quotation_amount).toLocaleString()}</p>}{request.status==='pending'&&<FormInput label="Quotation amount (PHP)" type="number" min="0" step="0.01" disabled={feedback.pending} value={amount??request.quotation_amount??''} error={feedback.fields.quotation_amount} onChange={e=>setAmount(e.target.value)}/>} {feedback.fields.status&&<Alert message={feedback.fields.status}/>} {next.length>0&&<><h2>Update request status</h2>{next.map(status=><Button key={status} loading={feedback.pending} onClick={()=>updateStatus(status)}>Mark {status}</Button>)}</>}</section>;
}

export function AdminCategories() {
 const [categories,setCategories]=useState([]),[loading,setLoading]=useState(true);
 const [form,setForm,clearForm]=useDraft('category-form',{name:'',description:''}),[editing,setEditing,clearEditing]=useDraft('category-editing',null),feedback=useFormFeedback();
 const load=async()=>{setLoading(true);try{setCategories((await api.get('/categories')).data.data);}catch(e){feedback.fail(e);}finally{setLoading(false);}};
 useEffect(()=>{load();},[]);
 const submit=async event=>{event.preventDefault();const ok=await feedback.run(async()=>{if(editing)await api.put('/categories/'+editing,form);else await api.post('/categories',form);clearForm();clearEditing();},validateForm('category',form),editing?'Category updated successfully.':'Category created successfully.');if(ok)await load();};
 const remove=async category=>{if(feedback.pending||!window.confirm('Delete '+category.name+'?'))return;if(await feedback.run(()=>api.delete('/categories/'+category.id),{},'Category deleted successfully.'))await load();};
 return <section><h1>Categories</h1><Alert message={feedback.error}/><Alert type="success" message={feedback.message}/><form className="form-card" noValidate onSubmit={submit} aria-busy={feedback.pending}><fieldset className="form-fields" disabled={feedback.pending}><FormInput label="Category name" required value={form.name} error={feedback.fields.name} onChange={e=>setForm({...form,name:e.target.value})}/><FormInput as="textarea" label="Description" value={form.description} error={feedback.fields.description} onChange={e=>setForm({...form,description:e.target.value})}/><Button loading={feedback.pending}>{editing?'Save changes':'Add category'}</Button> {editing&&<Button type="button" onClick={()=>{clearEditing();clearForm();}}>Cancel</Button>}</fieldset></form>{loading?<LoadingSpinner/>:<div className="table-wrap"><table><thead><tr><th>Name</th><th>Description</th><th>Products</th><th/></tr></thead><tbody>{categories.map(category=><tr key={category.id}><td>{category.name}</td><td>{category.description}</td><td>{category.products_count}</td><td><Button disabled={feedback.pending} onClick={()=>{setEditing(category.id);setForm({name:category.name,description:category.description||''});}}>Edit</Button> <Button disabled={feedback.pending} onClick={()=>remove(category)}>Delete</Button></td></tr>)}</tbody></table>{!categories.length&&<p>No categories yet.</p>}</div>}</section>;
}
export function AdminProducts(){
 const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),feedback=useFormFeedback();
 const load=async()=>{setLoading(true);try{setProducts((await api.get('/products',{params:{per_page:100}})).data.data);}catch(e){feedback.fail(e);}finally{setLoading(false);}};
 useEffect(()=>{load();},[]);
 const remove=async product=>{if(feedback.pending||!window.confirm('Delete '+product.name+'?'))return;if(await feedback.run(()=>api.delete('/products/'+product.id),{},'Product deleted successfully.'))await load();};
 return <section><h1>Products / services</h1><Link className="button" to="/admin/products/create">Add product</Link><Alert message={feedback.error}/><Alert type="success" message={feedback.message}/>{feedback.pending&&<LoadingSpinner/>}{loading?<LoadingSpinner/>:<div className="table-wrap"><table><thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Status</th><th/></tr></thead><tbody>{products.map(product=><tr key={product.id}><td><div className="admin-product-cell"><img className="admin-product-thumbnail" src={productImage(product)} alt={product.name} loading="lazy"/><span>{product.name}</span></div></td><td>{product.category?.name}</td><td>{productPrice(product)}</td><td>{product.is_active?'Active':'Inactive'}</td><td><Link to={'/admin/products/'+product.id+'/edit'}>Edit</Link> <Button disabled={feedback.pending} onClick={()=>remove(product)}>Delete</Button></td></tr>)}</tbody></table>{!products.length&&<p>No products yet.</p>}</div>}</section>;
}
export function ProductEditor(){
 const {id}=useParams(),navigate=useNavigate(),feedback=useFormFeedback();
 const [categories,setCategories]=useState([]),[loading,setLoading]=useState(true),[ready,setReady]=useState(false);
 const [form,setForm,clearDraft,hydrateForm]=useDraft('product-'+(id||'new'),{category_id:'',name:'',description:'',type:'',estimated_price:'',image:'',is_active:true});
 useEffect(()=>{let active=true;setLoading(true);setReady(false);Promise.all([api.get('/categories'),id?api.get('/products/'+id):Promise.resolve(null)]).then(([categoryResponse,productResponse])=>{if(!active)return;setCategories(categoryResponse.data.data);if(productResponse){const product=productResponse.data.data;hydrateForm({...product,category_id:String(product.category_id),estimated_price:product.estimated_price==null?'':String(product.estimated_price)});}setReady(true);}).catch(e=>{if(active)feedback.fail(e);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[id,hydrateForm]);
 const submit=async event=>{event.preventDefault();if(!ready)return;const ok=await feedback.run(async()=>{const payload={...form,category_id:Number(form.category_id),estimated_price:form.estimated_price===''||form.estimated_price==null?null:Number(form.estimated_price),is_active:Boolean(form.is_active)};if(id)await api.put('/products/'+id,payload);else await api.post('/products',payload);clearDraft();},validateForm('product',form));if(ok)navigate('/admin/products',{state:{success:id?'Product updated successfully.':'Product created successfully.'}});};
 return <section><h1>{id?'Edit product / service':'Add product / service'}</h1><Alert message={feedback.error}/>{loading?<LoadingSpinner/>:<form noValidate onSubmit={submit} className="form-card" aria-busy={feedback.pending}><fieldset className="form-fields" disabled={feedback.pending||!ready}><FormInput as="select" label="Category" required value={form.category_id} error={feedback.fields.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}><option value="">Select category</option>{categories.map(category=><option key={category.id} value={category.id}>{category.name}</option>)}</FormInput>{[['name','Service name','text'],['type','Type','text'],['estimated_price','Estimated starting price (leave blank for Request a Quote)','number'],['image','Product image URL or path (optional)','text']].map(([key,label,type])=><FormInput key={key} label={label} type={type} required={key==='name'||key==='type'} value={form[key]} error={feedback.fields[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>)}<FormInput as="textarea" label="Description" required value={form.description} error={feedback.fields.description} onChange={e=>setForm({...form,description:e.target.value})}/><FormInput label="Available for quotation" type="checkbox" checked={form.is_active} error={feedback.fields.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/><Button loading={feedback.pending}>Save product</Button></fieldset></form>}</section>;
}

export function AdminCustomers() { const [customers, setCustomers] = useState([]),[loading,setLoading]=useState(true),feedback=useFormFeedback(); useEffect(() => { api.get('/customers').then((response) => setCustomers(response.data.data)).catch(feedback.fail).finally(()=>setLoading(false)); }, []); return <section><h1>Customers</h1><Alert message={feedback.error}/>{loading&&<LoadingSpinner/>}<div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id}><td>{customer.name}</td><td>{customer.email}</td><td>{new Date(customer.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>; }
