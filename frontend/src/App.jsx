import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './Layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AlertPage from './pages/Alert';
import HistoryPage from './pages/History';
import DevicePage from './pages/Device';
import SystemPage from './pages/System';
import LandingPage from './pages/LandingPage';
import HelpPage from './pages/Help';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Daftar';
import ProfilePage from './pages/Profile';

// Ambil data user dari localStorage
const getUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Harus login untuk akses
const ProtectedRoute = ({ children, roleRequired }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

// Tidak bisa diakses kalau sudah login
const GuestRoute = ({ children }) => {
  const user = getUser();
  if (user) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* HALAMAN PUBLIK */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* GUEST ONLY */}
        <Route path="/login" element={
          <GuestRoute><LoginPage /></GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute><RegisterPage /></GuestRoute>
        } />

        {/* PROTECTED - wajib login */}
        <Route element={<MainLayout />}>
          {/* Semua role */}
          <Route path="/home" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/alerts" element={
            <ProtectedRoute><AlertPage /></ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute><HistoryPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/device" element={
            <ProtectedRoute roleRequired="admin"><DevicePage /></ProtectedRoute>
          } />
          <Route path="/system" element={
            <ProtectedRoute roleRequired="admin"><SystemPage /></ProtectedRoute>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;