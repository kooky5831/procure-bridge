
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { HorizontalNav } from "./HorizontalNav";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Outlet } from 'react-router-dom';

export function DefaultLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const showHorizontalNav = location.pathname.startsWith("/requests");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />}
      <div className={!isAuthPage ? "lg:pl-64 transition-all duration-300 ease-in-out" : ""}>
        {!isAuthPage && <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />}
        {showHorizontalNav && <HorizontalNav />}
        <main className={isAuthPage ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
