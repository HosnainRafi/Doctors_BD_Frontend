import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserDashboardSidebar from '../Shared/Navbar/UserDashboardSidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const DashboardUserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <UserDashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex justify-between items-center p-4 bg-white shadow z-10">
          <h1 className="text-purple-700 font-bold text-xl">CarePoint</h1>
          <button onClick={toggleSidebar} className="text-2xl text-purple-700">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>


        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardUserLayout;
