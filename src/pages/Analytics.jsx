import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatCard } from "@/components/ui/shared";
import { MOCK_CHART_DATA } from "@/data/mockData";
import { TrendingUp, DollarSign, Clock, CheckCircle2, Download } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function Analytics() {
  return (
    <AppLayout>
      <Header title="Analytics" subtitle="Track your collection performance">
        <button className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          <Download className="h-4 w-4" /> Export PDF
        </button>
      </Header>
      <main className="p-6 space-y-6 animate-fade-in">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Recovery Rate" value="78%" trend="5% from last month" trendUp icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard label="Total Collected" value="$136,500" trend="12% from last month" trendUp icon={<DollarSign className="h-5 w-5" />} />
          <StatCard label="Avg. Payment Time" value="18 days" trend="2 days faster" trendUp icon={<Clock className="h-5 w-5" />} />
          <StatCard label="Success Rate" value="92%" trend="3% improvement" trendUp icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recovery Rate Over Time */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Recovery Rate Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={MOCK_CHART_DATA.recoveryRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" unit="%" />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 91%)", fontSize: 13 }} />
                <Line type="monotone" dataKey="rate" stroke="hsl(239, 84%, 67%)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Aging Summary */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Aging Summary</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={MOCK_CHART_DATA.agingSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 91%)", fontSize: 13 }} />
                <Bar dataKey="amount" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Performance */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Channel Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={MOCK_CHART_DATA.channelPerformance} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {MOCK_CHART_DATA.channelPerformance.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Trends */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Collected vs Outstanding</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={MOCK_CHART_DATA.paymentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 91%)", fontSize: 13 }} />
                <Bar dataKey="collected" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outstanding" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
