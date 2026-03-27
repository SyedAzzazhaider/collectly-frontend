import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatCard, StatusBadge } from "@/components/ui/shared";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { DollarSign, TrendingUp, Send, FileText, Users, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const useAgentDashboard = () =>
  useQuery({
    queryKey: ["dashboard", "agent"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/agent");
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });

export default function Dashboard() {
  const { data, isLoading } = useAgentDashboard();

  const stats = data?.stats || {};
  const recentInvoices = data?.recentInvoices || [];
  const paymentTrends = data?.paymentTrends || [];
  const upcomingReminders = data?.upcomingReminders || [];

  return (
    <AppLayout>
      <Header title="Dashboard" subtitle="Welcome back! Here's your collection overview." />
      <main className="p-6 space-y-6 animate-fade-in">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Overdue" value={isLoading ? "…" : formatCurrency(stats.totalOverdue ?? 0)} icon={<DollarSign className="h-5 w-5" />} />
          <StatCard label="Recovery Rate" value={isLoading ? "…" : `${stats.recoveryRate ?? 0}%`} trendUp={true} icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard label="Reminders Sent" value={isLoading ? "…" : String(stats.remindersSent ?? 0)} trendUp={true} icon={<Send className="h-5 w-5" />} />
          <StatCard label="Open Invoices" value={isLoading ? "…" : String(stats.openInvoices ?? 0)} trendUp icon={<FileText className="h-5 w-5" />} />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Payment Trends</h2>
          </div>
          {isLoading ? (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={paymentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 91%)", fontSize: 13 }} />
                <Line type="monotone" dataKey="collected" stroke="hsl(239, 84%, 67%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="outstanding" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          )}
          <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-0.5 w-4 bg-primary rounded" /> Collected</span>
            <span className="flex items-center gap-2"><span className="h-0.5 w-4 bg-destructive rounded" /> Outstanding</span>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between p-6 pb-4">
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <Link to="/invoices" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-t border-border text-left text-xs text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Invoice</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">Loading…</td></tr>
                  ) : recentInvoices.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">No invoices yet</td></tr>
                  ) : recentInvoices.slice(0, 5).map(inv => (
                    <tr key={inv._id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-3 font-medium">{inv.invoiceNumber}</td>
                      <td className="px-6 py-3 text-muted-foreground">{inv.customer?.name ?? "—"}</td>
                      <td className="px-6 py-3 font-medium">{formatCurrency(inv.amount)}</td>
                      <td className="px-6 py-3 text-muted-foreground">{formatDate(inv.dueDate)}</td>
                      <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Add Customer", icon: Users, to: "/customers" },
                  { label: "Create Invoice", icon: FileText, to: "/invoices" },
                  { label: "New Sequence", icon: GitBranch, to: "/sequences" },
                ].map(action => (
                  <Link key={action.label} to={action.to} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
                    <action.icon className="h-4 w-4 text-primary" />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Upcoming Reminders</h2>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : upcomingReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming reminders</p>
              ) : (
                <div className="space-y-3">
                  {upcomingReminders.slice(0, 5).map((r, i) => (
                    <div key={r._id ?? i} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{r.customer?.name ?? r.customerName}</p>
                        <p className="text-xs text-muted-foreground">{r.daysUntilDue != null ? `Due in ${r.daysUntilDue} day${r.daysUntilDue !== 1 ? "s" : ""}` : formatDate(r.dueDate)}</p>
                      </div>
                      <span className="font-semibold">{formatCurrency(r.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
