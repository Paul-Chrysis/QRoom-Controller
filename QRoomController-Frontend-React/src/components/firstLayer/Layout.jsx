import { Outlet } from "react-router-dom";
import React from "react";
import Navbar from "../secondLayer/navbar/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100">
      <Navbar />
      <main className="h-[85%] flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <footer className="bg-primary-900 text-white text-center py-2 text-sm">
        <p>© 2025 QRoomController - Smart Room Control System</p>
      </footer>
    </div>
  );
};

export default Layout;
