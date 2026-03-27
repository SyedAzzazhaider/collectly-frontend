import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { MOCK_TEMPLATES } from "@/data/mockData";
import { Plus, Search, Mail, Smartphone, MessageSquare, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const categories = ["All", "Friendly", "Standard", "Urgent", "Legal"];

const channelIcons = {
  email: <Mail className="h-4 w-4" />,
  sms: <Smartphone className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
};

export default function Templates() {
  const [activeCat, setActiveCat] = useState("All");
  const filtered = activeCat === "All" ? MOCK_TEMPLATES : MOCK_TEMPLATES.filter(t => t.category === activeCat);

  return (
    <AppLayout>
      <Header title="Templates" subtitle="Manage your message templates">
        <Link to="/templates/1" className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
          <Plus className="h-4 w-4" /> Create Template
        </Link>
      </Header>
      <main className="p-6 space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search templates..." className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCat(c)} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeCat === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(t => (
            <Link key={t.id} to={`/templates/${t.id}`} className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">{channelIcons[t.channel]}</div>
                  <span className="text-xs font-medium text-muted-foreground capitalize">{t.channel}</span>
                </div>
                <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
              <h3 className="mt-4 font-semibold">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.content}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{t.category}</span>
                <span>Edited {t.lastEdited}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
