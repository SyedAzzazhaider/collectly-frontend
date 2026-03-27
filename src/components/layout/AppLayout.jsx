import { useState, createContext, useContext } from "react";
import Sidebar from "./Sidebar";

const LayoutContext = createContext(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within a LayoutProvider");
  return context;
};

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "lg:pl-[72px]" : "lg:pl-64"}`}>
          <div className="flex-1 overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
