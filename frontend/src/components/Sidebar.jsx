import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo'
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home as HomeIcon, Bell, History, Settings, Cpu, LogOut, User, ChevronUp } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { name: 'Beranda', path: '/home', icon: <HomeIcon size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Notifikasi', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'Riwayat', path: '/history', icon: <History size={20} /> },
    { name: 'Perangkat', path: '/device', icon: <Cpu size={20} /> },
    { name: 'Sistem', path: '/system', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen relative">
      
      {/* Logo */}
      <div className="p-8">
        <Link to="/home" className="flex items-center gap-3 group">
          <Logo className="px-2" />
        </Link>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 px-4 space-y-1">
      <hr className="border-slate-400 w-full mb-4"/>
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
            <Link 
              to="/" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => setIsProfileOpen(false)}
            >
              <LogOut size={16} /> Logout
            </Link>
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
                src="https://ui-avatars.com/api/?name=Admin+Trash&background=0D8ABC&color=fff" 
                alt="User" 
                className="w-9 h-9 rounded-full border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-bold text-white truncate text-ellipsis">Admin TrashTrack</span>
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
  );
};

export default Sidebar;