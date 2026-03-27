import { format, formatDistanceToNow } from "date-fns";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

export const formatDate = (dateStr) => {
  return format(new Date(dateStr), "MMM d, yyyy");
};

export const formatRelativeTime = (dateStr) => {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
};

export const getInitials = (name) => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

export const getStatusColor = (status) => {
  switch (status) {
    case "paid": return "success";
    case "active": return "success";
    case "pending": return "warning";
    case "overdue": return "destructive";
    case "expired": return "destructive";
    case "draft": return "muted";
    default: return "muted";
  }
};
