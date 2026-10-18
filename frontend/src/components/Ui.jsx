import { useId } from 'react';
export function Alert({message,type='error'}){return message?<div className={`alert ${type}`} role={type==='success'?'status':'alert'} aria-live={type==='success'?'polite':'assertive'}>{message}</div>:null;}
export function Button({children,loading,...props}){return <button {...props} aria-busy={loading || undefined} disabled={loading||props.disabled}>{loading?'Please wait...':children}</button>}
export function FormInput({label,error,as:Tag='input',children,id:providedId,...props}){
  const generatedId=useId(),id=providedId||generatedId;
  return <div className="field"><label htmlFor={id}>{label}</label><Tag {...props} id={id} aria-invalid={error?true:undefined} aria-describedby={error?id+'-error':undefined}>{children}</Tag>{error&&<small className="field-error" id={id+'-error'}>{error}</small>}</div>;
}
export function StatusBadge({status}){return <span className={`status ${status}`}>{status?.replace('_',' ')}</span>}
export function Pagination({meta,onChange}){if(!meta||meta.last_page<=1)return null;return <div className="pagination"><Button onClick={()=>onChange(meta.current_page-1)} disabled={meta.current_page===1}>Previous</Button><span>Page {meta.current_page} of {meta.last_page}</span><Button onClick={()=>onChange(meta.current_page+1)} disabled={meta.current_page===meta.last_page}>Next</Button></div>}
export function LoadingSpinner(){return <p className="loading" role="status" aria-live="polite">Loading…</p>}
