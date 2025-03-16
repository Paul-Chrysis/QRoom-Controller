import { Outlet } from "react-router-dom";

import React from "react";
import Navbar from "../secondLayer/navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="h-[85%] flex flex-col justify-center items-center bg-slate-100">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
