import { Bell, Search, Menu } from "lucide-react";
import { getInitials } from "@/utils/formatters";
import { useLayout } from "./AppLayout";

export default function Header({ title, subtitle, children }) {
  const { setMobileOpen, setCollapsed } = useLayout();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => { setMobileOpen(true); setCollapsed(false); }}
          className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
        <button className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Search className="h-5 w-5" />
        </button>
        <button className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          {getInitials("Alex Morgan")}
        </div>
      </div>
    </header>
  );
}
