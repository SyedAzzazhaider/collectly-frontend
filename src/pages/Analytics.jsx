import AppLayout  from '@/components/layout/AppLayout';
import Header     from '@/components/layout/Header';
import { StatCard } from '@/components/ui/shared';
import { useAgentDashboard, useRecoveryRate } from '@/hooks/useDashboard';
import { useDeliveryStats } from '@/hooks/useNotifications';
import { formatCurrency } from '@/utils/formatters';
import {
  TrendingUp, DollarSign, Clock, CheckCircle2, Loader2,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['hsl(239,84%,67%)', 'hsl(0,84%,60%)', 'hsl(47,96%,53%)', 'hsl(142,71%,45%)'];

export default function Analytics() {
  const { data: agentData, isLoading: agentLoading } = useAgentDashboard({ period: '30d' });
  const { data: rrData,    isLoading: rrLoading    } = useRecoveryRate({ period: '30d' });
  const { data: dlvData,   isLoading: dlvLoading   } = useDeliveryStats();

  const overdueList  = agentData?.overdueList?.invoices || [];
  const recoveryRate = rrData?.recoveryRate ?? 0;
  const totalCollected = rrData?.totalPaid   ?? 0;

  // Channel delivery breakdown for pie chart
  const channelPie = dlvData?.byChannel
    ? Object.entries(dlvData.byChannel).map(([name, stats]) => ({
        name,
        value: stats.total || 0,
      }))
    : [];

  // Aging summary from overdue list
  const aging = [
    { range: '1–30 days',  count: overdueList.filter((i) => i.daysOverdue <= 30).length },
    { range: '31–60 days', count: overdueList.filter((i) => i.daysOverdue > 30 && i.daysOverdue <= 60).length },
    { range: '61–90 days', count: overdueList.filter((i) => i.daysOverdue > 60 && i.daysOverdue <= 90).length },
    { range: '90+ days',   count: overdueList.filter((i) => i.daysOverdue > 90).length },
  ];

  const isLoading = agentLoading || rrLoading || dlvLoading;

  return (
    <AppLayout>
      <Header title="Analytics" subtitle="Track your collection performance" />
      <main className="p-6 space-y-6 animate-fade-in">

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Recovery Rate"
                value={`${recoveryRate}%`}
                trend="Invoices paid after reminder"
                trendUp={recoveryRate > 50}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <StatCard
                label="Total Collected"
                value={formatCurrency(totalCollected)}
                trend="Invoices marked paid"
                trendUp
                icon={<DollarSign className="h-5 w-5" />}
              />
              <StatCard
                label="Delivery Rate"
                value={dlvData?.byStatus
                  ? `${Math.round(((dlvData.byStatus.sent || 0) / (dlvData.total || 1)) * 100)}%`
                  : '—'}
                trend="Notifications delivered"
                trendUp
                icon={<Clock className="h-5 w-5" />}
              />
              <StatCard
                label="Overdue Invoices"
                value={String(agentData?.overdueList?.pagination?.total || 0)}
                trend="Currently outstanding"
                trendUp={false}
                icon={<CheckCircle2 className="h-5 w-5" />}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Aging Summary */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold mb-4">Overdue Aging Summary</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={aging}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                    <Tooltip
                      contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)', fontSize: 13 }}
                    />
                    <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Channel Breakdown */}
              {channelPie.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-base font-semibold mb-4">Notifications by Channel</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={channelPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {channelPie.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)', fontSize: 13 }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Overdue Table */}
            {overdueList.length > 0 && (
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-semibold">Top Overdue Invoices</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground border-b border-border">
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium">Invoice</th>
                        <th className="px-6 py-3 font-medium">Outstanding</th>
                        <th className="px-6 py-3 font-medium">Days Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueList.slice(0, 8).map((inv) => (
                        <tr key={inv._id} className="border-t border-border hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-3 font-medium">{inv.customerId?.name || '—'}</td>
                          <td className="px-6 py-3 text-muted-foreground">{inv.invoiceNumber}</td>
                          <td className="px-6 py-3 font-semibold text-destructive">
                            {formatCurrency(inv.outstanding ?? inv.amount)}
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                              {inv.daysOverdue}d
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </AppLayout>
  );
}