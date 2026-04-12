import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar - Hapus border-r agar tidak ada garis abu-abu di sampingnya */}
      <aside className="w-72 h-full bg-slate-900 hidden lg:block shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-10">
        <Sidebar />
      </aside>

      {/* Main Content Area - Hanya ngatur scroll, tanpa padding/margin */}
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth no-scrollbar">
          {/* Outlet langsung muncul tanpa pembungkus div tambahan yang punya padding */}
          <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;