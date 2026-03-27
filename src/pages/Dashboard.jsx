import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatCard, StatusBadge } from "@/components/ui/shared";
import { MOCK_INVOICES, MOCK_CHART_DATA } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { DollarSign, TrendingUp, Send, FileText, Plus, Users, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  return (
    <AppLayout>
      <Header title="Dashboard" subtitle="Welcome back, Alex! Here's your collection overview." />
      <main className="p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Overdue" value="$24,500" trend="12% from last month" trendUp={false} icon={<DollarSign className="h-5 w-5" />} />
          <StatCard label="Recovery Rate" value="78%" trend="5% from last month" trendUp={true} icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard label="Reminders Sent" value="1,234" trend="18% from last month" trendUp={true} icon={<Send className="h-5 w-5" />} />
          <StatCard label="Open Invoices" value="45" trend="3 new this week" trendUp icon={<FileText className="h-5 w-5" />} />
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Payment Trends</h2>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {["Week", "Month", "Quarter"].map((t, i) => (
                <button key={t} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${i === 1 ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MOCK_CHART_DATA.paymentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 91%)", fontSize: 13 }} />
              <Line type="monotone" dataKey="collected" stroke="hsl(239, 84%, 67%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="outstanding" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-0.5 w-4 bg-primary rounded" /> Collected</span>
            <span className="flex items-center gap-2"><span className="h-0.5 w-4 bg-destructive rounded border-dashed" /> Outstanding</span>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Recent Invoices */}
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
                  {MOCK_INVOICES.slice(0, 5).map(inv => (
                    <tr key={inv.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-3 font-medium">{inv.number}</td>
                      <td className="px-6 py-3 text-muted-foreground">{inv.customer}</td>
                      <td className="px-6 py-3 font-medium">{formatCurrency(inv.amount)}</td>
                      <td className="px-6 py-3 text-muted-foreground">{formatDate(inv.dueDate)}</td>
                      <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
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
              <div className="space-y-3">
                {[
                  { name: "John Doe", amount: "$500", days: "2 days" },
                  { name: "Emily Davis", amount: "$3,200", days: "5 days" },
                  { name: "Michael Chen", amount: "$480", days: "7 days" },
                ].map(r => (
                  <div key={r.name} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">Due in {r.days}</p>
                    </div>
                    <span className="font-semibold">{r.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
