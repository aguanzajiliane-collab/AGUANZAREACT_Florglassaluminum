import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Button, FormInput } from '../components/Ui';
import { useFormFeedback } from '../hooks/useFormFeedback';
import { validateForm } from '../utils/formValidation';
export function LoginPage(){
 const {login}=useAuth(),go=useNavigate(),feedback=useFormFeedback();
 const [form,setForm]=useState({email:'',password:''}),[showPassword,setShowPassword]=useState(false);
 const submit=async event=>{event.preventDefault();if(await feedback.run(()=>login(form),validateForm('login',form)))go('/dashboard',{state:{success:'Signed in successfully.'}});};
 return <AuthForm title="Welcome back"><form noValidate onSubmit={submit} aria-busy={feedback.pending}><Alert message={feedback.error}/><fieldset className="form-fields" disabled={feedback.pending}><FormInput label="Email" type="email" autoComplete="username" required value={form.email} error={feedback.fields.email} onChange={e=>setForm({...form,email:e.target.value})}/><div className="password-field"><FormInput label="Password" type={showPassword?'text':'password'} autoComplete="current-password" required value={form.password} error={feedback.fields.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="password-toggle" type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?'Hide password':'Show password'} aria-pressed={showPassword}>{showPassword?<EyeOffIcon/>:<EyeIcon/>}</button></div><Button loading={feedback.pending}>Login</Button></fieldset><p>New customer? <Link to="/register">Create an account</Link></p></form></AuthForm>;
}
export function RegisterPage(){
 const {register}=useAuth(),go=useNavigate(),feedback=useFormFeedback();const [form,setForm]=useState({name:'',email:'',password:'',password_confirmation:''});
 const submit=async event=>{event.preventDefault();if(await feedback.run(()=>register(form),validateForm('register',form)))go('/dashboard',{state:{success:'Account created successfully. Welcome!'}});};
 return <AuthForm title="Request a quotation"><form noValidate onSubmit={submit} aria-busy={feedback.pending}><Alert message={feedback.error}/><fieldset className="form-fields" disabled={feedback.pending}>{[['name','Full name','text'],['email','Email','email'],['password','Password','password'],['password_confirmation','Confirm password','password']].map(([key,label,type])=><FormInput key={key} label={label} type={type} autoComplete={type==='password'?'new-password':key} required value={form[key]} error={feedback.fields[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>)}<Button loading={feedback.pending}>Create account</Button></fieldset><p>Already registered? <Link to="/login">Login</Link></p></form></AuthForm>;
}
function AuthForm({title,children}){return <main className="auth"><section><div className="auth-brand"><img src="/florglass_logo.jpg" alt="Flor Glass Aluminum Works"/><div><p className="eyebrow">FLOR GLASS & ALUMINUM WORKS</p><p>Villanueva, Tubigon, Bohol</p></div></div><h1>{title}</h1><p>Customized fabrication and installation services in Tubigon, Bohol.</p>{children}</section></main>}
function EyeIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.25 12s3.5-6 9.75-6 9.75 6 9.75 6-3.5 6-9.75 6S2.25 12 2.25 12Z"/><circle cx="12" cy="12" r="2.75"/></svg>}
function EyeOffIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 6.12A10.84 10.84 0 0 1 12 6c6.25 0 9.75 6 9.75 6a15.7 15.7 0 0 1-2.13 2.75M6.7 6.7C3.78 8.5 2.25 12 2.25 12s3.5 6 9.75 6c1.3 0 2.47-.26 3.52-.68M9.88 9.88A3 3 0 0 0 14.12 14.12"/></svg>}
