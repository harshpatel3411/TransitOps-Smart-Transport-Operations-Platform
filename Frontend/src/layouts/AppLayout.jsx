import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const TITLES = {
  "/dashboard": "Dashboard",
  "/vehicles": "Vehicles",
  "/drivers": "Drivers",
  "/trips": "Trips",
  "/maintenance": "Maintenance",
  "/fuel-expenses": "Fuel & Expenses",
  "/reports": "Reports",
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || "TransitOps";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] lg:flex">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
