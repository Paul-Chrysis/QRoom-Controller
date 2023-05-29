import { Outlet } from "react-router-dom";

import React from "react";
import Navbar from "../secondLayer/navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="App">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
