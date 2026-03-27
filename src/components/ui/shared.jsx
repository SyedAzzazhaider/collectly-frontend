import { getInitials, getStatusColor } from "@/utils/formatters";

export function StatusBadge({ status }) {
  const colorMap = {
    paid: "bg-success/10 text-success",
    active: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    overdue: "bg-destructive/10 text-destructive",
    expired: "bg-destructive/10 text-destructive",
    draft: "bg-muted text-muted-foreground",
    delivered: "bg-info/10 text-info",
    read: "bg-success/10 text-success",
  };

  const classes = colorMap[status] || "bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${classes.includes("success") ? "bg-success" : classes.includes("warning") ? "bg-warning" : classes.includes("destructive") ? "bg-destructive" : classes.includes("info") ? "bg-info" : "bg-muted-foreground"}`} />
      {status}
    </span>
  );
}

export function UserAvatar({ name, size = "md" }) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold ${sizeClasses[size]}`}>
      {getInitials(name)}
    </div>
  );
}

export function StatCard({ label, value, trend, trendUp, icon }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {trend && (
        <p className={`mt-1 text-sm font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-muted p-4 text-muted-foreground mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
