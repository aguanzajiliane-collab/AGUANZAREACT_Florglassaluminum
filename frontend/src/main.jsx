import './form-feedback.css';
import {StrictMode}from'react';import{createRoot}from'react-dom/client';import'./index.css';import'./light-orange.css';import'./product-images.css';import'./brand-logo.css';import'./theme-switch.css';import'./customer-profile.css';import'./my-requests.css';import'./auth-password.css';import App from'./App';

import './workflow-status.css';

document.documentElement.dataset.theme=localStorage.getItem('florglass_theme')==='dark'?'dark':'light';
createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>);
