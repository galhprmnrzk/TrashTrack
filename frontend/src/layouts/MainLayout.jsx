import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans flex-col lg:flex-row">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      {/* pt-16 hanya aktif di layar mobile, saat masuk layar laptop/desktop (lg) paddingnya hilang (lg:pt-0) */}
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth no-scrollbar pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;