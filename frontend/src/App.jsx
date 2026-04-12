import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <Router>
      <Routes>
        {/* HALAMAN TANPA SIDEBAR */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* HALAMAN DENGAN SIDEBAR */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<AlertPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/device" element={<DevicePage />} />
          <Route path="/system" element={<SystemPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;