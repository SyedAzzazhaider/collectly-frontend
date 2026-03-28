import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { Plus, Search, Mail, Smartphone, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const CATEGORIES = ["All", "Email", "SMS", "WhatsApp"];

export default function Templates() {
  const [search, setSearch]     = useState("");
  const [activeCat, setActiveCat] = useState("All");

  return (
    <AppLayout>
      <Header title="Templates" subtitle="Manage your notification templates">
        <Link to="/templates/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
          <Plus className="h-4 w-4" /> New Template
        </Link>
      </Header>
      <main className="p-6 space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates…"
              className="w-full rounded-lg border border-input bg-card pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${activeCat === c ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <div className="flex justify-center gap-4 mb-4 text-muted-foreground">
            <Mail className="h-8 w-8" />
            <Smartphone className="h-8 w-8" />
            <MessageSquare className="h-8 w-8" />
          </div>
          <p className="text-sm font-medium">No templates yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first reminder template to get started.</p>
          <Link to="/templates/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary mt-4 px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
            <Plus className="h-4 w-4" /> Create Template
          </Link>
        </div>
      </main>
    </AppLayout>
  );
}
