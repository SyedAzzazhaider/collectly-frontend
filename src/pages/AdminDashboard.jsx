import { Users, DollarSign, CreditCard, CheckCircle2, BarChart3, Activity, ShieldAlert, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/ui/shared";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

const useAdminDashboard = () =>
  useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/admin");
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  const overview    = data?.overview    || {};
  const planBreakdown = data?.planBreakdown || [];
  const notifications = data?.notificationVolume || {};
  const systemHealth  = data?.systemHealth || [];
  const complianceAlerts = data?.complianceAlerts || [];

  const totalUsers = planBreakdown.reduce((s, p) => s + (p.count ?? 0), 0) || overview.totalUsers || 0;

  const channelIcons = { email: Mail, sms: Smartphone, whatsapp: MessageSquare };
  const channelColors = { email: "text-blue-500", sms: "text-green-500", whatsapp: "text-emerald-500" };
  const planColors = ["bg-blue-500", "bg-primary", "bg-purple-500", "bg-orange-500"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4 pl-2">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Monitoring</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Platform-wide performance overview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground mr-2">? Agent View</Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">C</div>
            <span className="text-lg font-bold hidden sm:block">Collectly Admin</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 lg:p-10 space-y-8 animate-fade-in">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users"           value={isLoading ? "…" : String(totalUsers)}                     trendUp={true} icon={<Users className="h-5 w-5" />} />
          <StatCard label="Monthly Revenue"       value={isLoading ? "…" : `$${(overview.monthlyRevenue ?? 0).toLocaleString()}`} trendUp={true} icon={<DollarSign className="h-5 w-5" />} />
          <StatCard label="Active Subscriptions"  value={isLoading ? "…" : String(overview.activeSubscriptions ?? 0)} trendUp={true} icon={<CreditCard className="h-5 w-5" />} />
          <StatCard label="Delivery Success"      value={isLoading ? "…" : `${overview.deliverySuccessRate ?? 0}%`}  trendUp={true} icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" /> Users by Plan
            </h2>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : planBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subscription data yet</p>
            ) : (
              <div className="space-y-8">
                {planBreakdown.map((plan, idx) => {
                  const pct = totalUsers > 0 ? (plan.count / totalUsers) * 100 : 0;
                  return (
                    <div key={plan.plan ?? plan.name} className="space-y-3">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="capitalize">{plan.plan ?? plan.name}</span>
                        <span className="text-muted-foreground">{plan.count} users ({Math.round(pct)}%)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${planColors[idx % planColors.length]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" /> Recent Notifications (24h)
            </h2>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-3">
                {["email", "sms", "whatsapp"].map(ch => {
                  const Icon = channelIcons[ch];
                  const count = notifications[ch] ?? 0;
                  return (
                    <div key={ch} className="rounded-xl border border-border p-6 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className={`p-3 rounded-xl bg-white mb-4 w-fit shadow-sm ${channelColors[ch]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground capitalize">{ch}</p>
                      <p className="text-3xl font-bold mt-2">{count.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm lg:col-span-1">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" /> System Health
            </h2>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : systemHealth.length === 0 ? (
              <div className="space-y-6">
                {[{ label: "API Response Time", value: "—" }, { label: "System Uptime", value: "—" }].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{item.label}</p>
                      <p className="text-xl font-bold">{item.value}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">Healthy</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {systemHealth.map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{item.label}</p>
                      <p className="text-xl font-bold">{item.value}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">{item.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-destructive" /> Compliance Alerts
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-border text-left text-[10px] text-muted-foreground uppercase tracking-widest">
                    <th className="px-5 py-4 font-bold">Alert Type</th>
                    <th className="px-5 py-4 font-bold">Entity</th>
                    <th className="px-5 py-4 font-bold">Timestamp</th>
                    <th className="px-5 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">Loading…</td></tr>
                  ) : complianceAlerts.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">No compliance alerts</td></tr>
                  ) : complianceAlerts.map((alert, i) => (
                    <tr key={alert._id ?? i} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-5 font-bold">
                        <span className={`inline-flex items-center gap-2 ${alert.type === "Unsubscribe" ? "text-destructive" : "text-yellow-600"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${alert.type === "Unsubscribe" ? "bg-destructive" : "bg-yellow-500"}`} />
                          {alert.type}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-muted-foreground font-mono text-xs">{alert.entityId ?? alert.user}</td>
                      <td className="px-5 py-5 text-muted-foreground italic">{alert.time ?? alert.createdAt}</td>
                      <td className="px-5 py-5 text-right">
                        <Link to="/admin/compliance" className="text-xs font-bold text-primary hover:underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
