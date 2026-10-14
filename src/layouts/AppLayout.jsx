import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('florglass_theme') || 'light');
  const initialTheme = useRef(true);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    localStorage.setItem('florglass_theme', theme);
    if (initialTheme.current) { initialTheme.current = false; return undefined; }
    root.classList.remove('theme-transitioning');
    requestAnimationFrame(() => root.classList.add('theme-transitioning'));
    const timer = window.setTimeout(() => root.classList.remove('theme-transitioning'), 520);
    return () => window.clearTimeout(timer);
  }, [theme]);
  const exit = async () => { await logout(); navigate('/login'); };
  const dashboardPath = isAdmin ? '/admin/dashboard' : '/dashboard';

  return <><header><Link className="brand" to={dashboardPath}><img className="brand-logo" src="/florglass_logo.jpg" alt="Flor Glass Aluminum Works" /><span>FlorGlass</span><span>Aluminum</span></Link><nav><NavLink to={dashboardPath}>Dashboard</NavLink>{isAdmin ? <><NavLink to="/admin/products">Products</NavLink><NavLink to="/admin/categories">Categories</NavLink><NavLink to="/admin/requests">Requests</NavLink><NavLink to="/admin/customers">Customers</NavLink></> : <><NavLink to="/products">Services</NavLink><NavLink to="/requests">My Requests</NavLink><NavLink to="/profile">Profile</NavLink></>}<button className={`theme-switch ${theme === 'dark' ? 'is-dark' : ''}`} type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} role="switch" aria-checked={theme === 'dark'} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><span className="theme-switch-icon" aria-hidden="true">{theme === 'light' ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg> : <svg viewBox="0 0 24 24"><path d="M20.8 15.6A9 9 0 0 1 8.4 3.2 9 9 0 1 0 20.8 15.6Z"/></svg>}</span></button><button type="button" onClick={exit}>Logout</button></nav></header><main><Outlet /></main></>;
}
