import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X } from 'lucide-react'; // Tambahkan icon untuk mobile menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    setIsOpen(false); // Tutup menu mobile jika link diklik
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  return (
    <>
      {/* Wrapper Utama Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-6 bg-transparent absolute top-0 left-0 w-full z-50">
        
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link to="/">
            <Logo className="w-32 md:w-40 h-auto" />
          </Link>
        </div>

        {/* Center Section: Main Nav Links (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-10 font-semibold text-xs tracking-widest uppercase text-slate-400">
          <a href="#about" onClick={(e) => handleScrollTo(e, 'about')} className="hover:text-blue-500 transition-colors">Tentang</a>
          <a href="#tech" onClick={(e) => handleScrollTo(e, 'tech')} className="hover:text-blue-500 transition-colors">Teknologi</a>
          <a href="#developer" onClick={(e) => handleScrollTo(e, 'developer')} className="hover:text-blue-500 transition-colors">Pengembang</a>
        </div>

        {/* Right Section: Auth Buttons (Desktop Only) */}
        <div className="hidden md:flex items-center gap-4 font-bold text-xs tracking-widest uppercase">
          <Link 
            to="/login"
            className="text-slate-300 hover:text-white px-4 py-2 transition-colors"
          >
            Masuk
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
          >
            Daftar
          </Link>
        </div>

        {/* Mobile Hamburger Button (Hanya muncul di layar kecil) */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800 transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* MOBILE MENU DROPDOWN (Slide down dari atas saat hamburger di-klik) */}
      {/* ========================================================================= */}
      <div 
        className={`fixed inset-x-0 top-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-900 z-40 px-6 pt-24 pb-8 transition-all duration-300 transform md:hidden
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <div className="flex flex-col gap-6 text-center font-semibold text-sm text-slate-400 uppercase tracking-widest">
          {/* Nav Links Mobile */}
          <a href="#about" onClick={(e) => handleScrollTo(e, 'about')} className="py-2 hover:text-blue-500 transition-colors">Tentang</a>
          <a href="#tech" onClick={(e) => handleScrollTo(e, 'tech')} className="py-2 hover:text-blue-500 transition-colors">Teknologi</a>
          <a href="#developer" onClick={(e) => handleScrollTo(e, 'developer')} className="py-2 hover:text-blue-500 transition-colors">Pengembang</a>
          
          <hr className="border-slate-900 my-2" />

          {/* Auth Links Mobile */}
          <div className="flex flex-col gap-3">
            <Link 
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-slate-300 font-semibold py-3 rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors"
            >
              Masuk
            </Link>
            <Link 
              to="/register" 
              onClick={() => setIsOpen(false)}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-500 transition-colors"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;