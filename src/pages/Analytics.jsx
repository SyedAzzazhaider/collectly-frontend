import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatCard } from "@/components/ui/shared";
import { TrendingUp, DollarSign, Clock, CheckCircle2, Download } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { formatCurrency } from "@/utils/formatters";

const CHANNEL_COLORS = ["hsl(239,84%,67%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)"];

const useAnalytics = () =>
  useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const [agent, recovery] = await Promise.all([
        axiosInstance.get("/dashboard/agent"),
        axiosInstance.get("/dashboard/agent/recovery-rate"),
      ]);
      return {
        stats:       agent.data.data?.stats          ?? {},
        paymentTrends: agent.data.data?.paymentTrends ?? [],
        agingSummary:  agent.data.data?.agingSummary  ?? [],
        channelBreakdown: agent.data.data?.channelBreakdown ?? [],
        recoveryRate:  recovery.data.data?.monthly    ?? [],
      };
    },
    staleTime: 2 * 60 * 1000,
  });

export default function Analytics() {
  const { data, isLoading } = useAnalytics();

  const stats          = data?.stats          ?? {};
  const paymentTrends  = data?.paymentTrends  ?? [];
  const agingSummary   = data?.agingSummary   ?? [];
  const channelData    = data?.channelBreakdown ?? [];
  const recoveryData   = data?.recoveryRate   ?? [];

  const Empty = ({ height = 250 }) => (
    <div className={`flex items-center justify-center text-sm text-muted-foreground`} style={{ height }}>
      No data yet
    </div>
  );

  return (
    <AppLayout>
      <Header title="Analytics" subtitle="Track your collection performance">
        <button className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          <Download className="h-4 w-4" /> Export PDF
        </button>
      </Header>
      <main className="p-6 space-y-6 animate-fade-in">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Recovery Rate"    value={isLoading ? "…" : `${stats.recoveryRate ?? 0}%`}                      trendUp icon={<TrendingUp   className="h-5 w-5" />} />
          <StatCard label="Total Collected"  value={isLoading ? "…" : formatCurrency(stats.totalCollected ?? 0)}           trendUp icon={<DollarSign   className="h-5 w-5" />} />
          <StatCard label="Avg. Payment Time" value={isLoading ? "…" : `${stats.avgPaymentDays ?? 0} days`}                trendUp icon={<Clock        className="h-5 w-5" />} />
          <StatCard label="Success Rate"     value={isLoading ? "…" : `${stats.deliverySuccessRate ?? 0}%`}                trendUp icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Recovery Rate Over Time</h3>
            {isLoading ? <Empty /> : recoveryData.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={recoveryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220,9%,46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,9%,46%)" unit="%" />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", fontSize: 13 }} />
                  <Line type="monotone" dataKey="rate" stroke="hsl(239,84%,67%)" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Aging Summary</h3>
            {isLoading ? <Empty /> : agingSummary.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={agingSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,9%,46%)" />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", fontSize: 13 }} />
                  <Bar dataKey="amount" fill="hsl(239,84%,67%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Channel Performance</h3>
            {isLoading ? <Empty /> : channelData.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={channelData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}>
                    {channelData.map((_, i) => <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Collected vs Outstanding</h3>
            {isLoading ? <Empty /> : paymentTrends.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={paymentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220,9%,46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,9%,46%)" />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", fontSize: 13 }} />
                  <Legend />
                  <Bar dataKey="collected"   fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outstanding" fill="hsl(0,84%,60%)"   radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
