import { Bell, Search, X } from "lucide-react";
import { useLayout } from "./AppLayout";
import { useAuthStore } from "@/store/AuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function Header({ title, subtitle, children }) {
  const { setMobileOpen, setCollapsed } = useLayout();
  const { user } = useAuthStore();
  const navigate  = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    navigate(`/customers?search=${encodeURIComponent(searchVal.trim())}`);
    setSearchOpen(false);
    setSearchVal("");
  };

  const displayName = user?.name ?? "User";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => { setMobileOpen(true); setCollapsed(false); }}
          className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {!searchOpen && (
          <div className="hidden sm:block">
            {title    && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {children}

        {/* Search */}
        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              autoFocus
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search customers, invoices…"
              className="w-56 rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" className="rounded-lg p-2 bg-primary text-primary-foreground hover:opacity-90">
              <Search className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => { setSearchOpen(false); setSearchVal(""); }}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        {/* Alerts */}
        <button
          onClick={() => navigate("/dashboard")}
          className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Alerts"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* Avatar → Settings */}
        <button
          onClick={() => navigate("/settings")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-80 transition-opacity"
          title="Settings"
        >
          {getInitials(displayName)}
        </button>
      </div>
    </header>
  );
}