import React from "react";
import { Outlet } from "react-router";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export const Layout = () => {
  return (
    <div className="pt-8 px-16 flex flex-col min-h-screen ">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
