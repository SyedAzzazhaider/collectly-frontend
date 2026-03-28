import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, FileText, GitBranch, Inbox, BarChart3,
  FileEdit, LinkIcon, Settings, CreditCard, LogOut, ChevronLeft, Menu,
  Search, Bell, ShieldCheck
} from "lucide-react";
import { getInitials } from "@/utils/formatters";
import { useAuthStore } from "@/store/AuthStore";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Customers", icon: Users, path: "/customers" },
  { label: "Invoices", icon: FileText, path: "/invoices" },
  { label: "Sequences", icon: GitBranch, path: "/sequences" },
  { label: "Inbox", icon: Inbox, path: "/inbox", badge: 2 },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Templates", icon: FileEdit, path: "/templates" },
  { label: "Payment Links", icon: LinkIcon, path: "/payment-links" },
  { label: "Search",     icon: Search,      path: "/search" },
  { label: "Alerts",     icon: Bell,        path: "/alerts" },
  { label: "Compliance", icon: ShieldCheck, path: "/compliance" },
  { label: "Settings",   icon: Settings,    path: "/settings" },
  { label: "Billing",    icon: CreditCard,  path: "/billing" },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.name ?? "User";
  const displayRole = user?.role ?? "";

  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col bg-secondary text-secondary-foreground transition-all duration-300
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">C</div>
              <span className="text-lg font-bold">Collectly</span>
            </Link>
          )}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="rounded-md p-1.5 hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-3">
          <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {getInitials(displayName)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-sidebar-muted truncate capitalize">{displayRole}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-sidebar-muted hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleLogout}
              title="Logout"
              className="mt-2 flex w-full items-center justify-center rounded-lg p-2 text-sidebar-muted hover:text-destructive hover:bg-sidebar-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}