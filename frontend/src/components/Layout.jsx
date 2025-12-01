import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* --- SIDEBAR DESKTOP --- */}
        {showSidebar && !isMobile && (
          <div className="w-64">
            <Sidebar />
          </div>
        )}

        {/* --- SIDEBAR MOBILE (DRAWER) --- */}
        {isMobile && mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT + NAVBAR --- */}
        <div className="flex-1 flex flex-col relative">
          {/* NAVBAR */}
          <div className="z-50 relative">
            <Navbar
              onMenuClick={() => isMobile && setMobileSidebarOpen(true)}
            />
          </div>

          <main className="flex-1 overflow-y-auto p-3">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
