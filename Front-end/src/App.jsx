import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthenticatedRoute, AdminRoute } from './components/routes/ProtectedRoutes';
// (Kode App.jsx yang sama persis dari panduan tailwind)
// ... (salin kode App.jsx) ...
import MainLayout from './components/layout/MainLayout';
import HalamanProfilDesa from './pages/HalamanProfilDesa';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardMasyarakat from './pages/DashboardMasyarakat';
import FormPengaduan from './pages/FormPengaduan';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HalamanProfilDesa />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route element={<AuthenticatedRoute />}>
              <Route path="dashboard" element={<DashboardMasyarakat />} />
              <Route path="buat-pengaduan" element={<FormPengaduan />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<h1 className="text-4xl font-bold">404</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}