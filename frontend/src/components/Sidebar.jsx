import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home as HomeIcon, Bell, History, Settings, Cpu, LogOut, User, ChevronUp, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false); // State untuk mobile menu
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null); // Ref untuk menutup sidebar mobile saat klik di luar

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      // Close mobile sidebar if clicked outside
      if (isOpenMobile && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpenMobile(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenMobile]);

  // Otomatis tutup menu mobile setiap kali rute berubah
  useEffect(() => {
    setIsOpenMobile(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsProfileOpen(false);
    navigate('/login');
  };

  const adminMenuItems = [
    { name: 'Beranda', path: '/home', icon: <HomeIcon size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Notifikasi', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'Riwayat', path: '/history', icon: <History size={20} /> },
    { name: 'Perangkat', path: '/device', icon: <Cpu size={20} /> },
    { name: 'Sistem', path: '/system', icon: <Settings size={20} /> },
  ];

  const userMenuItems = [
    { name: 'Beranda', path: '/home', icon: <HomeIcon size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Notifikasi', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'Riwayat', path: '/history', icon: <History size={20} /> },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* 1. TOMBOL HAMBURGER (Hanya muncul di Layar Mobile: < md) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-40">
        <button 
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          {isOpenMobile ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo dipindah setelah tombol dan ukurannya bisa kamu kecilkan di sini (contoh: h-6 atau h-7) */}
        <Link to="/home" className="flex items-center gap-3">
          <Logo className="h-6 w-auto max-w-[140px]" /> 
        </Link>
        
        {/* Spacer kosong agar posisi logo bisa agak ke tengah/kanan secara seimbang */}
        <div className="w-9 h-9 md:hidden"></div>
      </div>

      {/* 2. OVERLAY (Latar belakang gelap saat sidebar mobile aktif) */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      )}

      {/* 3. WRAPPER UTAMA SIDEBAR */}
      <div 
        ref={sidebarRef}
        className={`fixed lg:sticky top-0 bottom-0 left-0 w-72 bg-slate-900 text-white flex flex-col h-screen z-50 transition-transform duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        
        {/* Logo */}
        <div className="p-8 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-3 group">
            {/* Ukuran logo desktop bisa dibedakan di sini jika mau */}
            <Logo className="px-2 h-8 w-auto" />
          </Link>
          {/* Tombol close internal khusus mobile */}
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsOpenMobile(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <hr className="border-slate-800 w-full mb-4"/>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Profil */}
        <div className="p-4 mt-auto relative" ref={dropdownRef}>
          
          {/* Dropdown menu */}
          {isProfileOpen && (
            <div className="absolute bottom-20 left-4 right-4 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <User size={16} /> Lihat Profil
              </Link>
              <div className="h-[1px] bg-slate-700 my-1 mx-4"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}

          {/* Profile card */}
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all border ${
              isProfileOpen ? 'bg-slate-800 border-slate-600' : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative flex-shrink-0">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'User')}&background=0D8ABC&color=fff`}
                  alt="User" 
                  className="w-9 h-9 rounded-full border border-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs font-bold text-white truncate text-ellipsis">
                  {user?.nama || 'User'}
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Online</span>
              </div>
            </div>
            <ChevronUp size={16} className={`text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Footer */}
          <div className="mt-4 text-[9px] text-slate-600 text-center uppercase tracking-[0.2em] font-bold">
            2026 • TrashTrack
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;