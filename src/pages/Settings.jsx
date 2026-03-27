import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { MOCK_TEAM_MEMBERS } from "@/data/mockData";
import { UserAvatar } from "@/components/ui/shared";
import { Camera, Plus, Key, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const tabs = ["Profile", "Organization", "Notifications", "Team", "API"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <AppLayout>
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <main className="p-6 animate-fade-in">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>

        {activeTab === "Profile" && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">AM</div>
                <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm"><Camera className="h-3.5 w-3.5" /></button>
              </div>
              <div>
                <h3 className="font-semibold">Alex Morgan</h3>
                <p className="text-sm text-muted-foreground">alex@collectly.com</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "First Name", value: "Alex" },
                { label: "Last Name", value: "Morgan" },
                { label: "Email", value: "alex@collectly.com" },
                { label: "Phone", value: "+1 (555) 000-0000" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                  <input defaultValue={f.value} className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Timezone</label>
              <select className="w-full max-w-xs rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>America/New_York (EST)</option>
                <option>America/Chicago (CST)</option>
                <option>America/Los_Angeles (PST)</option>
                <option>Europe/London (GMT)</option>
              </select>
            </div>
            <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">Save Changes</button>
          </div>
        )}

        {activeTab === "Organization" && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-border text-muted-foreground"><Camera className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-medium">Company Logo</p>
                <p className="text-xs text-muted-foreground">Upload your company logo (PNG, JPG, max 2MB)</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Company Name", value: "Collectly Inc." },
                { label: "Tax ID / VAT", value: "XX-XXXXXXX" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                  <input defaultValue={f.value} className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Business Address</label>
              <textarea rows={3} defaultValue="123 Main Street, Suite 100&#10;New York, NY 10001" className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">Save Changes</button>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="max-w-2xl space-y-4">
            {[
              { label: "Payment received", desc: "Get notified when a customer makes a payment" },
              { label: "Invoice overdue", desc: "Alert when an invoice becomes overdue" },
              { label: "Customer reply", desc: "Notify when a customer responds to a reminder" },
              { label: "Weekly digest", desc: "Summary of collection performance each week" },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
                  <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary-foreground transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Team" && (
          <div className="max-w-2xl space-y-4">
            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
                <Plus className="h-4 w-4" /> Invite Member
              </button>
            </div>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {MOCK_TEAM_MEMBERS.map(m => (
                <div key={m.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={m.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${m.role === "Admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "API" && (
          <div className="max-w-2xl space-y-4">
            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
                <Key className="h-4 w-4" /> Generate New Key
              </button>
            </div>
            {[
              { name: "Production API Key", key: "sk_live_••••••••••••••••••••4f2a", created: "Jan 15, 2024" },
              { name: "Test API Key", key: "sk_test_••••••••••••••••••••8b1c", created: "Dec 10, 2023" },
            ].map(k => (
              <div key={k.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <p className="text-sm font-medium">{k.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{k.key}</p>
                  <p className="text-xs text-muted-foreground mt-1">Created {k.created}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-md hover:bg-muted text-muted-foreground"><Copy className="h-4 w-4" /></button>
                  <button className="p-2 rounded-md hover:bg-muted text-muted-foreground"><Eye className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
