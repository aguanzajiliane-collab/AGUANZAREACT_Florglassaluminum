import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { CustomerDashboard, ProductsPage, ProductDetail, RequestsPage, RequestDetail, CreateRequest, Profile } from './pages/CustomerPages';
import { AdminDashboard, AdminRequests, AdminRequestDetail, AdminCategories, AdminProducts, ProductEditor, AdminCustomers } from './pages/AdminPages';
import ProtectedRoute from './routes/ProtectedRoute';
import GlassProducts from './pages/Glass-products.jsx';

function Dashboard() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <CustomerDashboard />;
}

export default function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}><Route element={<AppLayout />}>
      <Route path="/dashboard" element={<Dashboard />} /><Route path="/products" element={<ProductsPage />} /><Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/requests" element={<RequestsPage />} /><Route path="/requests/create" element={<CreateRequest />} /><Route path="/requests/:id" element={<RequestDetail />} /><Route path="/profile" element={<Profile />} />
    </Route></Route>
    <Route element={<ProtectedRoute admin />}><Route element={<AppLayout />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} /><Route path="/admin/products" element={<AdminProducts />} /><Route path="/admin/products/create" element={<ProductEditor />} /><Route path="/admin/products/:id/edit" element={<ProductEditor />} />
      <Route path="/admin/categories" element={<AdminCategories />} /><Route path="/admin/requests" element={<AdminRequests />} /><Route path="/admin/requests/:id" element={<AdminRequestDetail />} /><Route path="/admin/customers" element={<AdminCustomers />} />
    </Route></Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
    <Route path="/glass-products" element={<GlassProducts />} />
  </Routes></BrowserRouter></AuthProvider>;
}
