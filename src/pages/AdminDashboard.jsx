import { 
  Users, 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  BarChart3, 
  Activity, 
  ShieldAlert,
  Mail,
  MessageSquare,
  Smartphone,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/ui/shared";

export default function AdminDashboard() {
  const planData = [
    { name: "Starter", users: 450, total: 1243, color: "bg-blue-500" },
    { name: "Pro", users: 680, total: 1243, color: "bg-primary" },
    { name: "Enterprise", users: 113, total: 1243, color: "bg-purple-500" },
  ];

  const notifications = [
    { type: "Email", count: "12,450", icon: Mail, color: "text-blue-500" },
    { type: "SMS", count: "8,200", icon: Smartphone, color: "text-green-500" },
    { type: "WhatsApp", count: "5,120", icon: MessageSquare, color: "text-emerald-500" },
  ];

  const systemHealth = [
    { label: "API Response Time", value: "142ms", status: "Healthy" },
    { label: "System Uptime", value: "99.98%", status: "Healthy" },
  ];

  const complianceAlerts = [
    { type: "GDPR Request", user: "user_8912", time: "2h ago" },
    { type: "Unsubscribe", user: "user_4431", time: "4h ago" },
    { type: "GDPR Request", user: "user_1102", time: "1d ago" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Standalone Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4 pl-2">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Monitoring</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Platform-wide performance overview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">C</div>
            <span className="text-lg font-bold hidden sm:block">Collectly Admin</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 lg:p-10 space-y-8 animate-fade-in">
        {/* Top Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Total Users" 
            value="1,243" 
            trend="8% from last month" 
            trendUp={true} 
            icon={<Users className="h-5 w-5" />} 
          />
          <StatCard 
            label="Monthly Revenue" 
            value="$12,450" 
            trend="15% from last month" 
            trendUp={true} 
            icon={<DollarSign className="h-5 w-5" />} 
          />
          <StatCard 
            label="Active Subscriptions" 
            value="987" 
            trend="12% from last month" 
            trendUp={true} 
            icon={<CreditCard className="h-5 w-5" />} 
          />
          <StatCard 
            label="Delivery Success" 
            value="97.3%" 
            trend="0.5% from last month" 
            trendUp={true} 
            icon={<CheckCircle2 className="h-5 w-5" />} 
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Users by Plan */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              Users by Plan
            </h2>
            <div className="space-y-8">
              {planData.map((plan) => {
                const percentage = (plan.users / plan.total) * 100;
                return (
                  <div key={plan.name} className="space-y-3">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{plan.name}</span>
                      <span className="text-muted-foreground">{plan.users} users ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${plan.color} transition-all duration-700 ease-out`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Notifications Volume */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" />
              Recent Notifications (24h)
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {notifications.map((notif) => (
                <div key={notif.type} className="rounded-xl border border-border p-6 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`p-3 rounded-xl bg-white mb-4 w-fit shadow-sm ${notif.color}`}>
                    <notif.icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">{notif.type}</p>
                  <p className="text-3xl font-bold mt-2">{notif.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* System Health */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm lg:col-span-1">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" />
              System Health
            </h2>
            <div className="space-y-6">
              {systemHealth.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{item.label}</p>
                    <p className="text-xl font-bold">{item.value}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold uppercase tracking-wide">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Compliance Alerts
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-border text-left text-[10px] text-muted-foreground uppercase tracking-widest">
                    <th className="px-5 py-4 font-bold">Alert Type</th>
                    <th className="px-5 py-4 font-bold">Entity ID</th>
                    <th className="px-5 py-4 font-bold">Timestamp</th>
                    <th className="px-5 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceAlerts.map((alert, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-5 font-bold">
                        <span className={`inline-flex items-center gap-2 ${alert.type === 'Unsubscribe' ? 'text-destructive' : 'text-warning'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${alert.type === 'Unsubscribe' ? 'bg-destructive' : 'bg-warning'}`} />
                          {alert.type}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-muted-foreground font-mono text-xs">{alert.user}</td>
                      <td className="px-5 py-5 text-muted-foreground italic">{alert.time}</td>
                      <td className="px-5 py-5 text-right">
                        <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">View</button>
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
