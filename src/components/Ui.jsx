export function Alert({message,type='error'}){return message?<div className={`alert ${type}`}>{message}</div>:null;}
export function Button({children,loading,...props}){return <button {...props} disabled={loading||props.disabled}>{loading?'Please wait…':children}</button>}
export function FormInput({label,error,...props}){return <label className="field">{label}<input {...props}/>{error&&<small>{error}</small>}</label>}
export function StatusBadge({status}){return <span className={`status ${status}`}>{status?.replace('_',' ')}</span>}
export function Pagination({meta,onChange}){if(!meta||meta.last_page<=1)return null;return <div className="pagination"><Button onClick={()=>onChange(meta.current_page-1)} disabled={meta.current_page===1}>Previous</Button><span>Page {meta.current_page} of {meta.last_page}</span><Button onClick={()=>onChange(meta.current_page+1)} disabled={meta.current_page===meta.last_page}>Next</Button></div>}
export function LoadingSpinner(){return <p className="loading">Loading…</p>}
