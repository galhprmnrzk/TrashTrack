import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  return (
    <nav className="flex items-center justify-between px-8 md:px-20 py-8 bg-transparent absolute top-0 w-full z-50">
      {/* Logo */}
      <div className="flex-1 items-center gap-2">
        <Logo className='w-40'/>
      </div>

      {/* Nav */}
      <div className="hidden md:flex flex-none items-right gap-10 font-semibold text-sm text-slate-400 uppercase tracking-widest">
        <a href="#about" onClick={(e) => handleScrollTo(e, 'about')} className="hover:text-blue-500 transition-colors">Tentang</a>
        <a href="#tech" onClick={(e) => handleScrollTo(e, 'tech')} className="hover:text-blue-500 transition-colors">Teknologi</a>
        <a href="#developer" onClick={(e) => handleScrollTo(e, 'developer')} className="hover:text-blue-500 transition-colors">Pengembang</a>
      </div>

      <div className="flex-1 flex items-center justify-end gap-4 font-semibold text-sm text-slate-400 uppercase tracking-widest">
        <Link 
          to="/login"
          className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all font-bold"
        >Masuk</Link>
        <Link 
          to="/register" 
          className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all font-bold"
        >Daftar</Link>
      </div>
    </nav>
  );
};

export default Navbar;